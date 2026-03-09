import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('cineverse_user');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/signup', userData);
    localStorage.setItem('cineverse_token', data.token);
    localStorage.setItem('cineverse_user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Signup failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', credentials);
    localStorage.setItem('cineverse_token', data.token);
    localStorage.setItem('cineverse_user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/auth/profile');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to get profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem('cineverse_token'),
    isAuthenticated: !!localStorage.getItem('cineverse_token'),
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('cineverse_token');
      localStorage.removeItem('cineverse_user');
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
