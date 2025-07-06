import express from "express";
const messageRoutes = express.Router();
import { protect } from "../middleware/auth.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages
} from "../controllers/chat.controller.js";

messageRoutes
  .get("/users", protect, getUsersForSidebar)
  .get("/:id", protect, getMessages)
  .post("/send/:id" , protect , sendMessages)
export default messageRoutes;
