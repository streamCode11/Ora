import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String 
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
