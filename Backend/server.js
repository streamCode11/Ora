import app from "./inc/app.js";
import express from "express";
import {PORT, pre} from "./config/cloudinary.js";
import DatabaseConn from "./config/db.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import bodyParser from "body-parser"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(`${pre}/posts`, postRouter);
app.use(`${pre}/auth`, authRouter);
app.use(`${pre}/notifications`, notificationRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});