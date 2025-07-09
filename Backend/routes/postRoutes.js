import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUserId,
  getPublicUserProfile
} from "../controllers/postController.js";
import multer from "multer";

const postRouter = express.Router();
const upload = multer({ dest: 'uploads/' }); 

postRouter.post("/upload", upload.array('images', 10), createPost); 
postRouter.get("/", getPosts);
postRouter.get("/:id", getPost);
postRouter.put("/:id", updatePost);
postRouter.delete("/:id", deletePost);
postRouter.post("/:id/like", toggleLike);
postRouter.get("/users/:userId", getPostsByUserId);
postRouter.get('/public/:userId', getPublicUserProfile);


export default postRouter;