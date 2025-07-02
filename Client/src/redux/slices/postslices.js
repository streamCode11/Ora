import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Action creators
    postStart(state) {
      state.loading = true;
      state.error = null;
    },
    postSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },
    postFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.loading = false;
      state.posts.unshift(action.payload);
    },
    likePostSuccess(state, action) {
      state.loading = false;
      const { postId, userId } = action.payload;
      state.posts = state.posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(userId);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter(id => id !== userId)
              : [...post.likes, userId]
          };
        }
        return post;
      });
    },
    deletePostSuccess(state, action) {
      state.loading = false;
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    setCurrentPost(state, action) {
      state.currentPost = action.payload;
    },
    clearCurrentPost(state) {
      state.currentPost = null;
    },
  },
});

export const {
  postStart,
  postSuccess,
  postFailure,
  createPostSuccess,
  likePostSuccess,
  deletePostSuccess,
  setCurrentPost,
  clearCurrentPost,
} = postSlice.actions;

export default postSlice.reducer;

export const fetchPosts = () => async (dispatch, getState) => {
  try {
    dispatch(postStart());
    const { token } = getState().auth.user;
    
    const response = await axios.get('/api/v1/posts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    dispatch(postSuccess(response.data.data));
  } catch (err) {
    dispatch(postFailure(err.response?.data?.message || 'Failed to fetch posts'));
  }
};

export const createPost = (formData) => async (dispatch, getState) => {
  try {
    dispatch(postStart());
    const { token } = getState().auth.user;
    
    const response = await axios.post('/api/v1/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    
    dispatch(createPostSuccess(response.data));
    return response.data;
  } catch (err) {
    dispatch(postFailure(err.response?.data?.message || 'Failed to create post'));
    throw err;
  }
};

export const likePost = (postId) => async (dispatch, getState) => {
  try {
    dispatch(postStart());
    const { token, _id: userId } = getState().auth.user;
    
    await axios.post(`/api/v1/posts/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    dispatch(likePostSuccess({ postId, userId }));
  } catch (err) {
    dispatch(postFailure(err.response?.data?.message || 'Failed to like post'));
  }
};

export const deletePost = (postId) => async (dispatch, getState) => {
  try {
    dispatch(postStart());
    const { token } = getState().auth.user;
    
    await axios.delete(`/api/v1/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    dispatch(deletePostSuccess(postId));
  } catch (err) {
    dispatch(postFailure(err.response?.data?.message || 'Failed to delete post'));
  }
};

export const fetchPostById = (postId) => async (dispatch, getState) => {
  try {
    dispatch(postStart());
    const { token } = getState().auth.user;
    
    const response = await axios.get(`/api/v1/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    dispatch(setCurrentPost(response.data));
  } catch (err) {
    dispatch(postFailure(err.response?.data?.message || 'Failed to fetch post'));
  }
};