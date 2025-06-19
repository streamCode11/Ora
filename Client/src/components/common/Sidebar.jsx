import React from "react";
import { FiHome , FiCompass, FiSettings } from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";


const Sidebar = () => {
  const linkName = [
    { id: 0, name: "home", to: "/home"  , icon:<FiHome/>},
    { id: 1, name: "explore", to: "/explore" , icon:<FiCompass/>},
    { id: 2, name: "messages", to: "/message"  , icon:<RiMessengerLine/>},
    { id: 3, name: "setting", to: "/setting" , icon:<FiSettings/> },
  ];
  return (
    <div className="w-66 h-[calc(100vh-80px)] py-10 bg-white border-gray-200 border-r-2 px-5 flex flex-col gap-4 ">
     {linkName.map((link , index) => (
      <Link key={index} className="flex items-center justify-left px-4 py-3 gap-5 transition-all hover:bg-midGray rounded-lg ">
        <span className="text-2xl text-grey">{link.icon}</span>
        <span className="text-[16px]  text-grey capitalize">{link.name}</span>
      </Link>
     ))}
    </div>
  );
};

export default Sidebar;
