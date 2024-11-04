const PostModel = require('../model/post');
const UserModel = require('../model/user'); // Make sure to import the User model

class MyPosts {
  async getPosts(req, res) {
    try {
      const { user } = req.body; 
      console.log(user);
      // Ensure user is defined
      if (!user || !user.following || !Array.isArray(user.following)) {
        return res.status(400).json({ message: 'User or following list is not defined or not an array.' });
      }

      const following = [...user.following]; // Copy the following array
      following.push(user._id); // Add current user ID to the following list

      if (following.length === 0) {
        return res.status(400).json({ message: 'Following list is required.' });
      }

      // Fetch posts where the user ID is in the following list
      const posts = await PostModel.find({
        userId: { $in: following }
      }).sort({ createdAt: -1 }); // Sort by createdAt timestamp

      const formattedPosts = posts.map(post => {
        // Assuming you have a field named image that is a Buffer
        if (post.post.data && Buffer.isBuffer(post.post.data)) {
          post.post.data = post.post.data.toString('base64'); // Change to post.post.data
        }
        return post;
      });

      const userProfiles = await UserModel.find({ _id: { $in: following } }); // Use UserModel to fetch profiles
      if (!userProfiles || !posts) {
        return res.status(400).json({ message: "User not found or no posts available." });
      }

      const userpro = userProfiles.map(userall => {
        if (userall.profile && Buffer.isBuffer(userall.profile)) {
          userall.profile = userall.profile.toString('base64');
        }
        return userall;
      });

      return res.status(200).json({ allposts: formattedPosts, userp: userpro });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while fetching posts.' });
    }
  }
}

module.exports = new MyPosts();
