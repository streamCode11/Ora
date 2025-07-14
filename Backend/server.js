import app from "./inc/app.js";
import express from "express";
import {PORT, pre} from "./config/cloudinary.js";
import DatabaseConn from "./config/db.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from "./routes/authRoutes.js";
import commentRoutes from './routes/commentRoutes.js';
import postRouter from "./routes/postRoutes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(`${pre}/comments`, commentRoutes);
app.use(`${pre}/posts`, postRouter);
app.use(`${pre}/auth`, authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});