import Post from "../models/postSchema.js";
import multer from "multer";
import path from 'path';
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads/post");
  },
  filename: (req, file, cb) => {
    const ext = file.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilterPath = (req, file, cd) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("images are accepted only"), false);
  }
};
const upload = multer({
  storage,
  fileFilterPath,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadPostMedia = upload.array("media", 10);

const uploadMedia = async (req, res) => {
  try {
    const { caption, settings } = req.body;
    const userId = req.user.id;

    if (!req.files || !req.files.length === "0") {
      return res.status(400).json({
        success: false,
        message: "At least one media file is required",
      });
    }
    const mediaFiles = req.files.map((file) => ({
      url: `/uploads/posts/${file.filename}`,
      type: "image",
    }));

    const post = await Post.create({
      user: userId,
      media: mediaFiles,
      caption,
      settings: settings
        ? JSON.parse(settings)
        : {
            hideLikeCount: false,
            disableComments: false,
          },
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username firstName lastName avatar"
    );

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .populate("user", "username firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  uploadMedia,
  uploadPostMedia,
  getAllPosts,
  getPostsByUserId,
  deletePost,
  likePost,
};
