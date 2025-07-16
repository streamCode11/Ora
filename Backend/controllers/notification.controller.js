import notificationModal from "../models/Notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await notificationModal.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "username profileImg")
      .populate("post");

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await notificationModal.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
};