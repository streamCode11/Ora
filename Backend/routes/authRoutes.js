import express from "express";
const authRouter = express.Router();
import * as auth from "../controllers/authController.js";
import * as user from "../controllers/user.Controller.js";
import { protect } from "../middleware/auth.js";

authRouter
  .post("/signup", auth.signup)
  .post("/login", auth.login)
  .post("/pre-signup", auth.preSignup)
  .post("/logout", auth.Logout);

authRouter
  .put("/update-profile", protect, user.UpdateUserProfile)
  .get("/me", protect, user.getMyProfile)
  .get("/search", user.searchUser) 
  .get("/:id", user.getUserProfile) 
  .get("/", user.getAllUser);

export default authRouter;