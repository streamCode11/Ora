import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline"; // optional: install @heroicons/react

const NotificationDropdown = ({ notifications }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-blue-100 transition"
      >
        <BellIcon className="h-6 w-6 text-gray-700" />
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl p-4 z-50 space-y-2">
          <h2 className="text-base font-semibold text-gray-800">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 p-2 rounded-lg ${
                  n.isRead ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <div className="flex-1 text-sm text-gray-800">
                  <span className="font-medium">{n.senderName}</span>{" "}
                  {n.type === "like" && "liked your post."}
                  {n.type === "comment" && "commented on your post."}
                  {n.type === "follow" && "started following you."}
                  <div className="text-xs text-gray-400">{n.timeAgo}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
