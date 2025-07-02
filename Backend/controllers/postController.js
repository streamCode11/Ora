import fs from 'fs';
import Post from "../models/postSchema.js";
import multer from "multer";
import path from 'path';
import { v4 as uuidv4 } from "uuid";


const uploadDir = './uploads/posts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {  
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are accepted"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,  
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadPostMedia = upload.array("media", 10);

const uploadMedia = async (req, res) => {
  try {
    console.log('Uploading media...'); // Debug log
    console.log('Files:', req.files); // Debug log
    console.log('Body:', req.body); // Debug log

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const mediaFiles = req.files.map(file => ({
      url: `/uploads/posts/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' : 'video'
    }));

    const post = await Post.create({
      user: req.user.id,
      media: mediaFiles,
      caption: req.body.caption,
      settings: req.body.settings || {
        hideLikeCount: false,
        disableComments: false
      }
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ 
      message: 'Failed to create post',
      error: err.message 
    });
  }
};




const getAllPosts = async (req, res) => {
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
    const posts = await Post.find({ user: req.user.id }) 
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
