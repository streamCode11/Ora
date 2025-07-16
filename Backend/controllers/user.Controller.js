import User from "../models/authSchema.js";
import Post from "../models/postSchema.js";
import cloudinary from "../config/cloudinaryMain.js";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);

// Enhanced Update User Profile
const UpdateUserProfile = async (req, res) => {
  try {
    const { username, fullName, bio } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        ok: false,
      });
    }

    // Check for username uniqueness if being updated
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          message: "Username already taken",
          ok: false,
        });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }

    // Handle profile image upload
    let profileImgUrl = user.profileImg;
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (user.profileImg) {
          const publicId = user.profileImg.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`profile_images/${publicId}`);
        }

        // Upload new image
        const uploadResponseImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_images",
          transformation: [
            { width: 500, height: 500, crop: "fill" },
            { quality: "auto" }
          ]
        });
        profileImgUrl = uploadResponseImage.secure_url;
        
        // Delete temp file
        await unlinkAsync(req.file.path);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        if (req.file?.path) await unlinkAsync(req.file.path);
        return res.status(500).json({
          message: "Error uploading profile image",
          ok: false,
        });
      }
    }

    // Update user fields
    const updateFields = {
      username: username || user.username,
      fullName: fullName || user.fullName,
      bio: bio || user.bio,
      profileImg: profileImgUrl
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password -__v -email');

    return res.json({
      message: "Profile updated successfully",
      ok: true,
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);
    
    // Clean up uploaded file if error occurred
    if (req.file?.path) {
      try {
        await unlinkAsync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }

    res.status(500).json({ 
      message: error.message.includes("validation failed") 
        ? "Validation error: " + error.message 
        : "Internal server error",
      ok: false 
    });
  }
};

// Enhanced Get User Profile by ID
const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
        ok: false,
      });
    }

    const user = await User.findById(userId)
      .select('-password -email -__v')
      .populate({
        path: 'followers following',
        select: 'username profileImg fullName'
      });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        ok: false,
      });
    }
    
    // Get post count for the user
    const postCount = await Post.countDocuments({ user: userId });

    return res.json({
      user: {
        ...user.toObject(),
        postCount
      }, 
      ok: true
    });
    
  } catch (err) {
    console.error("Get user profile error:", err);
    return res.status(500).json({
      error: err.message,
      ok: false
    });
  }
};

// Enhanced Get My Profile
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .select('-password -__v')
      .populate({
        path: 'followers following savedPosts posts',
        select: 'username profileImg fullName'
      });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        ok: false,
      });
    }

    // Get additional stats
    const postCount = await Post.countDocuments({ user: userId });
    const followingCount = user.following.length;
    const followersCount = user.followers.length;

    return res.json({
      user: {
        ...user.toObject(),
        postCount,
        followingCount,
        followersCount
      },
      ok: true
    });
    
  } catch (err) {
    console.error("Get my profile error:", err);
    return res.status(500).json({
      message: err.message,
      ok: false
    });
  }
};

// Enhanced Get All Users with Pagination
const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -__v -email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    return res.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        pages: Math.ceil(totalUsers / limit),
        limit
      }
    });
  } catch(err) {
    console.error("Get all users error:", err);
    return res.status(500).json({
      message: err.message,
      ok: false
    });
  }
};

// Enhanced Search User with Better Query Handling
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
        { fullName: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } }
      ]
    };

    const users = await User.find(searchQuery)
      .select("-password -__v -email -updatedAt")
      .limit(10)
      .lean();

    // Add follow status if authenticated
    if (req.user) {
      const currentUser = await User.findById(req.user.id).select('following');
      users.forEach(user => {
        user.isFollowing = currentUser.following.includes(user._id);
      });
    }

    res.json({
      success: true,
      count: users.length,
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
  getUserProfileById, 
  getMyProfile, 
  getAllUser, 
  searchUser 
};