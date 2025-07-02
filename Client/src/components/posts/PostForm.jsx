import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import {
  FiShare,
  FiX,
  FiLink,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiVideo,
  FiFile,
  FiSmile,
} from "react-icons/fi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import EmojiPicker from "emoji-picker-react";
import Apis from "../../config/apis";

const PostForm = ({ closePostForm }) => {
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [media, setMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [postText, setPostText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setIsSubmitting] = useState(false);
  const [linkPreview, setLinkPreview] = useState(null);
  const [isFetchingLink, setIsFetchingLink] = useState(false);

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData && authData.user && authData.token) {
      setCurrentUser(authData.user);
    } else {
      console.log("No user or token found");
      closePostForm();
    }
  }, []);

  const fetchLinkPreview = async (url) => {
    try {
      setIsFetchingLink(true);
      const response = await axios.get(`https://api.linkpreview.net/?key=YOUR_API_KEY&q=${encodeURIComponent(url)}`);
      
      return {
        title: response.data.title || 'Link Preview',
        description: response.data.description || '',
        image: response.data.image || 'https://via.placeholder.com/300',
        domain: new URL(url).hostname
      };
    } catch (err) {
      console.log('Error fetching link preview:', err);
      return {
        title: 'Link Preview',
        description: '',
        image: 'https://via.placeholder.com/300',
        domain: new URL(url).hostname
      };
    } finally {
      setIsFetchingLink(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      console.log("You must be logged in to create a post");
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      media.forEach((mediaItem) => {
        formData.append('media', mediaItem.file);
        // Add mediaType based on file type
        const mediaType = mediaItem.file.type.startsWith('image/') ? 'image' : 
                         mediaItem.file.type.startsWith('video/') ? 'video' : 'file';
        formData.append('mediaType', mediaType);
      });
      
      formData.append('caption', postText);
      
      if (linkPreview) {
        formData.append('linkUrl', currentLink);
        formData.append('linkTitle', linkPreview.title);
        formData.append('linkDescription', linkPreview.description);
        formData.append('linkImage', linkPreview.image);
      }
      
      formData.append('settings', JSON.stringify({
        hideLikeCount: false,
        disableComments: false
      }));
      
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData.token;
      
      if (!token) {
        console.log("No authentication token found");
        return;
      }
      
      const response = await axios.post(
        `${Apis.base}/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        console.log('Post created successfully!');
        closePostForm();
        window.location.reload(); 
      }
    } catch (error) {
      console.log('Error creating post:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = (files) => {
    const newMedia = Array.from(files).map((file) => {
      const type = file.type.split("/")[0];
      return {
        file,
        url: URL.createObjectURL(file),
        type,
        crop: null,
        croppedUrl: null,
      };
    });

    setMedia((prev) => [...prev, ...newMedia]);
    if (media.length === 0) setCurrentMediaIndex(0);
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!currentLink.trim()) return;

    try {
      new URL(currentLink);
      
      const preview = await fetchLinkPreview(currentLink);
      setLinkPreview(preview);
      
      setShowLinkInput(false);
    } catch (err) {
      console.log('Invalid URL:', err);
    }
  };
  const handleFileChange = (e) => {
    handleMediaUpload(e.target.files);
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleMediaUpload(e.dataTransfer.files);
    }
  };

 

  const handleMediaClick = (index) => {
    if (media[index].type === "image") {
      setCurrentCropIndex(index);
      setCrop({ unit: "%", width: 100, height: 100 });
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <form 
        onSubmit={handleSubmit}
        className="bg-gray rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
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
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-0 outline-0 resize-none text-white placeholder-white min-h-[100px] text-lg"
            rows="3"
          />
  
          {/* Link Preview */}
          {linkPreview && (
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 bg-gray-100">
                  <img 
                    src={linkPreview.image} 
                    alt="Link preview" 
                    className="w-full h-40 sm:h-full object-cover"
                  />
                </div>
                <div className="sm:w-2/3 p-3">
                  <h4 className="font-bold text-sm sm:text-base mb-1 line-clamp-2">{linkPreview.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{linkPreview.description}</p>
                  <span className="text-gray-500 text-xs">{linkPreview.domain}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLinkPreview(null);
                  setCurrentLink("");
                }}
                className="w-full py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
              >
                Remove Link
              </button>
            </div>
          )}
  
          {/* Media Preview */}
          {media.length > 0 && (
            <div className="mb-4 relative">
              <div
                className={`relative w-full h-64 rounded-xl overflow-hidden ${
                  isDragging
                    ? "border-2 border-dashed border-blue-400 bg-blue-50"
                    : "bg-gray-50"
                }`}
                ref={dropAreaRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevMedia}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-midGray text-skin bg-opacity-80 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMedia}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-skin bg-midGray bg-opacity-80 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}
  
                <img
                  src={
                    media[currentMediaIndex]?.croppedUrl ||
                    media[currentMediaIndex]?.url
                  }
                  alt={`Preview ${currentMediaIndex + 1}`}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => handleMediaClick(currentMediaIndex)}
                />
              
                <button
                  type="button"
                  onClick={() => removeMedia(currentMediaIndex)}
                  className="absolute top-2 right-2 bg-midGray bg-opacity-80 p-1 rounded-full shadow-md hover:bg-opacity-100"
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
  
          {/* Link input */}
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
                disabled={isFetchingLink}
                className="bg-midGray text-white px-4 py-2 rounded-lg hover:bg-midGray disabled:opacity-50"
              >
                {isFetchingLink ? '...' : 'Preview'}
              </button>
            </div>
          )}
  
          {/* Crop modal */}
          {currentCropIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-gray rounded-xl p-4 max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="relative">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCrop(c)}
                    style={{ maxHeight: "70vh" }}
                    keepSelection={true}
                  >
                    <img
                      ref={imgRef}
                      src={media[currentCropIndex]?.url}
                      style={{ maxWidth: "100%" }}
                      onLoad={(e) => onImageLoad(e.currentTarget)}
                      alt="Crop preview"
                    />
                  </ReactCrop>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentCropIndex(null)}
                    className="bg-midGray text-skin px-4 py-2 rounded-lg hover:bg-gray"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    className="bg-midGray text-skin px-4 py-2 rounded-lg hover:bg-gray"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
  
          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-20 z-10">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>
  
        {/* Footer with action buttons */}
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
  
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-skin hover:text-skin hover:bg-midGray rounded-full"
                title="Add emoji"
              >
                <FiSmile size={20} />
              </button>
            </div>
  
            <button
              type="submit"
              disabled={(!postText && media.length === 0 && !linkPreview) || submitting}
              className={`px-6 py-2 rounded-lg font-medium ${
                (!postText && media.length === 0 && !linkPreview) || submitting
                  ? "text-skin hover:text-skin hover:bg-midGray cursor-not-allowed"
                  : "bg-midGray text-white hover:bg-midGray"
              }`}
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;