import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiSettings, FiUserPlus, FiGrid, FiBookmark, FiHeart, FiMessageSquare } from 'react-icons/fi';

const ProfilePage = () => {
  const [user, setUser] = useState({
    _id: "685ef8a8cfd0419b3c00a0b4",
    username: "whoisUmar",
    email: "its19083@gmail.com",
    bio: "Hey there! I am using Ora",
    profileImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfoiwPgBjRjmramkXTmajPJjyrYX7jZ2sFjw&s",
    createdAt: "2025-06-27T20:01:44.616Z",
    followers: [],
    following: []
  });

  const [posts, setPosts] = useState([
    { 
      _id: 1, 
      image: "https://picsum.photos/500/500?random=1", 
      likes: 24, 
      comments: 5 
    },
    { 
      _id: 2, 
      image: "https://picsum.photos/500/500?random=2", 
      likes: 56, 
      comments: 12 
    },
    { 
      _id: 3, 
      image: "https://picsum.photos/500/500?random=3", 
      likes: 89, 
      comments: 7 
    },
  ]);

  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const PostGrid = ({ posts }) => {
    return (
      <div className="grid grid-cols-3 gap-1 mt-4">
        {posts.map((post) => (
          <div key={post._id} className="aspect-square relative group cursor-pointer">
            <img
              src={post.image}
              alt={`Post ${post._id}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
              <span className="text-white font-bold flex items-center gap-1">
                <FiHeart size={20} />
                {post.likes}
              </span>
              <span className="text-white font-bold flex items-center gap-1">
                <FiMessageSquare size={20} />
                {post.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg">
          <img 
            src={user.profileImg} 
            alt={user.username} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">@{user.username}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              <Link to="/edit-profile">
                <button className="px-4 py-1 bg-gray  rounded-md text-sm font-medium flex items-center gap-1">
                  <FiEdit size={14} /> Edit Profile
                </button>
              </Link>
              <button className="px-4 py-1 bg-gray rounded-md text-sm font-medium">
                <FiSettings size={16} />
              </button>
              <button 
                className={`px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                  isFollowing ? 'bg-skin text-gray' : 'bg-gray text-white'
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <FiUserPlus size={14} />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <span className="font-bold block">{posts.length}</span>
              <span className="text-gray-400">Posts</span>
            </div>
            <div className="text-center">
              <span className="font-bold block">{user.followers.length}</span>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="text-center">
              <span className="font-bold block">{user.following.length}</span>
              <span className="text-gray-400">Following</span>
            </div>
          </div>
          
          <div className="mb-2">
            <h2 className="font-semibold">{user.username}</h2>
            <p className="text-gray-300">{user.bio}</p>
          </div>
          <p className="text-sm text-gray-400">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 w-[826px]">
        <div className="flex justify-center gap-12">
          <button 
            className={`py-4 px-1 border-t-2 flex items-center gap-1 ${
              activeTab === 'posts' ? 'border-skin font-medium' : 'border-transparent '
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid /> Posts
          </button>
          <button 
            className={`py-4 px-1 border-t-2 flex items-center gap-1 ${
              activeTab === 'saved' ? 'text-white border-skin font-medium' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            <FiBookmark /> Saved
          </button>
        </div>
      </div>

      {activeTab === 'posts' ? (
        posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <div className="col-span-3 py-16 text-center">
            <p className="text-gray-400">No posts yet</p>
          </div>
        )
      ) : (
        <div className="col-span-3 py-16 text-center">
          <FiBookmark size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Saved Posts</h3>
          <p className="text-gray-400">Save photos and videos that you want to see again</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;