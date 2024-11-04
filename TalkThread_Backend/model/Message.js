const mongoose = require('mongoose');

// Define MessageSchema with more specific validations
const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true, // Marked as required
  },
  sender: {
    type: String,
    required: true, // Marked as required
  },
  text: {
    type: String,
    default:null
  },
  type: {
    type: String,
    enum: ['msg', 'image'], // Example validation: only 'msg' or 'image' allowed
    required: true,
  },
  subtype: {
    type: String,
  },
  image: {
    data: { type: Buffer },  // Make 'data' explicitly typed
    contentType: { type: String } // Make 'contentType' explicitly typed
  },
  reactions: [{
    userId: { type: String, required: true }, // User who reacted
    type: { type: String, required: true }, // Type of reaction (like, love, etc.)
    timestamp: { type: Date, default: Date.now } // Timestamp of when the reaction was made
  }],
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Compile model from schema
const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
