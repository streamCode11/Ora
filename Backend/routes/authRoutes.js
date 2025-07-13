import express from "express";
import multer from "multer"
const authRouter = express.Router();
import * as auth from "../controllers/authController.js";
import * as user from "../controllers/user.Controller.js";
import { protect } from "../middleware/auth.js";
import fs from "fs";


// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


authRouter
  .post("/signup", auth.signup)
  .post("/login", auth.login)
  .post("/pre-signup", auth.preSignup)
  .post("/logout", auth.Logout);

authRouter
  .put("/", protect, upload.single('profileImg') , user.UpdateUserProfile)
  .get("/me", protect, user.getMyProfile)
  .get("/search", user.searchUser) 
  .get("/:id", user.getUserProfile) 
  .get("/", user.getAllUser);

export default authRouter;