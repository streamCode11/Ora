import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiUserPlus, FiMessageSquare } from 'react-icons/fi';
import PostGrid from '../../components/common/PostGrid';
const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/${id}`);
        setUser(response.data.user);
        
        // Check if current user is following this profile
        const authData = JSON.parse(localStorage.getItem('auth'));
        setIsFollowing(authData?.user?.following?.includes(id));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      await axios.patch(`/api/v1/auth/${id}/${endpoint}`, null, {
        headers: {
          'x-auth-token': authData.token
        }
      });

      setIsFollowing(!isFollowing);
      // Update followers count optimistically
      setUser(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(followerId => followerId !== authData.user._id)
          : [...prev.followers, authData.user._id]
      }));
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200">
          <img 
            src={user.profileImg || "/default-profile.png"} 
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">@{user.username}</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleFollow}
                className={`px-4 py-1 rounded flex items-center gap-1 ${
                  isFollowing ? 'bg-gray-200' : 'bg-blue-500 text-white'
                }`}
              >
                <FiUserPlus /> {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded flex items-center gap-1">
                <FiMessageSquare /> Message
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-8 mb-4">
            <div>
              <span className="font-bold">{user.posts?.length || 0}</span> posts
            </div>
            <div>
              <span className="font-bold">{user.followers?.length || 0}</span> followers
            </div>
            <div>
              <span className="font-bold">{user.following?.length || 0}</span> following
            </div>
          </div>
          
          {/* Bio */}
          <div>
            <h2 className="font-semibold">{user.fullName}</h2>
            <p>{user.bio || "This user hasn't added a bio yet"}</p>
          </div>
        </div>
      </div>

      {/* Tabs - Only show posts for other users */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <button 
            className={`py-4 px-5 border-t-2 ${
              activeTab === 'posts' ? 'border-black font-medium' : 'border-transparent text-gray-400'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
        </div>
      </div>

      {/* Posts */}
      <PostGrid posts={user.posts || []} />
    </div>
  );
};

export default UserProfilePage;