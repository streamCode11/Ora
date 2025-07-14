import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Apis from "../../config/apis";
import { FiHeart, FiMessageSquare, FiBookmark } from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  // Get current user from localStorage
  const getCurrentUser = () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    return authData?.user || null;
  };

  // Load saved posts
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.savedPosts) {
      setSavedPosts(user.savedPosts);
    } else {
      // Fallback to local storage for guests
      const localSaved = JSON.parse(localStorage.getItem('localSavedPosts')) || [];
      setSavedPosts(localSaved);
    }
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${Apis.base}/posts`);
        const validPosts = response.data.filter(
          (post) => post.images && post.images.length > 0
        );
        setPosts(validPosts);
      } catch (err) {
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleLike = async (postId) => {
    try {
      const user = getCurrentUser();
      const userId = user?._id || `temp_${Math.random().toString(36).substr(2, 9)}`;

      // Optimistic UI update
      setPosts(posts.map(post => ({
        ...post,
        likes: post._id === postId
          ? post.likes?.includes(userId)
            ? post.likes.filter(id => id !== userId)
            : [...(post.likes || []), userId]
          : post.likes
      })));

      await axios.post(`${Apis.base}/posts/${postId}/like`, { userId });
    } catch (err) {
      console.error("Like error:", err);
      setPosts([...posts]);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        // For guests, just update localStorage
        const localSaved = JSON.parse(localStorage.getItem('localSavedPosts')) || [];
        const isSaved = localSaved.includes(postId);
        const newSavedPosts = isSaved 
          ? localSaved.filter(id => id !== postId)
          : [...localSaved, postId];
        
        setSavedPosts(newSavedPosts);
        localStorage.setItem('localSavedPosts', JSON.stringify(newSavedPosts));
        return;
      }
  
      const isSaved = savedPosts.includes(postId);
      
      // Optimistic UI update
      const newSavedPosts = isSaved 
        ? savedPosts.filter(id => id !== postId)
        : [...savedPosts, postId];
      setSavedPosts(newSavedPosts);
  
      // Make API call without authorization header
      const response = await axios.put(`${Apis.base}/posts/${user._id}/savedPosts`, {
        postId,
        action: isSaved ? 'remove' : 'add'
      });
  
      // Update local user data with fresh data from backend
      if (response.data?.user) {
        const authData = JSON.parse(localStorage.getItem("auth"));
        authData.user = response.data.user;
        localStorage.setItem("auth", JSON.stringify(authData));
      }
    } catch (err) {
      console.log("Save error:", err);
      setSavedPosts(savedPosts); // Revert on error
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-500">
      Error: {error}
      <button
        onClick={() => window.location.reload()}
        className="ml-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-[60%] lg:max-w-150 gap-0 lg:gap-5 mx-auto pb-20 pt-23 flex flex-wrap items-center justify-center">
      {posts.map((post) => {
        const user = getCurrentUser();
        const userId = user?._id || '';
        const isLiked = userId && post.likes?.includes(userId);
        const isSaved = savedPosts.includes(post._id);

        return (
          <div
            key={post._id}
            className="bg-white border border-gray-200 w-[80%] h-auto mb-6 rounded cursor-pointer"
          >
            {/* Post Header */}
            <div className="flex items-center p-3">
              <img
                src={post.user?.profileImg || ""}
                alt={post.user?.username || "Unknown user"}
                className="w-8 h-8 rounded-full mr-3 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
              <span className="font-semibold text-sm">
                {post.user?.username || "Unknown user"}
              </span>
            </div>

            {/* Post Image */}
            <div className="relative pb-[100%] bg-gray-100">
              <img
                src={post.images?.[0]}
                alt={post.caption || "Post image"}
                className="absolute h-full w-full object-cover"
                onClick={() => handlePostClick(post._id)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500";
                }}
              />
            </div>

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <button
                    className="focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                  >
                    {isLiked ? (
                      <FaHeart className="text-xl text-red-500" />
                    ) : (
                      <FiHeart className="text-xl" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post._id);
                    }}
                  >
                    <FiMessageSquare className="text-xl" />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSavePost(post._id);
                  }}
                >
                  {isSaved ? (
                    <FaBookmark className="text-xl text-yellow-500" />
                  ) : (
                    <FiBookmark className="text-xl" />
                  )}
                </button>
              </div>

              {/* Likes */}
              <div className="font-semibold text-sm mb-1">
                {post.likes?.length || 0} likes
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="text-sm mb-1">
                  <span className="font-semibold mr-2">
                    {post.user?.username || "Unknown user"}
                  </span>
                  {post.caption}
                </div>
              )}

              {/* Time */}
              <div className="text-xs text-gray-400 uppercase mt-2">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeedPage;