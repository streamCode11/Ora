import React, { useState, useRef, useCallback } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLink,
  FiImage,
  FiExternalLink,
} from "react-icons/fi";
import Apis from "../../config/apis";

const PostForm = ({ closePostForm, onPostCreated }) => {
  // State management
  const [media, setMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [postText, setPostText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Media handling
  const handleMediaUpload = (files) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
    const newMedia = Array.from(files)
      .filter(file => validTypes.includes(file.type))
      .map((file) => {
        const type = file.type.split("/")[0];
        return {
          file,
          url: URL.createObjectURL(file),
          type,
        };
      });

    if (newMedia.length < files.length) {
      setError("Only JPG, PNG, GIF images and MP4 videos are allowed");
    }

    setMedia((prev) => [...prev, ...newMedia]);
    if (media.length === 0 && newMedia.length > 0) {
      setCurrentMediaIndex(0);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleMediaUpload(e.target.files);
      e.target.value = ""; // Reset input to allow same file re-upload
    }
  };

  // Link handling
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!currentLink.trim()) return;

    try {
      const url = new URL(currentLink.startsWith("http") ? currentLink : `https://${currentLink}`);
      setLinks((prev) => [
        ...prev,
        {
          url: url.href,
          domain: url.hostname,
          name: url.hostname.replace("www.", ""),
        },
      ]);
      setCurrentLink("");
      setShowLinkInput(false);
    } catch (err) {
      setError("Please enter a valid URL (e.g., example.com or https://example.com)");
    }
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Media navigation
  const nextMedia = useCallback(() => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  }, [media.length]);

  const prevMedia = useCallback(() => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  }, [media.length]);

  const removeMedia = useCallback(
    (index) => {
      setMedia((prev) => {
        const newMedia = [...prev];
        URL.revokeObjectURL(newMedia[index].url);
        newMedia.splice(index, 1);

        if (currentMediaIndex >= newMedia.length && newMedia.length > 0) {
          setCurrentMediaIndex(newMedia.length - 1);
        } else if (newMedia.length === 0) {
          setCurrentMediaIndex(0);
        }

        return newMedia;
      });
    },
    [currentMediaIndex]
  );

  // Post submission
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!postText.trim() && media.length === 0 && links.length === 0) {
      setError("Please add some content to your post");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const authData = JSON.parse(localStorage.getItem("user"));
      if (!authData?.token) {
        throw new Error("Session expired. Please login again.");
      }

      const formData = new FormData();

      // Add post content
      formData.append("caption", postText.trim());
      
      // Add media files
      media.forEach((item) => {
        formData.append("media", item.file);
      });

      // Add links as JSON
      if (links.length > 0) {
        formData.append("links", JSON.stringify(links));
      }

      // Add post settings
      formData.append(
        "settings",
        JSON.stringify({
          hideLikeCount: false,
          disableComments: false,
        })
      );

      const response = await fetch(`${Apis.base}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create post. Please try again."
        );
      }

      // Clean up object URLs
      media.forEach((item) => URL.revokeObjectURL(item.url));

      // Notify parent component and close
      if (onPostCreated) onPostCreated(data);
      closePostForm();
    } catch (error) {
      console.error("Post creation error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-mindaro">Create Post</h2>
          <button
            type="button"
            onClick={closePostForm}
            className="text-gray bg-mindaro p-1 rounded-full hover:bg-opacity-80"
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
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Post Text */}
          <textarea
            value={postText}
            onChange={(e) => {
              setPostText(e.target.value);
              setError("");
            }}
            placeholder="What's on your mind?"
            className="w-full border-0 outline-0 resize-none text-white placeholder-gray-300 min-h-[100px] text-lg bg-transparent"
            rows="3"
            disabled={isLoading}
          />

          {/* Links Display */}
          {links.length > 0 && (
            <div className="mb-4">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg mb-2"
                >
                  <div className="flex items-center">
                    <FiExternalLink className="text-mindaro mr-2" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mindaro hover:underline truncate max-w-xs"
                    >
                      {link.name}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-gray-800 p-1 rounded-full bg-mindaro flex items-center justify-center hover:bg-opacity-80"
                    disabled={isLoading}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media Display */}
          {media.length > 0 && (
            <div className="mb-4 relative">
              <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevMedia}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-mindaro text-gray-800 bg-opacity-80 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMedia}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-800 bg-mindaro bg-opacity-80 p-2 rounded-full z-10 hover:bg-opacity-100 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}

                {media[currentMediaIndex].type === "image" ? (
                  <img
                    src={media[currentMediaIndex].url}
                    alt={`Preview ${currentMediaIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={media[currentMediaIndex].url}
                    controls
                    className="max-w-full max-h-full object-contain"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeMedia(currentMediaIndex)}
                  className="absolute top-2 right-2 bg-mindaro bg-opacity-80 p-1 rounded-full shadow-md hover:bg-opacity-100 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <FiX size={16} className="text-gray-800" />
                </button>
              </div>

              {media.length > 1 && (
                <div className="flex justify-center mt-2 space-x-2">
                  {media.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentMediaIndex
                          ? "bg-mindaro w-3"
                          : "bg-gray-500"
                      }`}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Link Input */}
          {showLinkInput && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                value={currentLink}
                onChange={(e) => {
                  setCurrentLink(e.target.value);
                  setError("");
                }}
                placeholder="Paste a link (e.g., example.com)"
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-300 outline-none border border-gray-600 focus:border-mindaro"
                autoFocus
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="bg-mindaro text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-80 disabled:opacity-50"
                disabled={isLoading}
              >
                Add
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-7 py-2 bg-mindaro text-gray-800 rounded-lg text-lg font-medium hover:bg-opacity-80 disabled:opacity-50 flex items-center"
              disabled={isLoading || (!postText.trim() && media.length === 0 && links.length === 0)}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t border-gray-600 p-4 flex items-center justify-between bg-gray">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray bg-mindaro rounded-full hover:bg-opacity-80 disabled:opacity-50"
              title="Add photos/videos"
              disabled={isLoading}
            >
              <FiImage size={20} />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
                multiple
                disabled={isLoading}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowLinkInput(!showLinkInput);
                setError("");
              }}
              className={`p-2 rounded-full ${
                showLinkInput
                  ? "text-gray-800 bg-mindaro"
                  : "text-gray-800 bg-mindaro hover:bg-opacity-80"
              } disabled:opacity-50`}
              title="Add link"
              disabled={isLoading}
            >
              <FiLink size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;