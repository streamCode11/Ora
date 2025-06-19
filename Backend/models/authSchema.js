import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type: String,
    // required: true,
    unique: true,
    minlength: 5  
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  profileImg: {
    type: String,
    default: 'default.jpg'  
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });  


const User = model('User', userSchema);
export default User;