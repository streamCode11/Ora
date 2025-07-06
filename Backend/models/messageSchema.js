import mogoose , {model , Schema} from "mongoose"

const messageSchema = new Schema({
     receiverId:{
          required:true,
          ref:"User",
          type:Schema.Types.ObjectId
     },
     SenderId:{
          required:true,
          ref:"User",
          type:Schema.Types.ObjectId
     },
     text:{
          type:String
     },
     image:{
          type:String
     }
},
{
     timestamps:true
}
);
const Message = model("message" , messageSchema);
export default Message