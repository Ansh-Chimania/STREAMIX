import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../../api/tmdb';

export const searchContent = createAsyncThunk('search/searchContent', async ({ query, page = 1 }) => {
  const { data } = await tmdbAPI.searchMulti(query, page);
  return { ...data, query, page };
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    page: 1,
    total_pages: 0,
    total_results: 0,
    loading: false,
    error: null
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.page = 1;
      state.total_pages = 0;
      state.total_results = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchContent.pending, (state) => { state.loading = true; })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.results = action.payload.results;
        } else {
          state.results = [...state.results, ...action.payload.results];
        }
        state.page = action.payload.page;
        state.total_pages = action.payload.total_pages;
        state.total_results = action.payload.total_results;
        state.query = action.payload.query;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
