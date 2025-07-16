import React, { useState, useEffect } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiBookmark,
  FiHeart,
} from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";
import axios from "axios";
import Apis from "../../config/apis";

const PostModal = ({
  post,
  onClose,
  currentUser,
  savedPosts,
  handleLike,
  handleSavePost,
  currentImageIndex,
  setCurrentImageIndex,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get auth token
  const authToken = JSON.parse(localStorage.getItem("auth"))?.token;

  // Get post ID - using both _id and id for compatibility
  const postId = post?._id || post?.id;

  // Fetch comments when modal opens or post changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await axios.get(
          `${Apis.base}/posts/${postId}/comments`,
          {
            headers: {
              'x-auth-token': authToken
            }
          }
        );
        setComments(response.data);
      } catch (err) {
        console.log("Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, authToken]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    if (!currentUser?._id) {
      alert("Please log in to comment");
      navigate("/login");
      return;
    }
  
    if (!authToken) {
      alert("Authentication token missing");
      return;
    }
  
    try {
      setIsProcessing(true);
      
      const payload = {
        content: commentText,
        userId: currentUser._id,
        postId: postId  // Add postId to the payload
      };
  
      const response = await axios.post(
        `${Apis.base}/posts/${postId}/comments`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': authToken
          },
          validateStatus: (status) => status < 500
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        setComments(prev => [...prev, response.data]);
        setCommentText("");
      } else {
        throw new Error(response.data?.message || "Failed to post comment");
      }
    } catch (err) {
      console.log("Comment submission error:", {
        message: err.message,
        response: err.response?.data
      });
      alert(err.message || "Failed to post comment");
    } finally {
      setIsProcessing(false);
    }
  };

  const isLiked = currentUser && post.likes.some(like => 
    typeof like === 'object' ? like._id === currentUser._id : like === currentUser._id
  );
  const isSaved = savedPosts.includes(postId);

  return (
    <div className="fixed inset-0 bg-gray-200 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white overflow-hidden rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="lg:w-2/3 relative bg-white flex items-center justify-center">
          <div className="w-full h-full max-h-[80vh] flex items-center justify-center">
            <img
              src={post.images?.[currentImageIndex] || "/default-image.png"}
              alt={`Post ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-image.png";
              }}
            />
          </div>

          {post.images?.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? post.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 bg-mindaro text-gray p-2 rounded-full hover:bg-opacity-75 transition"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === post.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 bg-mindaro text-gray p-2 rounded-full hover:bg-opacity-75 transition"
              >
                <FiChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 flex space-x-2">
                {post.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full transition ${
                      currentImageIndex === index ? "bg-gray" : "bg-mindaro"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-1/3 flex flex-col border-l border-gray-200">
          {/* Header */}
          <div className="p-4 flex items-center border-b border-gray-200">
            <img
              src={post.user?.profileImg || "/default-profile.png"}
              alt={post.user?.username || "User"}
              className="w-8 h-8 rounded-full mr-3 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
            <span className="font-medium text-gray">{post.user?.username || "User"}</span>
            <button
              onClick={onClose}
              className="ml-auto bg-mindaro text-gray p-1 rounded-full hover:bg-opacity-80 transition"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Caption */}
            {post.caption && (
              <div className="flex">
                <img
                  src={post.user?.profileImg || "/default-profile.png"}
                  alt={post.user?.username || "User"}
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                <div>
                  <span className="font-bold text-gray text-sm mr-2">
                    {post.user?.username || "User"}
                  </span>
                  <span className="text-sm text-gray-500">{post.caption}</span>
                </div>
              </div>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-mindaro"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id || comment.id} className="flex">
                  <img
                    src={comment.user?.profileImg || "/default-profile.png"}
                    alt={comment.user?.username || "User"}
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-profile.png";
                    }}
                  />
                  <div>
                    <span className="font-semibold text-sm mr-2">
                      {comment.user?.username || "User"}
                    </span>
                    <span className="text-sm">
                      {comment.content || comment.text}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                No comments yet
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLike(postId)}
                  className="focus:outline-none hover:opacity-80 transition"
                  disabled={!currentUser}
                >
                  {isLiked ? (
                    <FaHeart className="text-xl text-red-500" />
                  ) : (
                    <FiHeart className="text-xl" />
                  )}
                </button>
                <button className="focus:outline-none hover:opacity-80 transition">
                  <FiMessageSquare className="text-xl" />
                </button>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePost(postId, e);
                }}
                className="focus:outline-none hover:opacity-80 transition"
                disabled={!currentUser}
              >
                {isSaved ? (
                  <FaBookmark className="text-xl text-yellow-500" />
                ) : (
                  <FiBookmark className="text-xl" />
                )}
              </button>
            </div>

            <div className="font-semibold text-sm mb-2">
              {post.likes?.length || 0} likes
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center pt-3">
              <input
                type="text"
                placeholder={currentUser ? "Add a comment..." : "Login to comment"}
                className="flex-1 outline-none text-sm bg-transparent"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!currentUser || isProcessing}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || !currentUser || isProcessing}
                className={`ml-2 font-semibold text-sm ${
                  commentText.trim() && currentUser && !isProcessing
                    ? "text-blue-500 hover:text-blue-600"
                    : "text-blue-200 cursor-not-allowed"
                } transition`}
              >
                {isProcessing ? "Posting..." : "Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;