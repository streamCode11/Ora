import mongoose, { model, Schema } from "mongoose";

const notification = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: { 
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User" 
},
  post: { 
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Post" 
},
  type: { type: String, enum: ["like", "comment"] },
  content: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const notificationModal = model("notification" , notification)
export default notificationModal