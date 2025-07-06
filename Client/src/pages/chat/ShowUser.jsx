import React from "react";
import image1 from "../../assets/images/1.jpeg";
import image2 from "../../assets/images/2.jpeg";
import image3 from "../../assets/images/3.jpeg";
import { FiEdit } from "react-icons/fi";

const defaultuser = [
  {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    profilePicture: image1,
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "janesmith",
    profilePicture: image2,
  },
  {
    id: 3,
    name: "Alice Johnson",
    username: "alicejohnson",
    profilePicture: image3,
  },
];

const ShowUser = () => {
  return (
    <div className="h-screen w-80 border-l-1 border-gray-100 bg-white py-5 px-2">
      <div className="flex items-center justify-between mb-7 px-5">
        <h1 className="text-2xl text-gray font-bold">Users</h1>
        <div className="flex items-center gap-2 bg-gray text-mindaro px-5 py-3 rounded-lg cursor-pointer">
          <h3 className=" capitalize">new chat</h3>
          <FiEdit className="text-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {defaultuser.map((user, index) => (
          <div
            key={index}
            className="flex items-center h-18 w-full gap-5 hover:bg-gray-100 px-3 rounded-xl cursor-pointer "
          >
            <div className="h-15 w-15 ">
              <img
                src={user.profilePicture}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col -gap-1">
              <h3 className="text-lg font-bold text-gray">{user.name}</h3>
              <span className="text-gray-500 text-sm italic">
                @{user.username}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowUser;
