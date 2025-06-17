import React from "react";
import profileImg from "../../assets/images/1.jpg";

const Sidebar = () => {
  const link = [
    { id: 0, name: "home", to: "/home" },
    { id: 1, name: "explore", to: "/explore" },
    { id: 2, name: "setting", to: "/setting" },
  ];
  return (
    <div className="w-90 h-[calc(100vh-80px)] py-10 bg-white border-gray-200 border-r-2">
      <div className="w-full h-auto flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="w-21 h-21">
            <img
              src={profileImg}
              alt="profile image"
              className="w-full h-full rounded-full z-10"
            />
          </div>
          <div className="text-center">
          <h3 className="text-lg font-medium text-grey">M Umar Baig</h3>
          <i className="text-midGray">@umarbaig123</i>
          </div>
        </div>
        <div className="flex items-center justify-center gap-10 mt-5 bg-lightGray px-4 py-4 rounded-xl">
          <div className="flex flex-col items-center">
            <h3>Posts</h3>
            <span className="">15</span>
          </div>
          <div className="flex flex-col items-center">
            <h3>following</h3>
            <span className="">11.1k</span>
          </div>
          <div className="flex flex-col items-center">
            <h3>follwers</h3>
            <span className="">132</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
