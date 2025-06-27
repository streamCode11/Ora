import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    
    if (authData) {
      setUserData({
        ...authData.user,       
        token: authData.token,    
        refreshToken: authData.refreshToken  
      });
    }
  }, []);

  if (!userData) {
    return <div>No user data found in localStorage. Please login.</div>;
  }
  const {username , firstName , lastName , email , profileImg } = userData
  return (
    <div className="profile-container">
      <h2>User Profile (From LocalStorage)</h2>
      
      <div className="text-white">
      <img src={profileImg} alt="" />
        <p><strong>Name:</strong> {username || 'Not specified'}</p>
        <p><strong>Email:</strong> {email || 'Not specified'}</p>
        <p><strong>Username:</strong> {username || 'Not specified'}</p>
      </div>

      <div className="token-info">
        <h3>Session Information</h3>
        <p><strong>Token exists:</strong> {userData.token ? 'Yes' : 'No'}</p>
        <p><strong>Refresh Token exists:</strong> {userData.refreshToken ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;