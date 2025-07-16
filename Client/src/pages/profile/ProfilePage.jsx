import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import defaultImg from "../../assets/images/download.jpeg";
import { 
  FiEdit, FiSettings, FiUserPlus, FiGrid, 
  FiBookmark, FiArrowLeft
} from 'react-icons/fi';
import axios from 'axios';
import LoaderCom from '../../components/common/Loader';
import Apis from '../../config/apis';
import PostGrid from '../../components/common/PostGrid';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Debug function to log data
  const debugLog = (message, data) => {
    console.log(`[DEBUG] ${message}:`, data);
  };

  const fetchUserPosts = async (userId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!authData?.token) {
        throw new Error('Authentication required');
      }

      debugLog('Fetching posts for user', userId);
      const response = await axios.get(`${Apis.base}/posts`);
      
      debugLog('Posts response', response.data);
      
      const filteredPosts = response.data.filter(post => {
        const postUserId = post.user?._id || post.user?.$oid || post.user;
        debugLog('Comparing post user ID', { postUserId, userId });
        return postUserId === userId;
      });
      
      return filteredPosts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error(error.response?.data?.message || 'Failed to load posts');
      return [];
    }
  };

  const fetchSavedPosts = async (savedPostIds) => {
    if (!savedPostIds || savedPostIds.length === 0) return [];
    
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!authData?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${Apis.base}/posts`, {
        headers: {
          'x-auth-token': authData.token
        }
      });

      return response.data.filter(post => 
        savedPostIds.includes(post._id)
      );
    } catch (error) {
      console.log('Error fetching saved posts:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        debugLog('Starting profile data fetch', { id });
        
        const authData = JSON.parse(localStorage.getItem("auth"));
        debugLog('Auth data from localStorage', authData);
        
        if (!authData) {
          toast.error('Please login to view profiles');
          navigate('/login');
          return;
        }

        // Set current user from auth data
        setCurrentUser(authData.user);
        const userIdToFetch = id || authData.user.id;
        debugLog('User ID to fetch', userIdToFetch);
        
        // Fetch user data
        const userResponse = await axios.get(`${Apis.auth}/${userIdToFetch}`, {
          headers: {
            'x-auth-token': authData.token
          }
        });
        debugLog('User response', userResponse.data);
        
        const userData = userResponse.data.user;
        setProfileUser(userData);
        
        // Fetch posts in parallel
        const posts = await fetchUserPosts(userIdToFetch);
        setUserPosts(posts);
        
        // Fetch saved posts if it's the current user's profile
        if (!id || userIdToFetch === authData.user.id) {
          const saved = await fetchSavedPosts(userData.savedPosts);
          setSavedPosts(saved);
        }
        
        // Check if current user is following this profile user
        if (id && id !== authData.user.id) {
          const followingStatus = authData.user.following?.includes(id) || false;
          debugLog('Following status', followingStatus);
          setIsFollowing(followingStatus);
        }
      } catch (err) {
        console.log('Error fetching profile data:', err);
        debugLog('Error details', {
          message: err.message,
          response: err.response?.data
        });
        navigate(id ? '/explore' : '/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id, navigate]);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      const authData = JSON.parse(localStorage.getItem("auth"));
      debugLog('Follow action data', { authData, id, isFollowing });
      
      if (!authData || !id) {
        toast.error('Authentication required');
        return;
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      debugLog('Making follow request', { endpoint });
      
      const response = await axios.patch(
        `${Apis.auth}/${id}/${endpoint}`, 
        null,
        {
          headers: {
            'x-auth-token': authData.token
          }
        }
      );
      debugLog('Follow response', response.data);

      if (response.data.success) {
        const newFollowingStatus = !isFollowing;
        setIsFollowing(newFollowingStatus);
        
        // Update profile user's followers
        setProfileUser(prev => ({
          ...prev,
          followers: newFollowingStatus
            ? [...prev.followers, authData.user._id]
            : prev.followers.filter(followerId => followerId !== authData.user._id)
        }));
        
        // Update current user's following list
        const updatedFollowing = newFollowingStatus
          ? [...(authData.user.following || []), id]
          : (authData.user.following || []).filter(followingId => followingId !== id);
        
        const updatedAuthData = {
          ...authData,
          user: {
            ...authData.user,
            following: updatedFollowing
          }
        };
        
        localStorage.setItem("auth", JSON.stringify(updatedAuthData));
        setCurrentUser(updatedAuthData.user);
        
      }
    } catch (error) {
      console.error('Follow error:', error);
      debugLog('Follow error details', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return <LoaderCom />;
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-white text-center">
        <h2 className="text-xl text-gray font-bold mb-2">Profile not found</h2>
        <p className="text-gray-400">The requested profile could not be loaded</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-mindaro text-gray rounded-md"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const isOwnProfile = !id || currentUser?.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {id && (
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-mindaro hover:text-gray transition-colors"
        >
          <FiArrowLeft /> Back
        </button>
      )}

      {/* Profile Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray shadow-lg">
          <img 
            src={profileUser.profileImg || defaultImg} 
            alt={profileUser.username} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultImg;
            }}
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-gray text-2xl font-bold">@{profileUser.username}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {isOwnProfile ? (
                <>
                  <Link to="/edit-profile" className="flex items-center">
                    <button className="px-4 py-1 bg-gray text-mindaro rounded-md text-sm font-medium flex items-center gap-1 hover:bg-opacity-90 transition">
                      <FiEdit size={14} /> Edit Profile
                    </button>
                  </Link>
                  <button className="px-4 py-1 bg-gray text-mindaro rounded-md text-sm font-medium hover:bg-opacity-90 transition">
                    <FiSettings size={16} />
                  </button>
                </>
              ) : (
                <button 
                  className={`px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition ${
                    isFollowing 
                      ? 'bg-gray text-mindaro hover:bg-opacity-90' 
                      : 'bg-mindaro text-gray hover:bg-opacity-90'
                  }`}
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {followLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <FiUserPlus size={14} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <span className="font-bold text-gray block">{userPosts.length}</span>
              <span className="text-gray-400">Posts</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-gray block">{profileUser.followers?.length || 0}</span>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-gray block">{profileUser.following?.length || 0}</span>
              <span className="text-gray-400">Following</span>
            </div>
          </div>
          
          <div className="mb-2">
            <h2 className="font-semibold text-gray">{profileUser.fullName}</h2>
            <p className="text-gray">{profileUser.bio || "No bio yet"}</p>
          </div>
          <p className="text-sm text-gray">
            Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-t border-gray">
        <div className="flex justify-center gap-12">
          <button 
            className={`py-4 px-5 border-t-2 flex items-center gap-1 text-gray transition ${
              activeTab === 'posts' 
                ? 'border-gray font-medium bg-gray text-mindaro' 
                : 'border-transparent hover:text-mindaro'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid /> Posts
          </button>
          {isOwnProfile && (
            <button 
              className={`py-4 px-5 text-gray border-t-2 flex items-center gap-1 transition ${
                activeTab === 'saved' 
                  ? 'border-gray font-medium bg-gray text-mindaro' 
                  : 'border-transparent hover:text-mindaro'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              <FiBookmark /> Saved
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'posts' ? (
          userPosts.length > 0 ? (
            <PostGrid 
              posts={userPosts} 
              onPostClick={(post) => console.log('Post clicked', post)}
            />
          ) : (
            <div className="col-span-3 py-16 text-center">
              <FiGrid size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl text-gray font-bold mb-2">No Posts Yet</h3>
              <p className="text-gray-400">
                {isOwnProfile ? "When you share photos, they'll appear here" : "This user hasn't posted anything yet"}
              </p>
            </div>
          )
        ) : (
          savedPosts.length > 0 ? (
            <PostGrid 
              posts={savedPosts} 
              onPostClick={(post) => console.log('Saved post clicked', post)}
            />
          ) : (
            <div className="col-span-3 py-16 text-center">
              <FiBookmark size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl text-gray font-bold mb-2">No Saved Posts</h3>
              <p className="text-gray-400">Save photos and videos that you want to see again</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;