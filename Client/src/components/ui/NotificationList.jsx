import React, { useState, useEffect } from "react";
import { FiBell, FiX } from "react-icons/fi";
import axios from "axios";
import Apis from "../../config/apis";
import { useNavigate } from "react-router-dom";

const NotificationList = ({ notifications = [], closeNotification }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("auth"))?.user;

  useEffect(() => {
    if (currentUser) {
      const count = notifications.filter(n => !n.read).length;
      setUnreadCount(count);
    }
  }, [notifications, currentUser]);

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await axios.patch(`${Apis.base}/notifications/${notification._id}/read`);
      }

      // Navigate based on notification type
      if (notification.post) {
        navigate(`/post/${notification.post._id}`);
      } else if (notification.type === "follow") {
        navigate(`/profile/${notification.sender._id}`);
      }

      closeNotification();
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${Apis.base}/notifications/${currentUser._id}/read-all`);
      // Update local state to reflect all notifications as read
      notifications.forEach(n => n.read = true);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="fixed w-96 right-0  top-0 bg-transparent  flex justify-end z-50">
      <div className="bg-white w-96 min-h-100 h-screen overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
            <button 
              onClick={closeNotification}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  <img
                    src={notification.sender?.profileImg || "/default-avatar.png"}
                    alt={notification.sender?.username}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-semibold mr-1">
                        {notification.sender?.username || "Someone"}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {notification.timeAgo}
                      </span>
                    </div>
                    <p className="text-sm mt-1">
                      {notification.type === "like" && "liked your post"}
                      {notification.type === "comment" && 
                        `commented: ${notification.content || ""}`}
                      {notification.type === "follow" && "started following you"}
                    </p>
                    {notification.post?.images?.[0] && (
                      <img
                        src={notification.post.images[0]}
                        alt="Post preview"
                        className="w-16 h-16 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;