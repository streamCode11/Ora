import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    // Reference to the post being liked
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;