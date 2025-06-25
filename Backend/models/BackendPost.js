import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image"], required: true },
        width: Number,
        height: Number,
      },
    ],
    caption: {
      type: String,
      maxlength: 2200,
      default: "",
    },
    location: {
      placeId: String,
      name: String,
      coordinates: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
    },
    settings: {
      hideLikeCount: { type: Boolean, default: false },
      disableComments: { type: Boolean, default: false },
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    shares: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Post = model("Post", postSchema);
export default Post;
