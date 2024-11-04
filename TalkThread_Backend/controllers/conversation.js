const ConversationModel = require("../model/Conversation"); 
class ConversationController {
  async conversation(req, res) {
    const newConversation = new ConversationModel({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      res.status(500).json({ message: "Error saving conversation", error });
    }
  }
  async conversationGet(req, res) {
    try {
      const userId = req.params.userId; // Extract userId correctly
      console.log("User ID:", userId);
      
      const conversations = await ConversationModel.find({
        members: userId // Simplified syntax; $elemMatch not required for simple array matching
      }).sort({ updatedAt: -1 });
      
      console.log("Conversations:", conversations);
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Error retrieving conversations:", error);
      res.status(500).json({ message: "Error retrieving conversations", error });
    }
  }

async  deleteConversation(req, res) {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.params.userId;

    // Pull the user from the 'members' array of the conversation
    const updatedConversation = await ConversationModel.updateOne(
      { _id: conversationId, members: { $in: [userId] } },  
      { $pull: { members: userId } }                         
    );

    // Check if the conversation was updated (i.e., if the user was removed)
    if (updatedConversation.modifiedCount === 0) {
      return res.status(404).json({ message: "Conversation not found or already deleted for this user" });
    }

    res.status(200).json({
      message: "Conversation deleted for this user",
      updatedConversation
    });

  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "Error deleting conversation", error });
  }
}
async ConversationDetails(req, res) {
  const { senderId, receiverId } = req.query;  // Extract the senderId and receiverId from the query parameters

  try {
    // Find the conversation where both the sender and receiver are part of the members array
    const conversation = await ConversationModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Return the conversation details
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error retrieving conversation details:", error);
    res.status(500).json({ message: "Error retrieving conversation details", error });
  }
}

async updateConversation(req, res) {
  const { conversationId, senderId, isBlocked } = req.body; // Get conversationId, senderId, and isBlocked from the request body

  try {
    // Find the conversation by ID
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // If the user is blocked, set senderId to null
    if (isBlocked) {
      conversation.members[0] = null; // Set senderId to null when blocked
      console.log(conversation);
    } else {
      conversation.members[0] = senderId; // Restore senderId when unblocked
    }

    // Save the updated conversation
    const updatedConversation = await conversation.save();
    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(500).json({ message: "Error updating conversation", error });
  }
}
async updateConversationDate(req, res) {
  const { conversationId } = req.params;
  //  console.log(req.params);
  //  console.log(conversationId);
  try {
    // Update the `updatedAt` field to the current date and return the updated document
    const updatedConversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      { updatedAt: Date.now() },
      { new: true } // Returns the updated document
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error("Error updating conversation date:", error);
    res.status(500).json({ message: "Server error", error });
  }
}
}
module.exports = new ConversationController();
