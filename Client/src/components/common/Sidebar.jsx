import React, { useState } from "react";
import {
  FiHome,
  FiCompass,
  FiSettings,
  FiLogOut,
  FiPlus,
} from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import webLogo from "../../assets/Ora bg.png";
import profileImg from "../../assets/images/1.jpeg";
import PostForm from "../posts/PostForm";

const Sidebar = () => {
  const [openPostForm, setOpenPostForm] = useState(false);

  const navLinks = [
    {
      id: 0,
      name: "Home",
      to: "/home",
      icon: <FiHome className="text-xl" />,
    },
    {
      id: 1,
      name: "Explore",
      to: "/explore",
      icon: <FiCompass className="text-xl" />,
    },
    {
      id: 2,
      name: "Messages",
      to: "/message",
      icon: <RiMessengerLine className="text-xl" />,
    },
    {
      id: 3,
      name: "Settings",
      to: "/setting",
      icon: <FiSettings className="text-xl" />,
    },
  ];

  return (
    <div className="  h-screen w-70  flex flex-col justify-between py-6 bg-white border-r border-gray-100 shadow-sm">
      <div className="flex flex-col px-4 space-y-1">
        <div className="h-17 w-auto">
          <img src={webLogo} className="h-full w-auto" alt="" />
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            className="flex items-center px-3 py-3 gap-3 rounded-lg
                      text-gray-700 hover:bg-gray-100 transition-colors
                      hover:text-blue-500"
          >
            <span className="text-gray-500 group-hover:text-blue-500">
              {link.icon}
            </span>
            <span className="text-sm font-medium">{link.name}</span>
          </Link>
        ))}

        <button
          onClick={() => setOpenPostForm(true)}
          className="flex items-center px-3 py-3 gap-3 rounded-lg
                    text-gray-700 hover:bg-gray-100 transition-colors
                    hover:text-blue-500 mt-2"
        >
          <FiPlus className="text-xl text-gray-500" />
          <span className="text-sm font-medium">Create Post</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="border-t border-gray-100 pt-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={profileImg}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              Alam Higgins
            </span>
          </Link>

          <Link
            to="/logout"
            className="flex items-center px-3 py-2 gap-3 rounded-lg
                      text-gray-700 hover:bg-gray-100 transition-colors mt-1"
          >
            <FiLogOut className="text-xl text-gray-500" />
            <span className="text-sm font-medium">Log Out</span>
          </Link>
        </div>
      </div>

      {/* Post Form Modal */}
      {openPostForm && (
        <PostForm closePostForm={() => setOpenPostForm(false)} />
      )}
    </div>
  );
};

export default Sidebar;
