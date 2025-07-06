import React, { useState } from "react";
import { FiBell, FiX } from "react-icons/fi";

const NotificationList = ({ notifications = [] , closeNotification }) => {
  return (
    <div className="">
        <div className="absolute right-10 top-20  w-90 bg-gray shadow-lg rounded-lg p-4 z-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-mindaro mb-2">Notifications</h3>
          <div className="flex justify-center items-center bg-mindaro text-gray p-2 rounded-full"
          onClick={closeNotification}>
              <FiX className="justify-center items-center flex"/>
          </div>
        </div>
          {notifications.length === 0 ? (
            <p className="text-white">No new notifications.</p>
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
                    <div className="text-xs text-white mt-1">{n.timeAgo}</div>
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