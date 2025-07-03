import {v2 as cloudinary} from "cloudinary"
import { CLOUDINAR_API_KEY , CLOUDINAR_CLOUD_NAME , CLOUDINAR_SECRET_API_KEY } from "./cloudinary.js"
cloudinary.config({
     cloud_name:CLOUDINAR_CLOUD_NAME,
     api_key:CLOUDINAR_API_KEY,
     api_secret:CLOUDINAR_SECRET_API_KEY,
})
export default cloudinary