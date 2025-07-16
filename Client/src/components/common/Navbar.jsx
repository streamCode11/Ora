import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import smLogo from "../../assets/Ora favicon.png";
import PostForm from "../posts/PostForm";
import NotificationList from "../ui/NotificationList";
import { Link, useNavigate } from "react-router-dom";
import SearchList from "../ui/SearchList";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      console.log("Error parsing auth data:", error);
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

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setSearchTerm("");
      setShowResults(false);
    }
  };
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="fixed  w-screen lg:w-[calc(100vw-280px)]  lg:left-68 lg:h-22 h-17 top-0 left-0 z-10 bg-white flex items-center justify-between shadow-sm">
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-white z-50 flex items-center px-4 h-16"
          >
            <div className="flex items-center w-full gap-3">
              <button onClick={toggleMobileSearch}>
                <FiX className="text-xl text-gray-600" />
              </button>
              <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-transparent border-none outline-none"
                  placeholder="Search..."
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto px-4 w-full">
        <div className="flex justify-between h-19 items-center">
          <div className="flex items-center gap-2 min-w-[180px] max-w-auto">
          <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={` p-2 lg:hidden flex  rounded-sm bg-gray text-mindaro transition-all }`}
            >
              <FiMenu />
            </button>
            <div className="md:hidden flex items-center justify-center">
              <img src={smLogo} alt="Ora webs" className="w-10 h-10" />
            </div>

            <div className="hidden md:flex h-15 items-center text-gray bg-body rounded-lg px-4 ml-2">
              <FiSearch className="h-5 w-5 text-gray" />
              <input
                onChange={handleSearch}
                onFocus={() => searchTerm && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                value={searchTerm}
                type="text"
                className="ml-2 bg-transparent border-none focus:outline-none placeholder-gray text-sm w-full md:w-[370px]"
                placeholder="Search People"
              />
            </div>

            {showResults ?( <SearchList searchTerm={searchTerm} />) :null}
          </div>

          <div className="flex items-center space-x-2 min-w-[180px] justify-end">
            <div className="md:hidden" onClick={toggleMobileSearch}>
              <button className="p-2 rounded-sm md:rounded-lg bg-gray text-mindaro">
                <FiSearch className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>


  
            <div className="relative ml-2">
              <Link to="/profile">
                <button className="flex rounded-full focus:outline-none">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={userData.profileImg}
                    alt="User profile"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isPostFormOpen && (
        <PostForm closePostForm={() => setIsPostFormOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
