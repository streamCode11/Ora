import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiCompass,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiBookmark,
  FiEdit,
} from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import webLogo from "../../assets/Ora bg.png";
import Apis from "../../config/apis";
import axios from "axios";
import PostForm from "../posts/PostForm";

const Logout = async () => {
  try {
    const response = await axios.post(
      `${Apis.auth}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      }
    );
    if (response.data.ok) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    } else {
      console.error(response.data.error);
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const Sidebar = () => {
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
      console.error("Error parsing auth data:", error);
    }
  }, []);

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
      to: "/chat",
      icon: <RiMessengerLine className="text-xl" />,
    },
    {
      id: 3,
      name: "saved",
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
    <div className="h-screen w-70 flex flex-col justify-between py-3 bg-white ">
      <div className="flex flex-col px-4 space-y-1">
        <div className="ml-5 mb-10 h-19 w-auto">
          <img src={webLogo} className="h-full w-auto" alt="Website Logo" />
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            className="flex items-center px-3 py-3 gap-3 rounded-lg border-2 border-transparent
                      text-gray transition-all  hover:border-mindaro"
          >
            <span>{link.icon}</span>
            <span className="text-sm font-medium">{link.name}</span>
          </Link>
        ))}

        <button
          onClick={() => setOpenPostForm(true)}
          className="flex items-center px-3 py-3 gap-3 rounded-lg border-2 border-transparent
                    text-gray  hover:border-mindaro mt-2"
        >
          <FiPlus className="text-xl" />
          <span className="text-sm font-medium">Create Post</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="pt-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 text-gray px-3 py-2  "
          >
            <img
              src={userData.profileImg || "/default-profile.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium ">
              {userData.username || "User"}
            </span>
          </Link>

          <button
            onClick={Logout}
            className="flex items-center w-full px-3 py-2 gap-3 rounded-lg
                      text-gray transition-colors mt-1"
          >
            <FiLogOut className="text-xl" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {openPostForm && (
        <PostForm closePostForm={() => setOpenPostForm(false)} />
      )}
    </div>
  );
};

export default Sidebar;
