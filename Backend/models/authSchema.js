import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5  
  },
  firstName: {
    type: String,
    // required: true
  },
  lastName: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: "Hey there! I am using Ora"
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  profileImg: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });  


const User = model('User', userSchema);
export default User;