import React, { useState, useRef, useCallback } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLink,
  FiImage,
  FiExternalLink,
} from "react-icons/fi";

const PostForm = ({ closePostForm }) => {
  // State for media files and carousel
  const [media, setMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  // State for links
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  // State for post text
  const [postText, setPostText] = useState("");
  
  // Refs
  const fileInputRef = useRef(null);

  // Handle adding media files
  const handleMediaUpload = (files) => {
    const newMedia = Array.from(files).map((file) => {
      const type = file.type.split("/")[0];
      return {
        file,
        url: URL.createObjectURL(file),
        type,
      };
    });

    setMedia((prev) => [...prev, ...newMedia]);
    if (media.length === 0) setCurrentMediaIndex(0);
  };

  const handleFileChange = (e) => {
    handleMediaUpload(e.target.files);
  };

  // Handle link submission
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!currentLink.trim()) return;

    try {
      const url = new URL(currentLink);
      setLinks(prev => [...prev, {
        url: currentLink,
        domain: url.hostname,
        name: url.hostname.replace('www.', '')
      }]);
      setCurrentLink("");
      setShowLinkInput(false);
    } catch (err) {
      console.log("Invalid URL:", err);
    }
  };

  // Remove link
  const removeLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  // Carousel navigation
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

  // Remove media item
  const removeMedia = useCallback((index) => {
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
  }, [currentMediaIndex]);

  return (
    <div className="fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-skin">Create Post</h2>
          <button
            type="button"
            onClick={closePostForm}
            className="text-skin hover:text-skin p-1 rounded-full hover:bg-midGray"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="text-center flex items-center">
          <h1 className="flex-1 py-3 font-medium text-white">Post</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-0 outline-0 resize-none text-white placeholder-white min-h-[100px] text-lg bg-transparent"
            rows="3"
          />

          {links.length > 0 && (
            <div className="mb-4">
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-midGray p-3 rounded-lg mb-2">
                  <div className="flex items-center">
                    <FiExternalLink className="text-skin mr-2" />
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-skin hover:underline"
                    >
                      {link.name}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-skin hover:text-red-400"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {media.length > 0 && (
            <div className="mb-4 relative">
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-midGray">
                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevMedia}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray text-skin bg-opacity-80 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMedia}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-skin bg-gray bg-opacity-80 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}

                {media[currentMediaIndex].type === "image" ? (
                  <img
                    src={media[currentMediaIndex].url}
                    alt={`Preview ${currentMediaIndex + 1}`}
                    className="w-full h-full object-contain"
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
                  className="absolute top-2 right-2 bg-gray bg-opacity-80 p-1 rounded-full shadow-md hover:bg-opacity-100"
                >
                  <FiX size={16} className="text-skin" />
                </button>
              </div>

              {media.length > 1 && (
                <div className="flex justify-center mt-2 space-x-2">
                  {media.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentMediaIndex ? "bg-skin" : "bg-midGray"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {showLinkInput && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                placeholder="Paste a link..."
                className="flex-1 p-2 rounded-lg text-skin bg-midGray placeholder-white outline-none border-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="bg-midGray text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="p-2 text-skin hover:text-skin hover:bg-midGray rounded-full"
                title="Add photos/videos"
              >
                <FiImage size={20} />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  multiple
                />
              </button>

              <button
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className={`p-2 rounded-full ${
                  showLinkInput
                    ? "text-skin bg-midGray"
                    : "text-skin hover:text-skin hover:bg-midGray"
                }`}
                title="Add link"
              >
                <FiLink size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;