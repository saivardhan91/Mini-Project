const express = require('express');
const path = require('path');
const router = express.Router();
const CreateUserProfile = require('../controllers/CreateProfile');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,"uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use a timestamp to create unique filenames
  }
});

const upload = multer({ storage: storage });

// Profile creation route
router.put('/CreateUserProfile', upload.single('profile'), CreateUserProfile.CreateProfile);
router.get('/profile/:email', CreateUserProfile.getProfile);

// Serve static files


module.exports = router;
