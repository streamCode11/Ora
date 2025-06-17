import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5  // Fixed spelling
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
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']  
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20,
    select: false,
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

userSchema.methods.comparePassword = async function(candidatePassword) {
     return await bcrypt.compare(candidatePassword, this.password);
};
const User = model('User', userSchema);
export default User;