import User from "../models/authSchema.js";
import cloudinary from "../config/cloudinaryMain.js";

const UpdateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }
    
    const { username, firstName, lastName, bio, profileImg } = req.body;

    if (profileImg) {
      const uploadResponseImage = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uploadResponseImage.secure_url;
    }

    user.username = username || user.username;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.bio = bio || user.bio;
    
    const updatedUser = await user.save();

    return res.json({
      message: "User updated successfully",
      ok: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
        profileImg: updatedUser.profileImg,
        followers: updatedUser.followers,
        following: updatedUser.following,
        createdAt: updatedUser.createdAt
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -__v');
    
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        ok: false,
      });
    }
    
    return res.json({
      user, 
      ok: true
    });
    
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      ok: false
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v');
    
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        ok: false,
      });
    }
    
    return res.json({
      user,
      ok: true
    });
    
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      ok: false
    });
  }
};

export { UpdateUserProfile, getUserProfile, getMyProfile };