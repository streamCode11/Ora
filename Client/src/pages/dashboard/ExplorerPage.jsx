import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import Apis from "../../config/apis";
import {
  FiHeart,
  FiMessageSquare,
  FiBookmark,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaHeart, FaBookmark } from "react-icons/fa";
import PostModal from "../../components/posts/PsotModal";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedPost.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedPost.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleLike = async (postId) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Optimistic update
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes.some((like) => like._id === user._id);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((like) => like._id !== user._id)
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

      await axios.put(`${Apis.base}/posts/${postId}/like`, {
        userId: user._id,
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert on error
      setPosts([...posts]);
    }
  };

  const handleSavePost = async (postId, e) => {
    if (e) e.stopPropagation();
    try {
      const user = getCurrentUser();
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
    <div className="max-w-full lg:max-w-[70%] gap-0 lg:gap-3 mx-auto pt-10 flex flex-wrap items-left h-full ">
      {posts.map((post) => {
        const user = getCurrentUser();
        return (
          <div
            key={post._id}
            className="bg-white p-2 relative w-90 h-full  rounded cursor-pointer">

            <div className="relative pb-[100%] bg-white">
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

export default ExplorePage;
