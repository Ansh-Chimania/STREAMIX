import { createSlice } from '@reduxjs/toolkit';

const getStoredTheme = () => localStorage.getItem('cineverse_theme') || 'dark';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: getStoredTheme(),
    showTrailerModal: false,
    trailerKey: null,
    trailerTitle: '',
    sidebarOpen: false
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cineverse_theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    openTrailer(state, action) {
      state.showTrailerModal = true;
      state.trailerKey = action.payload.key;
      state.trailerTitle = action.payload.title;
    },
    closeTrailer(state) {
      state.showTrailerModal = false;
      state.trailerKey = null;
      state.trailerTitle = '';
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    }
  }
});

export const { toggleTheme, openTrailer, closeTrailer, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
