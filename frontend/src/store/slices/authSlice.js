import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../api/supabase';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('cineverse_user');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

// Auto-restore session on app load
export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return rejectWithValue('No active session');

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) return rejectWithValue('Profile not found');

    const user = {
      id: session.user.id,
      name: profile.name || '',
      email: profile.email || session.user.email,
      role: profile.role || 'user',
      avatar: profile.avatar || '',
      preferences: profile.preferences || { darkMode: true, favoriteGenres: [] }
    };

    localStorage.setItem('cineverse_token', session.access_token);
    localStorage.setItem('cineverse_user', JSON.stringify(user));

    return { token: session.access_token, user };
  } catch (error) {
    return rejectWithValue(error.message || 'Session restore failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (authError) throw authError;

    if (!authData.session) {
      return rejectWithValue('This email is already registered. Please sign in instead.');
    }

    // Update profile name
    if (authData.user) {
      await supabase
        .from('profiles')
        .update({ name, email })
        .eq('id', authData.user.id);
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const user = {
      id: authData.user.id,
      name: profile?.name || name,
      email: profile?.email || email,
      role: profile?.role || 'user',
      avatar: profile?.avatar || '',
      preferences: profile?.preferences || { darkMode: true, favoriteGenres: [] }
    };

    localStorage.setItem('cineverse_token', authData.session.access_token);
    localStorage.setItem('cineverse_user', JSON.stringify(user));

    return { token: authData.session.access_token, user };
  } catch (error) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.session) throw new Error('No session returned');

    // Fetch profile with timeout (don't let it hang forever)
    let profile = null;
    try {
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      );

      const { data: profileData } = await Promise.race([profilePromise, timeoutPromise]);
      profile = profileData;
    } catch (profileErr) {
      console.warn('[Auth] Profile fetch failed/timed out, using auth metadata:', profileErr.message);
    }

    if (profile?.is_banned) {
      await supabase.auth.signOut();
      return rejectWithValue('Your account has been banned');
    }

    const user = {
      id: data.user.id,
      name: profile?.name || data.user.user_metadata?.name || '',
      email: profile?.email || data.user.email,
      role: profile?.role || 'user',
      avatar: profile?.avatar || '',
      preferences: profile?.preferences || { darkMode: true, favoriteGenres: [] }
    };

    localStorage.setItem('cineverse_token', data.session.access_token);
    localStorage.setItem('cineverse_user', JSON.stringify(user));

    return { token: data.session.access_token, user };
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) throw error;

    const user = {
      id: authUser.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar,
      preferences: profile.preferences,
      createdAt: profile.created_at
    };

    localStorage.setItem('cineverse_user', JSON.stringify(user));
    return { user };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to get profile');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ name, avatar, preferences }, { rejectWithValue }) => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (preferences !== undefined) updates.preferences = preferences;
    updates.updated_at = new Date().toISOString();

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authUser.id)
      .select()
      .single();

    if (error) throw error;

    const user = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar,
      preferences: profile.preferences
    };

    localStorage.setItem('cineverse_user', JSON.stringify(user));
    return { user };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update profile');
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
      supabase.auth.signOut();
    },
    clearError(state) {
      state.error = null;
    },
    setSession(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = !!token;
    }
  },
  extraReducers: (builder) => {
    builder
      // Restore session
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        // Clear stale data if session restore fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('cineverse_token');
        localStorage.removeItem('cineverse_user');
      })
      // Signup
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
      // Login
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
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { logout, clearError, setSession } = authSlice.actions;
export default authSlice.reducer;
