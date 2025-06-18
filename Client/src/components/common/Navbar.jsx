import React from "react";
import Logo from "../../assets/Ora bg.png";
import { FiSearch, FiBell, FiPlus } from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import ProfileImg from '../../assets/images/1.jpeg'

const Navbar = () => {
  return (
    <div className="bg-lightGray h-20 w-full flex items-center justify-between px-10 ">
      <div className="flex items-center justify-center gap-10">
        <div className="h-17 w-auto">
          <img src={Logo} alt="Logo" className="w-auto h-full" />
        </div>
        <div className="flex items-center gap-5 bg-white px-5 h-14 w-100 rounded-lg">
          <FiSearch className="w-5  h-5 text-grey" />
          <input
            type="text"
            placeholder="serach here"
            className="outline-0 border-0"
          />
        </div>
      </div>
      <div className="flex items-center gap-20">
        <div className="flex items-center gap-8 justify-center">
          <div className="flex items-center justify-center cursor-pointer relative">
            <FiBell className="text-2xl text-grey" />
            <span className="absolute -top-3 left-3 bg-red text-white flex items-center justify-center px-1 py-0.5 rounded-full text-sm">
              01
            </span>
          </div>
          <div className="flex items-center justify-center cursor-pointer relative after:absolute after:bottom-4 after:left-4 after:bg-red after:h-2.5 after:w-2.5 after:rounded-full">
            <RiMessengerLine className="text-2xl text-grey" />
          </div>
          <button className="flex items-center justify-between gap-1 rounded-4xl cursor-pointer px-5 py-2 bg-gradient-to-tr from-pink  to-purple text-white">
            <FiPlus className="flex items-center justify-center text-2xl" />
            <span className="text-lg capitalize ">create</span>
          </button>
        </div>
        <div className="flex items-center justify-center h-17 w-17 ">
          <img src={ProfileImg} alt="" className="w-ful h-full rounded-full "/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
