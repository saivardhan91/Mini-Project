const User = require("../model/user");

class BlockedUsers {
  // Method to block a user
  async Block(req, res) {
    const { userId } = req.params; // ID of the user to be blocked
    const currentUserId = req.body.currentUserId; // Current logged-in user ID

    try {
      // Find the current user in the database
      const currentUser = await User.findById(currentUserId);

      // Check if the user is already blocked
      if (!currentUser.blockedUsers.includes(userId)) {
        // Add the user to the blockedUsers array
        currentUser.blockedUsers.push(userId);
        await currentUser.save(); // Save changes to the database
        return res.status(200).json({ message: 'User blocked successfully' });
      }

      // If user is already blocked, return a 400 response
      return res.status(400).json({ message: 'User is already blocked' });
    } catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ message: 'Error blocking user', error });
    }
  }

  // Method to unblock a user
  async Unblock(req, res) {
    const { userId } = req.params; // ID of the user to be unblocked
    const currentUserId = req.body.currentUserId; // Current logged-in user ID

    try {
      // Find the current user in the database
      const currentUser = await User.findById(currentUserId);

      // Check if the user is in the blockedUsers array
      if (currentUser.blockedUsers.includes(userId)) {
        // Remove the user from the blockedUsers array
        currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => id.toString() !== userId);
        await currentUser.save(); // Save changes to the database
        return res.status(200).json({ message: 'User unblocked successfully' });
      }

      // If user is not blocked, return a 400 response
      return res.status(400).json({ message: 'User is not blocked' });
    } catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ message: 'Error unblocking user', error });
    }
  }

  // Method to check if a user is blocked
  async checkBlockStatus(req, res) {
    const { receiverId, userId } = req.params; // IDs for receiver and current user

    try {
      // Find the current user in the database
      const currentUser = await User.findById(userId);

      // Check if the receiver is in the blockedUsers array
      const isBlocked = currentUser.blockedUsers.includes(receiverId);

      // Respond with the block status
      return res.status(200).json({ isBlocked });
    } catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ message: 'Error checking block status', error });
    }
  }
}

module.exports = new BlockedUsers();
