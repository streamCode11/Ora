import express from "express";
import {
    createComment,
    getCommentsByPost,
    deleteComment,
}

    from "../controllers/commentController.js";

// import { ProtectRoutes } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/" , createComment);

router.get("/:postId", getCommentsByPost);

router.delete("/:id", deleteComment);

export default router;
