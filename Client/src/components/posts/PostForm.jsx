import React, { useState, useRef, useCallback } from "react";
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

const PostForm = ({ closePostForm }) => {
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [media, setMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [crop, setCrop] = useState({ unit: "%", width: 100, height: 100 });
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [postText, setPostText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const dropAreaRef = useRef(null);

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

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (currentLink.trim()) {
      setLinks((prev) => [...prev, currentLink]);
      setCurrentLink("");
      setShowLinkInput(false);
    }
  };

  const handleMediaClick = (index) => {
    if (media[index].type === "image") {
      setCurrentCropIndex(index);
      setCrop({ unit: "%", width: 100, height: 100 });
    }
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const applyCrop = () => {
    if (currentCropIndex === null || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const pixelCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedUrl = canvas.toDataURL("image/jpeg");

    setMedia((prev) => {
      const updated = [...prev];
      updated[currentCropIndex] = {
        ...updated[currentCropIndex],
        croppedUrl,
        crop: { ...crop },
      };
      return updated;
    });

    setCurrentCropIndex(null);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(media[index].url);
    if (media[index].croppedUrl) {
      URL.revokeObjectURL(media[index].croppedUrl);
    }

    setMedia((prev) => prev.filter((_, i) => i !== index));
    if (currentMediaIndex >= media.length - 1) {
      setCurrentMediaIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const onEmojiClick = (emojiData) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBefore = postText.substring(0, cursorPosition);
    const textAfter = postText.substring(cursorPosition);

    setPostText(`${textBefore}${emojiData.emoji}${textAfter}`);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart =
        cursorPosition + emojiData.emoji.length;
      textareaRef.current.selectionEnd =
        cursorPosition + emojiData.emoji.length;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      text: postText,
      media,
      links,
    });
    closePostForm();
  };

  return (
    <div className="fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-gray rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-skin">Create Post</h2>
          <button
            onClick={closePostForm}
            className="text-skin hover:text-skin p-1 rounded-full hover:bg-midGray"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className=" text-center flex items-center">
          <h1 className={`flex-1 py-3 font-medium   text-white`}>Post</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-0 outline-0 resize-none text-white placeholder-white min-h-[100px] text-lg"
            rows="3"
          />

          {links.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-skin mb-2">Links</h3>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-midGray p-3 rounded-lg"
                  >
                    <a
                      href={link.startsWith("http") ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-skin truncate text-sm"
                    >
                      {link}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-skin  ml-2"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          {showLinkInput ? (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                placeholder="Paste a link..."
                className="flex-1 p-2  rounded-lg text-skin bg-midGray placeholder-white  outline-none border-none "
                autoFocus
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="bg-midGray text-white px-4 py-2 rounded-lg hover:bg-midGray"
              >
                Add
              </button>
            </div>
          ) : null}

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
                  accept="image/*"
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
              onClick={handleSubmit}
              disabled={!postText && media.length === 0 && links.length === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                !postText && media.length === 0 && links.length === 0
                  ? "text-skin hover:text-skin hover:bg-midGray cursor-not-allowed"
                  : "bg-midGray text-white hover:bg-midGray"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
