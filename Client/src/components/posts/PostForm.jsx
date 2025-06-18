import React, { useState, useRef, useCallback } from "react";
import {
  FiShare,
  FiX,
  FiLink,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const PostForm = ({ closePostForm }) => {
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState({ unit: "%", width: 100, height: 100 });
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle multiple image selection
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        crop: null,
        croppedUrl: null,
      }));
      setImages((prev) => [...prev, ...newImages]);
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

  const handleImageClick = (index) => {
    setCurrentCropIndex(index);
    // Reset crop when opening
    setCrop({ unit: "%", width: 100, height: 100 });
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  // Implement actual cropping function
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

    // Update the image with cropped version
    setImages((prev) => {
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

  const triggerFileInput = () => {
    fileInputRef.current.value = ""; // Reset input to allow selecting same files again
    fileInputRef.current.click();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const removeImage = (index) => {
    // Revoke object URLs to prevent memory leaks
    URL.revokeObjectURL(images[index].url);
    if (images[index].croppedUrl) {
      URL.revokeObjectURL(images[index].croppedUrl);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-white-200 backdrop-blur-[3px] flex items-center justify-center z-50">
      <div className="bg-white min-h-200 max-h-auto w-260 relative rounded-lg overflow-y-auto max-h-[90vh]">
        <div
          className="absolute top-5 right-5 bg-sky p-2 cursor-pointer text-2xl text-white rounded-full"
          onClick={closePostForm}
        >
          <FiX />
        </div>

        <div className="flex items-center justify-center mt-7">
          <h1 className="text-xl text-grey font-bold capitalize tracking-wider">
            create Post
          </h1>
        </div>

        <form className="w-full h-full px-7 mt-7 ">
          {links.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md text-gray-600 mb-2">Added Links:</h3>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-lightestSky p-3 rounded"
                  >
                    <a
                      href={link.startsWith("http") ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky truncate"
                    >
                      {link}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 ml-2"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showLinkInput ? (
            <div className="mb-6 flex items-center gap-2">
              <input
                type="text"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                placeholder="Paste your link here"
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="bg-sky text-white p-2 rounded"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLinkInput(true)}
              className="mb-6 flex items-center gap-2 text-sky"
            >
              <FiLink /> Add Link
            </button>
          )}

          {images.length > 0 && (
            <div className="mb-6 relative">
              <div className="relative w-full h-70 py-5 bg-gray-100 rounded-xl overflow-hidden">
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow z-10"
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow z-10"
                    >
                      <FiChevronRight />
                    </button>
                  </>
                )}
                <img
                  src={
                    images[currentImageIndex]?.croppedUrl ||
                    images[currentImageIndex]?.url
                  }
                  alt={`Preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => handleImageClick(currentImageIndex)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(currentImageIndex)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <FiX size={16} />
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex justify-center mt-2 space-x-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-sky" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="Postfile" className="cursor-pointer">
              <div
                className="h-10 w-50 gap-5 bg-lightestSky rounded-xl flex items-center justify-center  "
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    triggerFileInput();
                  }
                }}
              >
                <FiShare className="text-sky text-2xl flex items-center justify-center" />
                <h1 className="text-sm text-sky capitalize">
                  {images.length > 0 ? "Add more" : "Upload files"}
                </h1>
              </div>
            </label>
            <input
              type="file"
              id="Postfile"
              name="Postfile"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
            />
          </div>

          {currentCropIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg max-w-4xl">
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
                      src={images[currentCropIndex]?.url}
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
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    className="bg-sky text-white px-4 py-2 rounded"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <textarea
              name="description"
              id="description"
              cols="57"
              rows="5"
              placeholder="Enter your description"
              className="placeholder:text-midGray outline-0 w-full border border-gray-300 rounded p-2"
            ></textarea>
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="submit"
              className="bg-sky text-white px-6 py-2 rounded"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
