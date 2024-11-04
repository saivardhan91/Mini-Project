const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PostController = require('../controllers/post');

// Create Post endpoint
router.post('/Createposts', upload.single('image'), PostController.Createpost);
router.get('/getPost/',PostController.getPosts);
router.get('/getPost/:userId',PostController.getProfilePosts);
router.put('/addComment/:postId',PostController.Comment);
router.put('/like/:postId',PostController.Likes);
router.get('/Comments/:postId',PostController.getComments);
router.get('/getHomePost/:postId', PostController.getPost)
router.delete('/deletepost/:postId',PostController.deletePost)
module.exports = router;
