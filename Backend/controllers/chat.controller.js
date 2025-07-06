import cloudinary from "../config/cloudinaryMain.js";
import User from "../models/authSchema.js";
import Message from "../models/messageSchema.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const getCurrentLoggedIn = req.user._id;
    const filterUser = await User.find({
      _id: { $ne: getCurrentLoggedIn },
    }).select("-password");
    res.json(filterUser);
  } catch (error) {
     return res.json({
          error:error.message
     })
  }
};
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
  } catch (error) {
     return res.json({
          error:error.message
     })
  }
};
const sendMessages = async (req , res ) => {
     try {
          const {text , image} = req.body;
          const {id:receiverId} = req.params;
          const SenderId = req.user._id;
          let imageUrl;
          if(imageUrl){
               const uploadResponse = await cloudinary.uploader.upload(image);
               imageUrl = uploadResponse.secure_url;
          }
          const newMessage = new Message({
               receiverId,
               SenderId,
               text,
               image:imageUrl
          });
          await newMessage.save();
          res.json(newMessage);
     } catch (error) {
          return res.json({
               error:error.message
          })
     }
}
export { getUsersForSidebar, getMessages , sendMessages };
