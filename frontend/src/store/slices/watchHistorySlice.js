import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchWatchHistory = createAsyncThunk('watchHistory/fetch', async (page = 1) => {
  const { data } = await API.get(`/watch-history?page=${page}`);
  return data;
});

export const addToWatchHistory = createAsyncThunk('watchHistory/add', async (movieData) => {
  const { data } = await API.post('/watch-history', movieData);
  return data.history;
});

export const clearWatchHistory = createAsyncThunk('watchHistory/clear', async () => {
  await API.delete('/watch-history');
});

const watchHistorySlice = createSlice({
  name: 'watchHistory',
  initialState: {
    items: [],
    loading: false,
    page: 1,
    total_pages: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.history;
        state.page = action.payload.page;
        state.total_pages = action.payload.total_pages;
      })
      .addCase(clearWatchHistory.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export default watchHistorySlice.reducer;
