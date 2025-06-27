import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));

    if (authData) {
      setUserData({
        ...authData.user,
        token: authData.token,
        refreshToken: authData.refreshToken,
      });
    }
  }, []);

  if (!userData) {
    return <div>No user data found in localStorage. Please login.</div>;
  }
  const { username, firstName, lastName, email, profileImg } = userData;
  return (
    <div className="flex min-h-100 max-h-auto mx-30 mt-0 pt-10">
      <div className="flex gap-20 ">
        <div className="h-50 w-50 ">
          <img
            src={profileImg}
            className="w-full h-full object-cover rounded-full "
          />
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-5 ">
            <p className="text-white text-xl">{username || "Not specified"}</p>
            <Link to="/edit-profile">
              <button className="text-gray bg-skin rounded-lg cursor-pointer px-3 py-2 ">Edit Profile</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
