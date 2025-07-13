import User from "../models/authSchema.js";
import cloudinary from "../config/cloudinaryMain.js";

// authController.js
const UpdateUserProfile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }

    let profileImgUrl = user.profileImg;
    if (req.file) {
      const uploadResponseImage = await cloudinary.uploader.upload(req.file.path);
      profileImgUrl = uploadResponseImage.secure_url;
      fs.unlinkSync(req.file.path);
    }

    user.username = req.body.username || user.username;
    user.fullName = req.body.fullName || user.fullName;
    user.bio = req.body.bio || user.bio;
    user.profileImg = profileImgUrl;
    
    const updatedUser = await user.save();

    return res.json({
      message: "User updated successfully",
      ok: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        bio: updatedUser.bio,
        profileImg: updatedUser.profileImg,
        followers: updatedUser.followers,
        following: updatedUser.following,
        createdAt: updatedUser.createdAt
      },
    });

  } catch (error) {
    console.error("Profile update error:", error);
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

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    return res.json({
      users,
    });
  } catch(err) {
    return res.json({
      message: err.message,
    });
  }
};

const searchUser = async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Search query must be at least 2 characters long"
    });
  }

  try {
    const searchQuery = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } }
      ]
    };

    const users = await User.find(searchQuery)
      .select("-password -__v -email -updatedAt")
      .limit(10)
      .lean();

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during search"
    });
  }
};

export { 
  UpdateUserProfile, 
  getUserProfile, 
  getMyProfile, 
  getAllUser, 
  searchUser 
};