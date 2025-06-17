import mongoose from "mongoose";
import { DBLink } from "./cloudinary.js";

const DatabaseConn = mongoose.connect(DBLink).then(() => {
     console.log("Connected to MongoDB");
}).catch(err => {
     console.log(err);
})

export default DatabaseConn;