
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
    post: {
        data: { type: String, required: true }, // Image data as Base64
        contentType: { type: String, required: true } // Content type (e.g., image/jpeg)
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    caption: { type: String, maxlength: 50 }, 
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            text: { type: String, required: true }, // Comment text
            name:{type:String,required:true},
            createdAt: { type: Date, default: Date.now }
        }
    ],

    // Likes: Array of user IDs who have liked the post
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

const Post= mongoose.model('Post', postSchema);
module.exports=Post;

