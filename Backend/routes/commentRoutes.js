import express from "express";
import {
    createComment,
    getCommentsByPost,
    deleteComment,
}

    from "../controllers/commentController.js";

import { protect } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/", protect, createComment);

router.get("/:postId", getCommentsByPost);

router.delete("/:id", protect, deleteComment);

export default router;
