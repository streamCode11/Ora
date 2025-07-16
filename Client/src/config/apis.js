const Apis = {
  auth: "http://localhost:8100/api/v1/auth",
  base: "http://localhost:8100/api/v1",
  posts: {
    like: (postId) => `${Apis.base}/posts/${postId}/like`,
  },
  notifications: {
    get: (userId) => `${Apis.base}/notifications/${userId}`,
    markAsRead: (notificationId) =>
      `${Apis.base}/notifications/${notificationId}/read`,
    markAllAsRead: (userId) => `${Apis.base}/notifications/${userId}/read-all`,
  },
};
export default Apis;
