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

PostRoutes.get("/user/:userId", getAllPosts);
PostRoutes.get("/user/:id", getPostById);
PostRoutes.post("/user/", protect, createPost);
PostRoutes.put("/user/:id/like", protect, likePost);
PostRoutes.delete("/user/:id", protect, deletePost);
PostRoutes.get("/user/:userId", protect, admin, getPostsByUser);

export default PostRoutes;