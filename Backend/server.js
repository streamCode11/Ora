import app from "./inc/app.js";
import {PORT , pre} from "./config/cloudinary.js";
import DatabaseConn from "./config/db.js";
import cors from "cors"
import authRouter from "./routes/authRoutes.js";
import commentRoutes from './routes/commentRoutes.js';
import PostRoutes from "./routes/postRoutes.js";


app.use(cors());
app.use('/api/comments', commentRoutes);
app.use(`${pre}/posts`, PostRoutes);
app.use(`${pre}/auth` , authRouter);
app.listen(PORT , (req , res) => {
     res.send("app is run on port " + PORT);
});