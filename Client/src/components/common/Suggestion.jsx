import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../../assets/images/1.jpeg";
import image2 from "../../assets/images/2.jpeg";
import image3 from "../../assets/images/3.jpeg";
import image4 from "../../assets/images/4.jpeg";
import image5 from "../../assets/images/5.jpeg";
import Button from "../ui/Button";

const Suggestion = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8100/api/v1/auth");
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to default users if API fails
        setUsers([
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
        ]);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="hidden lg:block mt-4 mb-6 w-85 min-h-30 max-h-auto bg-white rounded-lg py-4 px-3">
      <h2 className="text-skin text-xl capitalize">suggestion for you</h2>
      <ul className="mt-4 flex flex-col space-y-4">
        {users.map((user) => (
          <div
            className="flex items-center justify-between h-15"
            key={user._id || user.id}
          >
            <li 
              className="flex items-center justify-center cursor-pointer"
              onClick={() => handleUserClick(user.username)}
            >
              <img
                src={user.profileImg || user.profilePicture || image4} // fallback to default image
                alt={user.fullName || user.name}
                className="w-12 h-12 rounded-full mr-3 object-cover"
                onError={(e) => {
                  e.target.src = image5; // fallback image if profile image fails to load
                }}
              />
              <div>
                <h3 className="text-[16px] font-normal text-gray">
                  {user.fullName || user.name}
                </h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
            </li>
            <Button name="Follow" />
          </div>
        ))}
      </ul>
      <div className="w-full mt-4 text-center text-skin capitalize">
        <Link to="*" className="">
          view more
        </Link>
      </div>
    </div>
  );
};

export default Suggestion;