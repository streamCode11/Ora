import mongoose , { Schema, model }  from "mongoose";

const postSchema = new Schema(
  {
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  media: [{
    url: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  settings: {
    hideLikeCount: { type: Boolean, default: false },
    disableComments: { type: Boolean, default: false }
  }},
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Post = model("Post", postSchema);
export default Post;
