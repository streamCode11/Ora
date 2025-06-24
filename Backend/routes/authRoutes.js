import express from "express";
const authRouter = express.Router();
import * as auth from "../controllers/authController.js";

authRouter
  .post("/signup", auth.signup)
  .post("/login", auth.login)
  .post("/pre-signup", auth.preSignup);

export default authRouter;
