import app from "./inc/app.js";
import {PORT , pre} from "./config/cloudinary.js";
import DatabaseConn from "./config/db.js";
import cors from "cors"
import authRouter from "./routes/authRoutes.js";
import commentRoutes from './routes/commentRoutes.js';
// import postRoutes from './routes/postRoutes.js';


app.use(cors());
app.use('/api/comments', commentRoutes);
// app.use('/api/posts', postRoutes);
app.use(`${pre}/auth` , authRouter);
app.listen(PORT , () => {
     console.log("app is run on port " + PORT);
});