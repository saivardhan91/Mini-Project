const MessageModel = require("../model/Message");
const ConversationModel = require("../model/Conversation");

class MessageController {
  // Create a new message and update conversation's updatedAt field
  
  async Message(req, res) {
    const { conversationId, sender, type, subtype, text } = req.body;
    let imageData = null;

    // Check if a file was uploaded and set the imageData accordingly
    if (req.file) {
      imageData = {
        data: req.file.buffer, // Store the buffer
        contentType: req.file.mimetype // Store the file type
      };
    }

    // Prepare the message data, conditionally including image data if provided
    const messageData = {
      conversationId,
      sender,
      type,
      subtype,
      text,
      image: imageData, // Store the image object if an image exists
    };

    const newMessage = new MessageModel(messageData);

    try {
      // Save the new message
      const savedMessage = await newMessage.save();

      // Explicitly update the conversation's updatedAt field
      await ConversationModel.findByIdAndUpdate(
        conversationId,
        { updatedAt: new Date() },
        { new: true }
      );

      // Respond with the saved message
      res.status(200).json(savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ message: "Error saving message", error });
    }
  }

  // Retrieve messages for a specific conversation
  async MessageGet(req, res) {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    try {
      const messages = await MessageModel.find({ conversationId });

      // Convert image buffers to base64 strings for sending to the client
      const messagesWithBase64Images = messages.map(msg => {
        return {
          ...msg._doc,
          image: msg.image && msg.image.data ? msg.image.data.toString('base64') : null, // Convert buffer to base64
        };
      });

      res.status(200).json(messagesWithBase64Images);
    } catch (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).json({ message: "Error retrieving messages", error });
    }
  }
  async DeleteMessage(req, res) {
    try {
      const { id } = req.params; // Corrected from req.parms to req.params
      const message = await MessageModel.findByIdAndDelete(id); // Pass id directly
  
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
  
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
async Reaction(req, res) {
    const { userId, type } = req.body;
    const { messageId } = req.params;
    console.log(userId);
    console.log(type);

    try {
        // Retrieve the message document to modify directly
        const message = await MessageModel.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if the user has already reacted
        const existingReaction = message.reactions.find(r => r.userId === userId);
        if (existingReaction) {
            // Update the existing reaction type
            existingReaction.type = type;
            console.log(`Updated reaction for user ${userId} to ${type}`);
        } else {
            // Add a new reaction
            message.reactions.push({ userId, type });
            console.log(`Added new reaction for user ${userId}: ${type}`);
        }

        // Save changes to the database
        await message.save();

        // Return the updated message
        return res.status(200).json(message);
    } catch (error) {
        console.error("Error updating reaction:", error);
        return res.status(500).json({ message: 'Server error', error });
    }
}
async  Reply(req, res) {
  const { messageId } = req.params;
  const { reply } = req.body;

  try {
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { reply: reply }, // Updating the 'reply' field of the message
      { new: true }     // Return the updated document
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Reply updated successfully", data: message });
  } catch (error) {
    res.status(500).json({ error: "Failed to update the reply", details: error.message });
  }
}

}  

module.exports = new MessageController();
