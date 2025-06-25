import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost
} from "../controllers/postController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

 router.post("/", protect, createPost);

router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.delete("/:id", protect, deletePost);

router.put("/:id/like", protect, likePost);

export default router;
