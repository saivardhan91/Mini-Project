const User = require("../model/user"); // Import the User model

class UserProfileController {
  // Create or update profile
  async CreateProfile(req, res) {
    const { username, bio, email, profileImage } = req.body;
    let imageData = null;
    // Check if a profile image is provided in Base64 and convert it to a buffer
    if (profileImage) {
      const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, ""); // Remove the Base64 prefix if it exists
      imageData = {
        data: Buffer.from(base64Data, "base64"), // Convert Base64 to buffer
        contentType: "image/png", // You may dynamically determine content type if necessary
      };
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's profile fields
      if(username){
       user.username = username;
      }
      user.bio = bio || user.bio;
      if (imageData) {
        user.image = imageData; // Update the profile image if provided
      }

      // Save the updated user data
      await user.save();

      return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Profile update error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  // Retrieve profile
  async getProfile(req, res) {
    const { email } = req.params; // Get the email parameter from the request URL

    try {
        // Attempt to find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists; return 404 if not found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
      // console.log(user);
        // If the user has a profile image, convert it to Base64 format
        let profileImgBase64 = null;
        if (user.image) {
            profileImgBase64 = `data:${user.image.contentType};base64,${user.image.data.toString("base64")}`;
        }

        // Prepare user profile data, including the Base64 image if available
        const userProfile = {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profile: profileImgBase64, // Send Base64 image to the frontend
            role: user.role,
            blockedUsers: user.blockedUsers // Include blocked users if needed
        };

        // Send the user's profile data back to the client with a success message
        return res.status(200).json({ message: "Profile retrieved successfully", userProfile });
    } catch (error) {
        console.error("Error retrieving profile:", error.message);

        // Return a 500 error if an exception occurs
        res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async updateProfile(req,res){
    const { bio, email, profileImage} = req.body;
    let imageData = null;

    // Check if a profile image is provided in Base64 and convert it to a buffer
    if (profileImage) {
      const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, ""); // Remove the Base64 prefix if it exists
      imageData = {
        data: Buffer.from(base64Data, "base64"), // Convert Base64 to buffer
        contentType: "image/png", // You may dynamically determine content type if necessary
      };
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's profile fields
      user.bio = bio || user.bio;
      if (imageData) {
        user.image = imageData; // Update the profile image if provided
      }

      // Save the updated user data
      await user.save();

      return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Profile update error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

module.exports = new UserProfileController();
