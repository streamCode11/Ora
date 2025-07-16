import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "email-validator";
import { JWT_SECRET } from "../config/cloudinary.js";
import pwd from "password-validator";
import User from "../models/authSchema.js";
import cloudinary from "../config/cloudinaryMain.js";

const pschema = new pwd();
pschema
  .is()
  .min(8)
  .is()
  .max(30)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

// Signup - Direct account creation
const signup = async (req, res) => {
  try {
    const { email, password, username, fullName, profileImg } = req.body;

    // Validation
    if (!email || !password || !username || !fullName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (username.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 5 characters",
      });
    }

    if (!pschema.validate(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-30 characters with uppercase, lowercase, digits and no spaces",
      });
    }

    if (!validator.validate(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check existing users
    const [emailExist, usernameExist] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
    ]);

    if (emailExist || usernameExist) {
      return res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image upload if exists
    let profileImgUrl = profileImg || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXIdvC1Q4WL7_zA6cJm3yileyBT2OsWhBb9Q&s";

    if (profileImg && profileImg.startsWith('data:')) {
      const uploadResponse = await cloudinary.uploader.upload(profileImg, {
        folder: "user_profiles",
      });
      profileImgUrl = uploadResponse.secure_url;
    }

    // Create new user with default values
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      fullName,
      profileImg: profileImgUrl,
      bio: "Hey there! I am using Ora",
      role: "user",
      posts: [],
      followers: [],
      following: [],
      savedPosts: [],
      isVerified: true,
    });

    // Generate auth token
    const authToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: authToken,
      user: {
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        profileImg: newUser.profileImg,
        bio: newUser.bio,
        posts:newUser.posts,
        savedPosts:newUser.savedPosts,
        followers: newUser.followers,
        following: newUser.following,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate auth token
    const authToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImg: user.profileImg,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        savedPosts: user.savedPosts,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful. Please remove the token from client storage.",
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { signup, login, logout };