import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FiEdit, FiSettings, FiUserPlus, FiGrid, 
  FiBookmark, FiHeart, FiMessageSquare,
  FiChevronLeft, FiChevronRight, FiX
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState({
    _id: '',
    username: '',
    profileImg: '',
    bio: '',
    followers: [],
    following: [],
    createdAt: '',
    posts: []
  });
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const authData = JSON.parse(localStorage.getItem("auth"));
        
        if (authData) {
          setCurrentUser(authData.user);
          
          if (!id || id === authData.user._id) {
            setProfileUser({
              ...authData.user,
              followers: authData.user.followers || [],
              following: authData.user.following || [],
              posts: authData.user.posts || []
            });
            setIsFollowing(false); 
          } else {
            const response = await axios.get(`/api/v1/auth/${id}`, {
              headers: {
                'x-auth-token': authData.token
              }
            });
            setProfileUser(response.data.user);
            setIsFollowing(authData.user.following.includes(id));
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const handleFollow = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!authData) {
        toast.error('You must be logged in to follow users');
        return;
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await axios.patch(
        `/api/v1/auth/${id}/${endpoint}`, 
        null,
        {
          headers: {
            'x-auth-token': authData.token
          }
        }
      );

      if (response.data.success) {
        setIsFollowing(!isFollowing);
        setProfileUser(prev => ({
          ...prev,
          followers: isFollowing
            ? prev.followers.filter(followerId => followerId !== authData.user._id)
            : [...prev.followers, authData.user._id]
        }));
        
        const updatedAuthData = {
          ...authData,
          user: {
            ...authData.user,
            following: isFollowing
              ? authData.user.following.filter(followingId => followingId !== id)
              : [...authData.user.following, id]
          }
        };
        localStorage.setItem("auth", JSON.stringify(updatedAuthData));
        setCurrentUser(updatedAuthData.user);
        
        toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    }
  };


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-white">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}

    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg">
          <img 
            src={profileUser.profileImg || "https://picsum.photos/200/200?random=1"} 
            alt={profileUser.username} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">@{profileUser.username}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {isOwnProfile ? (
                <>
                  <Link to="/edit-profile">
                    <button className="px-4 py-1 bg-gray rounded-md text-sm font-medium flex items-center gap-1">
                      <FiEdit size={14} /> Edit Profile
                    </button>
                  </Link>
                  <button className="px-4 py-1 bg-gray rounded-md text-sm font-medium">
                    <FiSettings size={16} />
                  </button>
                </>
              ) : (
                <button 
                  className={`px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    isFollowing ? 'bg-gray text-white' : 'bg-skin text-white'
                  }`}
                  onClick={handleFollow}
                >
                  <FiUserPlus size={14} />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <span className="font-bold block">{profileUser.posts?.length || 0}</span>
              <span className="text-gray-400">Posts</span>
            </div>
            <div className="text-center">
              <span className="font-bold block">{profileUser.followers?.length || 0}</span>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="text-center">
              <span className="font-bold block">{profileUser.following?.length || 0}</span>
              <span className="text-gray-400">Following</span>
            </div>
          </div>
          
          <div className="mb-2">
            <h2 className="font-semibold">{profileUser.username}</h2>
            <p className="text-gray-300">{profileUser.bio || "No bio yet"}</p>
          </div>
          <p className="text-sm text-gray-400">
            Joined {profileUser.createdAt ? formatDate(profileUser.createdAt) : "Unknown date"}
          </p>
        </div>
      </div>

      <div className="border-t border-gray">
        <div className="flex justify-center gap-12">
          <button 
            className={`py-4 px-1 border-t-2 flex items-center gap-1 ${
              activeTab === 'posts' ? 'border-skin font-medium' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid /> Posts
          </button>
          {isOwnProfile && (
            <button 
              className={`py-4 px-1 border-t-2 flex items-center gap-1 ${
                activeTab === 'saved' ? 'text-white border-skin font-medium' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              <FiBookmark /> Saved
            </button>
          )}
        </div>
      </div>
{/* 
      {activeTab === 'posts' ? (
        <PostGrid posts={profileUser.posts} />
      ) : (
        <div className="col-span-3 py-16 text-center">
          <FiBookmark size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Saved Posts</h3>
          <p className="text-gray-400">Save photos and videos that you want to see again</p>
        </div>
      )} */}
    </div>
    </div>
  );
};

export default ProfilePage;