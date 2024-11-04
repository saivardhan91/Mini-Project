const express = require('express');
const BlockedUsers = require('../controllers/Blocked'); // Adjust path to the location of the controller
const router = express.Router();

// Route to block a user
router.post('/block/:userId', BlockedUsers.Block);

// Route to unblock a user
router.put('/unblock/:userId', BlockedUsers.Unblock);
router.get('/check/:receiverId/:userId', BlockedUsers.checkBlockStatus);
module.exports = router;
