import React, { useState } from "react";
import {
  FiSearch,
  FiHome,
  FiFlag,
  FiPlayCircle,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgMenuGridO } from "react-icons/cg";
import Logo from "../../assets/Ora bg.png";
import ProfileImg from "../../assets/images/1.jpeg";
import Dropdown from "./Dropdown";
import PostForm from "../posts/PostForm";

const Navbar = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="fixed w-[calc(100vw-280px)] top-0 left-70 z-50 bg-white  border-b border-gray-200">
      <div className=" mx-auto px-4">
        <div className="flex justify-between h-19 items-center">
          <div className="flex items-center space-x-2 min-w-[180px]">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-3 ml-2">
              <FiSearch className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                className="ml-2 bg-transparent border-none focus:outline-none placeholder-gray-500 text-sm w-[250px]"
                placeholder="Search People"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 min-w-[180px] justify-end">
            <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 relative">
              <RiMessengerLine size={20} />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </button>

            <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 relative">
              <IoMdNotificationsOutline size={22} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </button>

            <div className="relative ml-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex rounded-full focus:outline-none"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={ProfileImg}
                  alt="User profile"
                />
              </button>
              {isDropdownOpen && (
                <Dropdown closeDrop={() => setIsDropdownOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Form Modal */}
      {isPostFormOpen && (
        <PostForm closePostForm={() => setIsPostFormOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
