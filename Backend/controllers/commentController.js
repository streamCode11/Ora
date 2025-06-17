import Comment from "../models/commentSchema.js";

const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.create({
      postId,
      content,
      user: userId
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).populate('user', 'username');

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await comment.deleteOne();

    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { createComment, getCommentsByPost, deleteComment };
