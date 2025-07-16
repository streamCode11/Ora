import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUserId,
  getPublicUserProfile,
  handleSavePost,
  addComment,
  getComments
} from "../controllers/postController.js";
import multer from "multer";
import { protect } from "../middleware/auth.js";

const postRouter = express.Router();
const upload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit per file
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

postRouter.post("/", upload.array('images'), createPost); 
postRouter.get("/", getPosts);
postRouter.get("/:id", getPost);
postRouter.put("/:id", updatePost);
postRouter.delete("/:id", deletePost);
postRouter.put("/:id/like", toggleLike);
postRouter.get("/users/:userId", getPostsByUserId);
postRouter.get('/public/:userId', getPublicUserProfile);
postRouter.put('/:userId/savedPosts', handleSavePost);
postRouter.post('/:postId/comments'  , addComment);
postRouter.get('/:postId/comments' , getComments);

export default postRouter;