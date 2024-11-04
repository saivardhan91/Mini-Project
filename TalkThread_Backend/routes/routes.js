const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/user'); 
const ConversationController = require('../controllers/conversation'); 
const MessageController=require('../controllers/message');
const userController =require('../controllers/userController');
const CreateUserProfile=require('../controllers/CreateProfile');
const AllPost=require('../controllers/myposts');
const multer=require('multer');
const storage = multer.memoryStorage(); // Store image in memory as a Buffer
const upload = multer({ storage: storage });
const UserModel =require('../model/user');
// const message = require('../controllers/message'); 
// Route for user signup
const checkBlocked = async (req, res, next) => {
    const { sender, receiver } = req.body;
  
    const Sender = await UserModel.findById(sender);
    if (Sender?.blockedUsers?.includes(receiver)) {
      return res.status(403).send({ error: 'User is blocked' });
    }
  
    next();
  };
router.post('/signup', LoginController.signup);

// Route for user signin
router.post('/signin', LoginController.signin);
router.post('/conversation',ConversationController.conversation);
router.get('/conversation/:userId',ConversationController.conversationGet);
router.post('/conversation/messages',checkBlocked, upload.single('image'), MessageController.Message);
router.get('/conversation/messages/:conversationId',MessageController.MessageGet);
router.delete('/conversation/:conversationId/:userId', ConversationController.deleteConversation);
router.get('/user/:id', userController.getUserById);
router.get('/Search',userController.getAllUsers);
// router.post('/message',Conversation.message );
router.get('/conversation',ConversationController.ConversationDetails);
router.put('/conversation', ConversationController.updateConversation);
router.put('/forgotPassword', LoginController.forgotPassword);
router.delete('/DeleteMessage/:id',MessageController.DeleteMessage);
router.put('/UpdateConversationDate/:conversationId',ConversationController.updateConversationDate);
router.put('/reaction/:messageId',MessageController.Reaction);
router.put('/reply/:messageId',MessageController.Reply);
router.get('/getPost/:userId',AllPost.getPosts);
router.put('/follow/:userId',LoginController.followers);
// router.put('/CreateProfile/editprofile',CreateUserProfile.updateprofile);
module.exports = router;
