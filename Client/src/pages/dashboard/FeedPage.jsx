import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Apis from "../../config/apis";
import { FiHeart, FiMessageSquare, FiBookmark } from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";
import PostModal from "../../components/posts/PsotModal";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

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
      const localSaved =
        JSON.parse(localStorage.getItem("localSavedPosts")) || [];
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

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleLike = async (postId) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Find the post to update
      const postToUpdate = posts.find((post) => post._id === postId);
      if (!postToUpdate) return;

      // Check if user already liked the post
      const isLiked = postToUpdate.likes.some((like) =>
        typeof like === "object" ? like._id === user._id : like === user._id
      );

      // Optimistic update
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((like) =>
                    typeof like === "object"
                      ? like._id !== user._id
                      : like !== user._id
                  )
                : [
                    ...post.likes,
                    {
                      _id: user._id,
                      username: user.username,
                      profileImg: user.profileImg,
                    },
                  ],
            };
          }
          return post;
        })
      );

      // API call
      await axios.put(`${Apis.base}/posts/${postId}/like`, {
        userId: user.id,
      }, {
        
      });
    } catch (err) {
      console.log("Error toggling like:", err);
      // Revert on error
      setPosts([...posts]);
    }
  };

  const handleSavePost = async (postId, e) => {
    if (e) e.stopPropagation();
    try {
      const user = getCurrentUser();
      const authToken = JSON.parse(localStorage.getItem("auth"))?.token;

      if (!user) {
        // Handle for non-logged in users (save locally)
        const localSaved =
          JSON.parse(localStorage.getItem("localSavedPosts")) || [];
        const isSaved = localSaved.includes(postId);
        const newSavedPosts = isSaved
          ? localSaved.filter((id) => id !== postId)
          : [...localSaved, postId];

        setSavedPosts(newSavedPosts);
        localStorage.setItem("localSavedPosts", JSON.stringify(newSavedPosts));
        return;
      }

      const isSaved = savedPosts.includes(postId);
      const newSavedPosts = isSaved
        ? savedPosts.filter((id) => id !== postId)
        : [...savedPosts, postId];
      setSavedPosts(newSavedPosts);

      const response = await axios.put(
        `${Apis.base}/posts/${user._id}/savedPosts`,
        {
          postId,
          action: isSaved ? "remove" : "add",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authToken,
          },
        }
      );

      if (response.data?.user) {
        const authData = JSON.parse(localStorage.getItem("auth"));
        authData.user = response.data.user;
        localStorage.setItem("auth", JSON.stringify(authData));
      }
    } catch (err) {
      console.log("Save error:", err);
      setSavedPosts(savedPosts);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mindaro"></div>
      </div>
    );

  if (error)
    return (
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
    <div className="max-w-[700px] lg:max-w-150 gap-0 lg:gap-5 mx-auto pb-20 pt-23 flex flex-wrap items-center justify-center">
      {posts.map((post) => {
        const user = getCurrentUser();
        const isLiked =
          user &&
          post.likes.some((like) =>
            typeof like === "object" ? like._id === user._id : like === user._id
          );
        const isSaved = savedPosts.includes(post._id);

        return (
          <div
            key={post._id}
            className="bg-white border border-gray-200 lg:w-full h-auto mb-6 rounded cursor-pointer"
          >
            {/* Post Header */}
            <Link
              to={
                getCurrentUser()?._id === post.user?._id
                  ? "/profile"
                  : `/profile/${post.user?._id}`
              }
            >
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
            </Link>

            {/* Post Image */}
            <div className="relative pb-[100%] bg-gray-100">
              <img
                src={post.images?.[0]}
                alt={post.caption || "Post image"}
                className="absolute h-full w-full object-contain"
                onClick={() => handlePostClick(post)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
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
                      handlePostClick(post);
                    }}
                  >
                    <FiMessageSquare className="text-xl" />
                  </button>
                </div>
                <button
                  onClick={(e) => handleSavePost(post._id, e)}
                  className="focus:outline-none"
                >
                  {isSaved ? (
                    <FaBookmark className="text-xl text-yellow-500" />
                  ) : (
                    <FiBookmark className="text-xl" />
                  )}
                </button>
              </div>

              <div className="font-semibold text-sm mb-1">
                {post.likes?.length || 0} likes
              </div>

              {post.caption && (
                <div className="text-sm mb-1">
                  <span className="font-semibold mr-2">
                    {post.user?.username || "Unknown user"}
                  </span>
                  {post.caption}
                </div>
              )}

              {post.comments?.length > 0 && (
                <button
                  className="text-sm text-gray-500 mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePostClick(post);
                  }}
                >
                  View all {post.comments.length} comments
                </button>
              )}

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

      {/* Post Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={closeModal}
          currentUser={getCurrentUser()}
          savedPosts={savedPosts}
          handleLike={handleLike}
          handleSavePost={handleSavePost}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      )}
    </div>
  );
};

export default FeedPage;