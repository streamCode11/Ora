import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Apis from "../../config/apis";
import { FiHeart, FiMessageSquare, FiBookmark, FiSend } from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${Apis.base}/posts`);
        // Filter out posts with null user if needed
        const validPosts = response.data.filter(post => post.images && post.images.length > 0);
        // Shuffle posts randomly
        const shuffledPosts = validPosts.sort(() => Math.random() - 0.5);
        setPosts(shuffledPosts);
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
    <div className=" max-w-[60%] lg:max-w-150  gap-0 lg:gap-5 mx-auto pb-20 pt-23 flex flex-wrap items-center justify-center">
      {posts.map((post) => (
        <div 
          key={post._id} 
          className="bg-white border border-gray-200 w-[80%] h-auto mb-6 rounded cursor-pointer"
        >
          {/* Post Header - Handle null user */}
          <div className="flex items-center p-3">
            <img
              src={post.user?.profileImg || ""}
              alt={post.user?.username || "Unknown user"}
              className="w-8 h-8 rounded-full mr-3 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <span className="font-semibold text-sm">
              {post.user?.username || "Unknown user"}
            </span>
          </div>

          {/* Post Image */}
          <div className="relative pb-[100%] bg-gray-100">
            <img
              src={post.images?.[0] }
              alt={post.caption || "Post image"}
              className="absolute h-full w-full object-cover"
              onClick={() => handlePostClick(post._id)}
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
          </div>

          {/* Post Actions */}
          <div className="p-3">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-4">
                <button className="focus:outline-none">
                  <FiHeart className="text-xl" />
                </button>
                <button>
                  <FiMessageSquare className="text-xl" />
                </button>
                <FiSend className="text-xl" />
              </div>
              <button>
                <FiBookmark className="text-xl" />
              </button>
            </div>

            {/* Likes */}
            <div className="font-semibold text-sm mb-1">
              {post.likes?.length || 0} likes
            </div>

            {/* Caption - Handle null user */}
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
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedPage;