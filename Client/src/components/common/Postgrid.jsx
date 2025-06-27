import React from 'react';
import { FiHeart, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PostGrid = ({ posts, onPostClick }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="col-span-3 py-16 text-center">
        <p className="text-gray-400">No posts to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 mt-4">
      {posts.map((post) => (
        <div 
          key={post._id || post.id} 
          className="aspect-square relative group cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          {/* Post Image */}
          <img
            src={post.image || post.media?.[0]?.url}
            alt={`Post ${post._id || post.id}`}
            className="w-full h-full object-cover"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
            <span className="text-white font-bold flex items-center gap-1">
              <FiHeart size={20} />
              {post.likes?.length || post.likes || 0}
            </span>
            <span className="text-white font-bold flex items-center gap-1">
              <FiMessageSquare size={20} />
              {post.comments?.length || post.comments || 0}
            </span>
          </div>
          
          {/* For multiple images/videos */}
          {post.media?.length > 1 && (
            <div className="absolute top-2 right-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostGrid;