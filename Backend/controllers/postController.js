import cloudinary from "../config/cloudinaryMain.js";
import User from "../models/authSchema.js";
import Post from "../models/postSchema.js";
import Comment from "../models/commentSchema.js";
import notificationModal from "../models/Notification.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { caption, settings, userId } = req.body;

    // Enhanced validation
    if (!userId || userId === "undefined") {
      return res.status(400).json({ 
        success: false,
        message: "Valid user ID is required" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "At least one image is required" 
      });
    }

    // Check if user exists
    const user = await User.findById(userId).select("username profileImg");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Upload images
    const uploadPromises = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI);
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(img => img.secure_url);

    // Create post
    const newPost = new Post({
      user: userId, // This should now be a valid ObjectId
      caption,
      images: imageUrls,
      settings: settings || {
        hideLikeCount: false,
        disableComments: false,
      },
    });

    const savedPost = await newPost.save();

    const responseData = {
      ...savedPost.toObject(),
      user: {
        _id: user._id,
        username: user.username,
        profileImg: user.profileImg
      }
    };

    res.status(201).json({
      success: true,
      post: responseData
    });

  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Internal server error" 
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImg")
      .populate("likes", "username email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profileImg",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { caption, settings } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own posts" });
    }

    post.caption = caption || post.caption;

    if (settings) {
      post.settings = {
        hideLikeCount:
          settings.hideLikeCount !== undefined
            ? settings.hideLikeCount
            : post.settings.hideLikeCount,
        disableComments:
          settings.disableComments !== undefined
            ? settings.disableComments
            : post.settings.disableComments,
      };
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    const deletePromises = post.images.map((imageUrl) => {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);

      // Create notification if not liking own post
      if (post.user._id.toString() !== userId) {
        await notificationModal.create({
          recipient: post.user._id,
          sender: userId,
          post: postId,
          type: "like",
        });
      }
    }

    const updatedPost = await post.save();

    // Populate the likes before sending response
    const populatedPost = await Post.findById(updatedPost._id).populate(
      "likes",
      "username profileImg"
    );

    res.status(200).json(populatedPost);
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Error toggling like" });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImg")
      .populate("likes", "username profileImg")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profileImg",
        },
      });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};

export const getPublicUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password -email -resetPasswordToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleSavePost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { postId, action } = req.body;

    if (!userId || !postId) {
      return res
        .status(400)
        .json({ message: "User ID and Post ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let update;
    if (action === "add") {
      if (!user.savedPosts.includes(postId)) {
        update = { $addToSet: { savedPosts: postId } };
      }
    } else if (action === "remove") {
      update = { $pull: { savedPosts: postId } };
    }

    if (update) {
      const updatedUser = await User.findByIdAndUpdate(userId, update, {
        new: true,
      });

      return res.status(200).json({ success: true, user: updatedUser });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Save post error:", err);
    res.status(500).json({ message: "Failed to save post" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content, userId } = req.body;  // Changed from 'text' to 'content'
    const { postId } = req.params;

    // Enhanced validation
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid user ID is required"
      });
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid comment content is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create and save comment
    const comment = new Comment({
      post: postId,  // Changed from postId to post for consistency
      user: userId,
      content: content.trim()
    });

    const savedComment = await comment.save();

    // Add comment to post
    post.comments.push(savedComment._id);
    await post.save();

    // Populate comment with user data before sending response
    const populatedComment = await Comment.populate(savedComment, {
      path: 'user',
      select: 'username profileImg'
    });

    // Create notification if not commenting on own post
    if (post.user.toString() !== userId) {
      await notificationModal.create({
        recipient: post.user,
        sender: userId,
        post: postId,
        type: "comment",
        content: content.substring(0, 30)  // Store first 30 chars as preview
      });
    }

    res.status(201).json({
      success: true,
      comment: populatedComment
    });

  } catch (err) {
    console.error("Error adding comment:", {
      message: err.message,
      stack: err.stack,
      body: req.body,
      params: req.params
    });

    res.status(500).json({
      success: false,
      message: "Internal server error while adding comment",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("user", "username profileImg")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};
