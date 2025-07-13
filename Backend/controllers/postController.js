import cloudinary from "../config/cloudinaryMain.js";
import User from "../models/authSchema.js";
import Post from "../models/postSchema.js";


export const createPost = async (req, res) => {
  try {
    const { caption, settings, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const imageUploads = req.files.map((file) =>
      cloudinary.uploader.upload(file.path)
    );

    const uploadedImages = await Promise.all(imageUploads);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    const newPost = new Post({
      user: userId,
      caption,
      images: imageUrls,
      settings: settings || {
        hideLikeCount: false,
        disableComments: false,
      },
    });

    const savedPost = await newPost.save();

    await User.findByIdAndUpdate(userId, {
      $push: { posts: savedPost._id },
    });

    res.status(201).json(savedPost);
  } catch (err) {
    console.log("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("comments")
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
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Failed to toggle like" });
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
      .populate("user", "username profileImg");

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

// controllers/postController.js
