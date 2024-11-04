const { Server } = require('socket.io');
const {MessageModel}=require('../TalkThread_Backend/model/Message');
// Initialize Socket.IO server on port 8900 with CORS enabled for localhost:3000
const io = new Server(8900, {
    cors: {
        origin: "http://localhost:3000", // Allows connections from this origin
    },
});

let users = [];

// Function to add a user to the users array
const addUser = (userId, socketId) => {
    console.log("addUserId", userId);
    console.log("addSocketId", socketId);
    const existingUser = users.find((user) => user.userId === userId);
    if (existingUser) {
        // Update socketId if the user reconnects
        existingUser.socketId = socketId;
    } else {
        users.push({ userId, socketId });
    }
};

// Function to remove a user from the users array
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

// Function to get a user by userId
const getUser = (userId) => {
    console.log("userId", userId);
    return users.find((user) => user.userId === userId);
};

// Emit user status update to all clients
const emitUserStatus = () => {
    io.emit("getUsers", users);
};

// Event listener for new connections
io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    // Add user to the users array when they join
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        emitUserStatus(); 
    });

    // Listen for 'sendMessage' and emit the message to the receiver
    socket.on("sendMessage", ({ conversationId, sender, text, image, receiverId, type, subtype,createdAt,_id }) => {
        const message = {
            conversationId,
            sender,
            text: text || null,       // Set text to null if not present
            image: image || null,     // Set image to null if not present
            type,
            subtype,
            createdAt,
            _id
        };
    
        console.log("MessageId", _id);
    
        // Find the receiver by their userId
        const receiver = getUser(receiverId);
        console.log("receiverId", receiverId, "receiverSocketId", receiver?.socketId);
    
        if (receiver) {
            // Emit the message to the specific receiver's socket
            io.to(receiver.socketId).emit("getMessage", message);
        } else {
            console.log("Receiver not connected");
        }
    });
    // Assuming `io` is your Socket.IO server instance and `getUser` is a function to find the user by ID
    socket.on("deleteMessage", ({ senderId, receiverId, messageId }) => {
        console.log("Received deleteMessage event:", { senderId, receiverId, messageId });

        const receiver = getUser(receiverId);
        const sender = getUser(senderId);
        
        // Emit to the receiver if they exist
        if (receiver) {
            const receiverSocketId = receiver.socketId;
            console.log(`Emitting to receiver ${receiverId} on socket ${receiverSocketId} with messageId ${messageId}`);
            io.to(receiverSocketId).emit('messageDeleted', { messageId,receiverId });
            console.log("Emitted messageDeleted event to receiver:", receiverId);
        } else {
            console.log("Receiver not found or not connected.");
        }

        // Emit to the sender if they exist
        if (sender) {
            const senderSocketId = sender.socketId;
            console.log(`Emitting to sender ${senderId} on socket ${senderSocketId} with messageId ${messageId}`);
            io.to(senderSocketId).emit('messageDeleted', { messageId,receiverId });
            console.log("Emitted messageDeleted event to sender:", senderId);
        } else {
            console.log("Sender not found or not connected.");
        }
    });
    socket.on("conversationUpdated",({receiverId,conversationId})=>{
        // console.log("conversationId",conversationId);
        // console.log("conversationId",receiverId);
        const receiver=getUser(receiverId);
        // console.log(receiver);
        io.to(receiver?.socketId).emit("conversationUpdated",conversationId);
    })

 socket.on("reaction",({receiverId,messageId})=>{
   const receiver=getUser(receiverId);
   io.to(receiver?.socketId).emit("getReaction",messageId);
 })
    // Handle logout event (Don't disconnect the socket)
    socket.on("logout", () => {
        console.log("User logged out:", socket.id);

        // Remove the user from the users array
        removeUser(socket.id);

        // Emit updated user status to all clients
        emitUserStatus();

        // You don't need to call socket.disconnect() here
    });
    // socket.on('markAsRead', async ({ messageId, conversationId }) => {
    //     console.log("markread",messageId);
    //     try {
    //        const res= await MessageModel.findByIdAndUpdate(messageId, { read: true });
    //        console.log("res",res);
    //         io.to(conversationId).emit('readNotification', { messageId });
    //     } catch (error) {
    //         console.error('Error marking message as read:', error);
    //     }
    // });

    // socket.on('newMessage', (newMessage) => {
    //     io.to(newMessage.conversationId).emit('newMessage', newMessage);
    // });

    socket.on("newConversation", ({ receiverId,  }) => {
        const receiver = getUser(receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getNewConversation",receiverId);
        }
    });


 socket.on("blockuser",({receiverId,CurrentUser})=>{
    console.log("block",CurrentUser);
    const receiver=getUser(receiverId);
    console.log(receiver);
    
        io.to(receiver?.socketId).emit("blockeUser", {receiverId,CurrentUser});
 })

 socket.on("Unblockuser",({receiverId,CurrentUser})=>{
    console.log("Unblock",CurrentUser);
    const receiver=getUser(receiverId);
    console.log(receiver);
    io.to(receiver?.socketId).emit("UnblockUser", {receiverId,CurrentUser});
        console.log("msgsender");
 })

    // Handle the disconnect event when it happens
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        removeUser(socket.id);
        emitUserStatus(); // Update the users list after disconnection
    });
});
