import React, { useState, useRef } from "react";
import { FiSend, FiImage, FiX } from "react-icons/fi";

const ShowChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const messages = [
    {
      _id: 1,
      SenderId: "other",
      text: "Hey there! How are you doing?",
      createdAt: new Date(),
    },
    {
      _id: 2,
      SenderId: "current",
      text: "I'm good, thanks! Check out this image:",
      image: "https://via.placeholder.com/300",
      createdAt: new Date(),
    },
  ];

  const currentUser = { _id: "current" };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className=" flex flex-col bg-gray-50 w-[calc(100vw-600px)] ">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.SenderId === currentUser._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="max-w-xs lg:max-w-md rounded-lg p-3 bg-gray text-white">
              {message.image && (
                <img
                  src={message.image}
                  alt="Message content"
                  className="mb-2 rounded-lg w-full object-cover"
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        {previewImage && (
          <div className="mb-3 relative">
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-contain "
            />
            <button
              onClick={removePreview}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700"
              aria-label="Remove image"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
        <form className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full outline-0 border-0 rounded-full py-2 px-4 pr-10 "
            />
            <label className="absolute right-3 top-2.5 cursor-pointer text-gray">
              <FiImage size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
          </div>
          <button
            type="button"
            className="bg-gray text-mindaro p-2 rounded-full    disabled:opacity-70"
            disabled={!newMessage.trim() && !previewImage}
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShowChat;
