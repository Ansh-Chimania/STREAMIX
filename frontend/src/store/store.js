import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import searchReducer from './slices/searchSlice';
import favoriteReducer from './slices/favoriteSlice';
import watchHistoryReducer from './slices/watchHistorySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    search: searchReducer,
    favorites: favoriteReducer,
    watchHistory: watchHistoryReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
