import React, { useState, useRef } from "react";
import { FiX, FiImage } from "react-icons/fi";
import Apis from "../../config/apis";
import { useAuth } from "../../context/auth";
import axios from "axios";
const PostForm = ({ closePostForm, onPostCreated }) => {
  const [auth, setAuth] = useAuth();
  const [images, setImages] = useState([]);
  const [postText, setPostText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = (files) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const newImages = Array.from(files)
      .filter((file) => validTypes.includes(file.type))
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    if (newImages.length < files.length) {
      setError("Only JPG, PNG, and GIF images are allowed");
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (!postText.trim() && images.length === 0) {
      setError("Please add some content to your post");
      return;
    }

    if (!auth?.user?._id) {
      setError("User information is missing");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("userId", auth.user._id);
      formData.append("caption", postText.trim());

      images.forEach((item) => {
        formData.append("images", item.file);
      });

      formData.append("settings[hideLikeCount]", "false");
      formData.append("settings[disableComments]", "false");

      const response = await axios.post(
        "http://localhost:8100/api/v1/posts/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedAuth = {
        ...auth,
        user: {
          ...auth.user,
          posts: [...auth.user.posts, response.data._id],
        },
      };

      localStorage.setItem("auth", JSON.stringify(updatedAuth));
      setAuth(updatedAuth);

      images.forEach((item) => URL.revokeObjectURL(item.url));
      if (onPostCreated) onPostCreated(response.data);
      closePostForm();
    } catch (error) {
      console.error("Post creation error:", error);
      setError(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl text-mindaro font-semibold">Create Post</h2>
          <button
            type="button"
            onClick={closePostForm}
            className="text-gray bg-mindaro p-2 rounded-full"
            disabled={isLoading}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form
          className="flex-1 overflow-y-auto p-4"
          onSubmit={handleSubmitPost}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <textarea
            value={postText}
            onChange={(e) => {
              setPostText(e.target.value);
              setError("");
            }}
            placeholder="What's on your mind?"
            className="w-full border-0 text-white outline-0 resize-none placeholder-white min-h-[100px] text-lg"
            rows="3"
            disabled={isLoading}
          />

          {images.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full shadow hover:bg-opacity-100"
                    disabled={isLoading}
                  >
                    <FiX size={16} className="text-gray-800" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-mindaro text-gray rounded-lg font-medium  disabled:opacity-70 flex items-center"
              disabled={isLoading || (!postText.trim() && images.length === 0)}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-mindaro"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#dcf763"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="#dcf763"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 p-3 flex items-center bg-gray">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-2 text-gray  bg-mindaro rounded-full"
            title="Add photos"
            disabled={isLoading}
          >
            <FiImage size={20} />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif"
              multiple
              disabled={isLoading}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
