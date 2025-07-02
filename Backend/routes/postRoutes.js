import express from "express";
const PostRoutes = express.Router();
import * as post from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

PostRoutes
  .route("/")
  .post(protect, post.uploadPostMedia, post.uploadMedia)
  .get(post.getAllPosts);

PostRoutes
  .route("/user")
  .get(protect, post.getPostsByUserId); 

PostRoutes
  .route("/:id")
  .delete(protect, post.deletePost);

PostRoutes
  .post("/:id/like", protect, post.likePost);

export default PostRoutes;