import express from "express";
const PostRoutes = express.Router();
import * as post from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

// PostRoutes
//   .post("/", protect, post.uploadPostMedia, post.uploadMedia)
//   .get("/", post.getAllPosts)
//   .get("/user/:userId", post.getPostsByUserId)
//   .get("/:id", post.getPostById)
//   .delete("/:id", protect, post.deletePost)
//   .post("/:id/like", protect, post.likePost);

export default PostRoutes;