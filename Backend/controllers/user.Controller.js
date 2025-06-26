import User from "../models/authSchema.js";
import responseTokenAndUser from "../helpers/sendUserandTokenResponse.js";

const UpdateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({
        message: "User not found",
        ok: false,
      });
    }
    if (user) {
      const { username, firstName, lastName, bio, profileImg } = req.body;
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.bio = bio || user.bio;
      user.profileImg = profileImg || user.profileImg;
      const updateUser = await user.save();

      return res.json({
        message: "User updated successfully",
        ok: true,
        user: {
          username: updateUser.username,
          firstName: updateUser.firstName,
          lastName: updateUser.lastName,
          bio: updateUser.bio,
          profileImg: updateUser.profileImg,
        },
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUserProfile = async (req , res) => {
    try{
        const user = req.body;
        if(!user){
          return res.json({
            error:"user not found with this given id",
            ok:false,
          })
        }
        if(user){
          return  res.json({
            user, 
            ok:true
          })
        }
    }catch(err){
      return res.json({
        error:err.message,
        ok:false
      })
    }
}

export { UpdateUserProfile , getUserProfile};