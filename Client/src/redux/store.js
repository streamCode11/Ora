import { configureStore } from '@reduxjs/toolkit';
import postReducer from "./slices/postslices"
export const store = configureStore({
  reducer: {
    posts: postReducer,
    auth:authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
