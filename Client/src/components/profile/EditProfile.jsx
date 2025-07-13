// EditProfile.js
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import DefaultImg from "../../assets/images/defaultImage.png";
import { FiCamera } from "react-icons/fi";
import Apis from "../../config/apis";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [previewImg, setPreviewImg] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    profileImg: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultImage = user?.profileImg || DefaultImg;

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImg(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImg: file
        }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('bio', formData.bio);
      
      if (formData.profileImg) {
        formDataToSend.append('profileImg', formData.profileImg);
      }

      const response = await axios.put(
        `${Apis.base}/auth`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.ok) {
        setUser(response.data.user);
        setError(null);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to update profile";
      setError(errorMessage);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-10 w-full" onSubmit={handleSubmit}>
      <div className="space-x-5">
        <div className="w-50 h-50 rounded-full relative">
          <img
            src={previewImg || defaultImage}
            alt="Profile"
            className="rounded-full w-50 h-50 object-cover"
          />
          <label htmlFor="uploadImg" className="absolute bottom-2 right-1 cursor-pointer">
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
            <label className="text-xl text-gray capitalize">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              minLength={3}
              className="w-100 p-2 rounded-md outline-none border-2 border-gray placeholder:text-gray"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl text-gray capitalize">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-100 p-2 rounded-md outline-none border-2 border-gray placeholder:text-gray"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl text-gray capitalize">Bio</label>
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={150}
              className="w-100 p-2 rounded-md outline-none border-2 border-gray placeholder:text-gray resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 mt-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`bg-gray text-mindaro w-45 h-15 mt-10 text-lg rounded-lg cursor-pointer capitalize ${
          loading ? 'opacity-50' : 'hover:bg-gray-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Saving...
          </span>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
};

export default EditProfile;