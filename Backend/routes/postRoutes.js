import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost
} from "../controllers/postController.js";
import { protect, admin } from "../middleware/auth.js";

const PostRoutes = express.Router();

PostRoutes.get("/:id", getAllPosts);
PostRoutes.get("/:id", getPostById);
PostRoutes.post("/user/:id", protect, createPost);
PostRoutes.put("/:id/like", protect, likePost);
PostRoutes.delete("/:id", protect, deletePost);
// PostRoutes.get("/user/:id", protect, admin, getPostsByUser);

export default PostRoutes;