import Post from "../models/postSchema.js";

const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Post content is required" });
    }

    const post = await Post.create({
      user: userId,
      content,
      image,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate(
      "user",
      "username firstName lastName"
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

export { createPost, getAllPosts, getPostById, deletePost, likePost };
