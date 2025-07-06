import React, { useState , useEffect } from "react";
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
import Dropdown from "./Dropdown";
import PostForm from "../posts/PostForm";
import Apis from "../../config/apis";
import NotificationList from "../ui/NotificationList";

const Navbar = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openNotification , setOpenNotification] = useState(false);
  const [userData, setUserData] = useState({
    profileImg: "",
    username: "",
    firstName: "",
    token: ""
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

  const handleOpenNotification = () => {
      setOpenNotification(true)
  }
  return (
    <div className="fixed w-[calc(100vw-280px)] h-22 top-0 left-70 z-10 bg-white flex items-center justify-between ">
      <div className=" mx-auto px-4  w-full">
        <div className="flex justify-between h-19 items-center">
          <div className="flex items-center gap-2 min-w-[180px] max-w-auto">
            <div className="hidden h-15 md:flex items-center text-gray bg-body rounded-lg px-4  ml-2">
              <FiSearch className="h-5 w-5 text-gray" />
              <input
                type="text"
                className="ml-2 bg-transparent border-none focus:outline-none placeholder-gray text-sm w-[370px]"
                placeholder="Search People"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 min-w-[180px] justify-end">
            <button className="p-2 rounded-lg bg-gray text-mindaro relative" onClick={handleOpenNotification}>
              <RiMessengerLine size={26} />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </button>

            <button className="p-2 rounded-lg bg-gray text-mindaro relative"
            onClick={handleOpenNotification}>
              <IoMdNotificationsOutline size={26} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </button>
            {
              openNotification ? <NotificationList closeNotification={() => setOpenNotification(false)}/> : null
            }

            <div className="relative ml-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex rounded-full focus:outline-none"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={userData.profileImg}
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
