import User from "../models/authSchema.js";
import { JWT_EXPIRES, JWT_SECRET } from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "email-validator";
import pwd from "password-validator";

const PwdSchema = new pwd();

PwdSchema.is()
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

const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    if (!email || !password || !firstName || !lastName || !username) {
      return res.status(400).json({
        message: "Please fill all the fields",
        ok: false,
      });
    }

    if (!PwdSchema.validate(password)) {
      return res.status(400).json({
        message: "Invalid password format",
        ok: false,
      });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        ok: false,
      });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
        ok: false,
      });
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(400).json({
        message: "Username already exists",
        ok: false,
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);
    
    const user = await new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPass,
    }).save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const userData = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: userData,
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred during signup",
      error: err.message,
      ok: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
        ok: false,
      });
    }

    const isEmail = validator.validate(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials - user not found",
        ok: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials - wrong password",
        ok: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const userData = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred during login",
      error: err.message,
      ok: false,
    });
  }
};

export { signup, login };