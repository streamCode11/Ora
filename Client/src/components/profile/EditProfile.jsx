import React, { useState } from "react";
import DefaultImg from "../../assets/images/defaultImage.png";
import { FiCamera } from "react-icons/fi";
const EditProfile = () => {
  const [previewImg, setPreviewImg] = useState(null);
  const defaultImage = DefaultImg;
  const handleImgChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <form className="mt-10 w-full">
      <div className="space-x-5">
        <div className="w-50 h-50 rounded-full relative">
          <img
            src={previewImg || defaultImage}
            alt=""
            className="rounded-full w-50 h-50 object-cover "
          />
          <label htmlFor="uploadImg" className="absolute bottom-2 right-1 ">
            <div className="bg-gray text-mindaro p-2 text-3xl rounded-full">
              <FiCamera />
            </div>
          </label>
          <input
            type="file"
            id="uploadImg"
            accept="image/*"
            hidden
            onChange={handleImgChange}
          />
        </div>
        <div className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xl text-gray capitalize">username</span>
            <input
              type="text"
              placeholder="Username"
              className="w-100 p-2 rounded-md outline-none border-2 border-gray placeholder:text-gray"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl text-gray capitalize">FullName</span>
            <input
              type="text"
              placeholder="fullName"
              className="w-100 p-2 rounded-md outline-none border-2 border-gray placeholder:text-gray"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl text-gray capitalize">Bio</span>
            <textarea
              type="text"
              placeholder="Bio"
              className="w-100 p-2 rounded-md outline-none border-2 border-gray placeholder:text-gray resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="bg-gray text-mindaro w-45 h-15 mt-10 text-lg rounded-lg cursor-pointer capitalize"
      >
        save changes
      </button>
    </form>
  );
};

export default EditProfile;
