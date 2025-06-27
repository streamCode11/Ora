import express from "express";
import * as post from "../controllers/postController.js";
import { protect, admin } from "../middleware/auth.js";

const PostRoutes = express.Router();
outer
  .route("/")
  .post(protect, post.uploadPostMedia, post.uploadMedia)
  .get(getAllPosts);

PostRoutes.route("/user/:userId").get(post.getPostsByUserId);

PostRoutes.route("/:id").get(post.getPostById).delete(protect, post.deletePost);

PostRoutes.route("/:id/like").post(protect, post.likePost);

export default PostRoutes;
