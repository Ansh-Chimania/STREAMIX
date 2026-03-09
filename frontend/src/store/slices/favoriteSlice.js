import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/favorites');
    return data.favorites;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error);
  }
});

export const addFavorite = createAsyncThunk('favorites/add', async (movieData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/favorites', movieData);
    return data.favorite;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error);
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (tmdbId, { rejectWithValue }) => {
  try {
    await API.delete(`/favorites/${tmdbId}`);
    return tmdbId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error);
  }
});

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f.tmdbId !== action.payload);
      });
  }
});

export default favoriteSlice.reducer;
