const PostModel = require("../model/post"); // Import the Post model with a unique name

class PostController {
    async Createpost(req, res) {
        try {
            const { userId, name, email, caption } = req.body;

            // Convert image buffer to Base64 string
            const base64Image = req.file.buffer.toString('base64');

            // Create a new instance of PostModel
            const newPost = new PostModel({
                userId,
                post: {
                    data: base64Image,
                    contentType: req.file.mimetype 
                },
                name,
                email,
                caption,
            });

            await newPost.save();
            res.status(201).json({ message: 'Post created successfully', post: newPost });
        } catch (error) {
            res.status(500).json({ message: 'Error creating post', error });
        }
    }
     async getPosts (req, res){
        const { userIds } = req.query; // Retrieve userIds from query parameters
        const userIdArray = userIds.split(','); // Convert string to an array
        try {
            const posts = await PostModel.find({ userId: { $in: userIdArray } }).sort({ createdAt: -1 }); // Sort by newest
            res.status(200).json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
}
async getProfilePosts(req, res) {
    const { userId } = req.params;
    // console.log(userId);
    try {
        const posts = await PostModel.find({ userId: userId }).sort({ createdAt: -1 }); // Sort posts by date descending
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
}
async Comment(req,res){
    const { postId } = req.params;
    const { userId, text,name } = req.body;
    

    try {
        const post = await PostModel.findById(postId);
        post.comments.push({ userId, text, name });
        await post.save();

        res.status(201).json(post.comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
}
async Likes(req,res)
{
        const { postId } = req.params;
        const { userId } = req.body;
    
        try {
            const post = await PostModel.findById(postId);
            
            // Check if user already liked the post
            const index = post.likes.indexOf(userId);
            if (index === -1) {
                post.likes.push(userId); // Like the post
            } else {
                post.likes.splice(index, 1); // Unlike the post
            }
    
            await post.save();
            res.status(200).json({ likeCount: post.likes.length, likes: post.likes });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update like' });
        }
    }
    async getComments (req, res){
        const { postId } = req.params;
    
        try {
            // Find the post by ID and select only the comments field
            const post = await PostModel.findById(postId).select('comments');
    
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
    
            // Send back the comments array
            res.status(200).json(post.comments);
        } catch (error) {
            console.error('Error retrieving comments:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    async getPost(req, res)  {
        const postId = req.params.postId;
        try {
            // Fetch the post from the database
            const post = await PostModel.findById(postId)
            // Check if the post exists
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
    
            // Return the found post
            res.status(200).json(post);
        } catch (error) {
            console.error("Error fetching post:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
    async deletePost(req,res){
        const postId = req.params.postId;
        try{
            const delpost= await PostModel.findByIdAndDelete(postId);
            console.log(delpost);
            if(!delpost){
                return res.status(404).json({ message: 'post not deleted' });
            }
            res.status(200).json({ message: 'post deleted' }); 
        }
        catch(err){
            console.error("Error deleteing post:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}
module.exports = new PostController();
