import React, { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import SearchList from "../ui/SearchList";

const Navbar = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [userData, setUserData] = useState({
    profileImg: "",
    username: "",
    firstName: "",
    token: "",
  });
  const navigate = useNavigate();
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
    setOpenNotification(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length > 0);
  };
  const handleUserSelect = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchTerm("");
    setShowResults(false);
  };
  return (
    <div className="fixed w-[calc(100vw-280px)] h-22 top-0 left-70 z-10 bg-white flex items-center justify-between ">
      <div className=" mx-auto px-4  w-full">
        <div className="flex justify-between h-19 items-center">
          <div className="flex items-center gap-2 min-w-[180px] max-w-auto">
            <div className="hidden h-15 md:flex items-center text-gray bg-body rounded-lg px-4  ml-2">
              <FiSearch className="h-5 w-5 text-gray" />
              <input
                onChange={handleSearch}
                onFocus={() => searchTerm && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                value={searchTerm}
                type="text"
                className="ml-2 bg-transparent border-none focus:outline-none placeholder-gray text-sm w-[370px]"
                placeholder="Search People"
              />
            </div>
            {showResults && (
              <SearchList
                searchTerm={searchTerm}
              />
            )}
          </div>

          <div className="flex items-center space-x-2 min-w-[180px] justify-end">
            <Link to="/chat">
              <button className="p-2 rounded-lg bg-gray text-mindaro relative">
                <RiMessengerLine size={26} />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-mindaro"></span>
              </button>
            </Link>

            <button
              className="p-2 rounded-lg bg-gray text-mindaro relative"
              onClick={handleOpenNotification}
            >
              <IoMdNotificationsOutline size={26} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-mindaro text-xs text-gray">
                3
              </span>
            </button>
            {openNotification ? (
              <NotificationList
                closeNotification={() => setOpenNotification(false)}
              />
            ) : null}

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
