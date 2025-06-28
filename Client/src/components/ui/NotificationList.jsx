import React, { useState } from "react";
import { FiBell } from "react-icons/fi";

const NotificationList = ({ notifications = [] }) => {
  return (
    <div className="relative">

        <div className="absolute right-0 mt-2 w-80 bg-gray shadow-lg rounded-lg p-4 z-50">
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map(n => (
                <div 
                  key={n._id}
                  className={`p-3 rounded-md ${n.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}
                >
                  <div>
                    <span className="font-medium">{n.senderName}</span>{" "}
                    {n.type === "like" && "liked your post."}
                    {n.type === "comment" && "commented on your post."}
                    {n.type === "follow" && "started following you."}
                    <div className="text-xs text-gray-500 mt-1">{n.timeAgo}</div>
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