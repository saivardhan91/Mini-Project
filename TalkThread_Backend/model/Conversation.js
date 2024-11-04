const mongoose = require('mongoose');

// Define the Conversation Schema
const ConversationSchema = new mongoose.Schema({
  members: {
    type: [mongoose.Schema.Types.ObjectId], // Optionally, you can specify ObjectId type for better structure
    ref: 'User', // Reference to a User model if needed
    required: true // Ensures that members field is required
  }
}, { timestamps: true });

// Create and export the model
const ConversationModel = mongoose.model('Conversation', ConversationSchema);
module.exports = ConversationModel;
