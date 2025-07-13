import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Apis from "../../config/apis";
import { FiHeart, FiMessageSquare, FiBookmark, FiSend } from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${Apis.base}/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-500">
      Error: {error}
      <button 
        onClick={() => navigate(-1)}
        className="ml-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto pb-20">
      <div className="bg-white border border-gray-200 mb-6 rounded">
        {/* Post Header */}
        <div className="flex items-center p-3">
          <img
            src={post.user?.profileImg || "https://via.placeholder.com/150"}
            alt={post.user?.username}
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
          <span className="font-semibold text-sm">{post.user?.username}</span>
        </div>

        {/* Post Image */}
        <div className="relative pb-[100%] bg-gray-100">
          <img
            src={post.images}
            alt="Post"
            className="absolute h-full w-full object-cover"
          />
        </div>

        {/* Post Details */}
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-4">
              <button className="focus:outline-none">
                {post.likes?.includes(post.user._id) ? (
                  <FaHeart className="text-xl text-red-500" />
                ) : (
                  <FiHeart className="text-xl" />
                )}
              </button>
              <button>
                <FiMessageSquare className="text-xl" />
              </button>
              <FiSend className="text-xl" />
            </div>
            <button>
              {post.isSaved ? (
                <FaBookmark className="text-xl" />
              ) : (
                <FiBookmark className="text-xl" />
              )}
            </button>
          </div>

          <div className="font-semibold text-sm mb-1">
            {post.likes?.length || 0} likes
          </div>

          <div className="text-sm mb-1">
            <span className="font-semibold mr-2">{post.user?.username}</span>
            {post.caption}
          </div>

          {post.comments?.length > 0 && (
            <div className="text-sm text-gray-500 mb-1">
              View all {post.comments.length} comments
            </div>
          )}

          <div className="text-xs text-gray-400 uppercase mt-2">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;