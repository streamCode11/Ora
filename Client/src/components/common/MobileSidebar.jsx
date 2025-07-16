import React, { useState , useEffect } from "react";
import {
  FiHome,
  FiCompass,
  FiLogOut,
  FiPlus,
  FiBookmark,
  FiEdit,
  FiX,
} from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import webLogo from "../../assets/Ora bg.png";
import PostForm from "../posts/PostForm";
import { useAuth } from "../../context/auth";

const MobileSidebar = ({ isOpen, onClose }) => {
  const [openPostForm, setOpenPostForm] = useState(false);
  const [userData, setUserData] = useState({
      profileImg: "",
      username: "",
      token: "",
    });
  
    useEffect(() => {
      try {
        const authdata = JSON.parse(localStorage.getItem("auth"));
        if (authdata) {
          setUserData({
            ...authdata.user,
          });
        }
      } catch (error) {
        console.log("Error parsing auth data:", error);
      }
    }, []);

  const navLinks = [
    { id: 0, name: "Home", to: "/home", icon: <FiHome className="text-xl" /> },
    {
      id: 1,
      name: "Explore",
      to: "/explore",
      icon: <FiCompass className="text-xl" />,
    },
    {
      id: 2,
      name: "Messages",
      to: "/chat",
      icon: <RiMessengerLine className="text-xl" />,
    },
    {
      id: 3,
      name: "Saved",
      to: "/saved",
      icon: <FiBookmark className="text-xl" />,
    },
    {
      id: 4,
      name: "Edit Profile",
      to: "/edit-profile",
      icon: <FiEdit className="text-xl" />,
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="h-screen w-70 bg-white flex flex-col py-3 fixed left-0 top-0 z-40 shadow-lg"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Logo */}
            <div className="flex items-center justify-between px-5 mb-5">
              <div className="flex items-center px-4">
                <img
                  src={webLogo}
                  className="h-10 lg:h-19 w-auto"
                  alt="Website Logo"
                />
              </div>
              <div
                onClick={onClose}
                className="bg-gray text-mindaro text-2xl h-10 w-10 flex items-center justify-center rounded-sm "
              >
                <FiX />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col px-4 space-y-2 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.to}
                  className="flex items-center p-2 gap-2 lg:px-3 lg:py-3 lg:gap-3 rounded-lg border-2 border-transparent text-gray transition-all hover:border-mindaro"
                  onClick={onClose}
                >
                  <span className="text-[10px] lg:text-lg">{link.icon}</span>
                  <span className="text-[14px] lg:text-sm font-medium">
                    {link.name}
                  </span>
                </Link>
              ))}

              <button
                onClick={() => {
                  setOpenPostForm(true);
                  onClose();
                }}
                className="flex items-center px-3 py-3 gap-3 rounded-lg border-2 border-transparent text-gray hover:border-mindaro mt-2"
              >
                <FiPlus className="text-xl" />
                <span className="text-sm font-medium">Create Post</span>
              </button>
            </div>

            {/* User Section */}
            <div className="px-4 pb-4">
              <div className="pt-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 text-gray px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={onClose}
                >
                  <img
                    src={userData?.profileImg || "/default-profile.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">
                    {userData?.username || "User"}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    localStorage.removeItem("auth");
                    window.location.href = "/login";
                    onClose();
                  }}
                  className="flex items-center w-full px-3 py-2 gap-3 rounded-lg text-gray hover:bg-gray-100 mt-1"
                >
                  <FiLogOut className="text-xl" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Form Modal */}
      {openPostForm && (
        <PostForm closePostForm={() => setOpenPostForm(false)} />
      )}
    </>
  );
};

export default MobileSidebar;
