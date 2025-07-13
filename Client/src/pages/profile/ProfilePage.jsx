import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FiEdit, FiSettings, FiUserPlus, FiGrid, 
  FiBookmark
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoaderCom from '../../components/common/Loader';
import Apis from '../../config/apis';
import PostGrid from '../../components/common/PostGrid';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const { id } = useParams();

  const fetchUserPosts = async (userId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const response = await axios.get(`${Apis.base}/posts`, {
        headers: {
          'x-auth-token': authData.token
        }
      });
  
      return response.data.filter(post => {
        const postUserId = post.user?._id || post.user?.$oid || post.user;
        return postUserId === userId;
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
      return [];
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const authData = JSON.parse(localStorage.getItem("auth"));
        
        if (!authData) {
          toast.error('Please login to view profiles');
          return;
        }

        setCurrentUser(authData.user);
        const userIdToFetch = id || authData.user._id;
        
        // Fetch user data
        const userResponse = await axios.get(`${Apis.auth}/${userIdToFetch}`, {
          headers: {
            'x-auth-token': authData.token
          }
        });
        
        setProfileUser(userResponse.data.user);
        
        if (id && id !== authData.user._id) {
          setIsFollowing(authData.user.following?.includes(id) || false);
        }
        
        // Fetch and filter posts for this user
        const posts = await fetchUserPosts(userIdToFetch);
        setUserPosts(posts);
      } catch (err) {
        console.log('Error fetching profile data:', err);
        toast.error(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
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
        `${Apis.auth}/${id}/${endpoint}`, 
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

  if (loading || !profileUser) {
    return <LoaderCom/>;
  }

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray shadow-lg">
          <img 
            src={profileUser.profileImg || "https://picsum.photos/200/200?random=1"} 
            alt={profileUser.username} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://picsum.photos/200/200?random=1";
            }}
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-gray text-2xl font-bold">@{profileUser.username}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {isOwnProfile ? (
                <>
                  <Link to="/edit-profile">
                    <button className="px-4 py-1 bg-gray text-mindaro rounded-md text-sm font-medium flex items-center gap-1">
                      <FiEdit size={14} /> Edit Profile
                    </button>
                  </Link>
                  <button className="px-4 py-1 bg-gray text-mindaro rounded-md text-sm font-medium">
                    <FiSettings size={16} />
                  </button>
                </>
              ) : (
                <button 
                  className={`px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                    isFollowing ? 'bg-gray text-mindaro' : 'bg-mindaro text-gray'
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
            <h2 className="font-semibold text-gray">{profileUser.fullName || profileUser.username}</h2>
            <p className="text-gray">{profileUser.bio || "No bio yet"}</p>
          </div>
          <p className="text-sm text-gray">
            Joined {formatDate(profileUser.createdAt)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray">
        <div className="flex justify-center gap-12">
          <button 
            className={`py-4 px-5 border-t-2 flex items-center gap-1 text-gray ${
              activeTab === 'posts' ? 'border-gray font-medium bg-gray text-mindaro' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid /> Posts
          </button>
          {isOwnProfile && (
            <button 
              className={`py-4 px-5 text-gray border-t-2 flex items-center gap-1 ${
                activeTab === 'saved' ? 'border-gray font-medium bg-gray text-mindaro' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              <FiBookmark /> Saved
            </button>
          )}
        </div>
      </div>

      {activeTab === 'posts' ? (
        userPosts.length > 0 ? (
          <PostGrid 
            posts={userPosts} 
            onPostClick={setSelectedPost}
          />
        ) : (
          <div className="col-span-3 py-16 text-center">
            <FiGrid size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-gray font-bold mb-2">No Posts Yet</h3>
            <p className="text-gray-400">When you share photos, they'll appear here</p>
          </div>
        )
      ) : (
        <div className="col-span-3 py-16 text-center">
          <FiBookmark size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl text-gray font-bold mb-2">No Saved Posts</h3>
          <p className="text-gray-400">Save photos and videos that you want to see again</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;