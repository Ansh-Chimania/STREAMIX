import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../../api/tmdb';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async ({ timeWindow, page } = {}) => {
  const { data } = await tmdbAPI.getTrending(timeWindow, page);
  return data;
});

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopular', async (page = 1) => {
  const { data } = await tmdbAPI.getPopularMovies(page);
  return { ...data, page };
});

export const fetchTopRatedMovies = createAsyncThunk('movies/fetchTopRated', async (page = 1) => {
  const { data } = await tmdbAPI.getTopRatedMovies(page);
  return { ...data, page };
});

export const fetchUpcomingMovies = createAsyncThunk('movies/fetchUpcoming', async (page = 1) => {
  const { data } = await tmdbAPI.getUpcomingMovies(page);
  return data;
});

export const fetchNowPlaying = createAsyncThunk('movies/fetchNowPlaying', async (page = 1) => {
  const { data } = await tmdbAPI.getNowPlayingMovies(page);
  return data;
});

export const fetchPopularTV = createAsyncThunk('movies/fetchPopularTV', async (page = 1) => {
  const { data } = await tmdbAPI.getPopularTV(page);
  return { ...data, page };
});

export const fetchTopRatedTV = createAsyncThunk('movies/fetchTopRatedTV', async (page = 1) => {
  const { data } = await tmdbAPI.getTopRatedTV(page);
  return data;
});

export const fetchMovieDetail = createAsyncThunk('movies/fetchDetail', async ({ id, type }) => {
  const { data } = type === 'tv' ? await tmdbAPI.getTVDetail(id) : await tmdbAPI.getMovieDetail(id);
  return { ...data, mediaType: type };
});

export const fetchByGenre = createAsyncThunk('movies/fetchByGenre', async ({ genreId, page, type }) => {
  const { data } = await tmdbAPI.discoverByGenre(genreId, page, type);
  return { ...data, page };
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: { results: [], page: 1, total_pages: 0 },
    popular: { results: [], page: 1, total_pages: 0 },
    topRated: { results: [], page: 1, total_pages: 0 },
    upcoming: { results: [] },
    nowPlaying: { results: [] },
    popularTV: { results: [], page: 1, total_pages: 0 },
    topRatedTV: { results: [] },
    currentDetail: null,
    genreResults: { results: [], page: 1, total_pages: 0 },
    loading: false,
    detailLoading: false,
    error: null
  },
  reducers: {
    clearDetail(state) {
      state.currentDetail = null;
    },
    clearGenreResults(state) {
      state.genreResults = { results: [], page: 1, total_pages: 0 };
    }
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrending.pending, (state) => { state.loading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Popular
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.popular = action.payload;
        } else {
          state.popular.results = [...state.popular.results, ...action.payload.results];
          state.popular.page = action.payload.page;
        }
        state.loading = false;
      })
      // Top Rated
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.topRated = action.payload;
        } else {
          state.topRated.results = [...state.topRated.results, ...action.payload.results];
          state.topRated.page = action.payload.page;
        }
        state.loading = false;
      })
      // Upcoming
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.upcoming = action.payload;
        state.loading = false;
      })
      // Now Playing
      .addCase(fetchNowPlaying.fulfilled, (state, action) => {
        state.nowPlaying = action.payload;
        state.loading = false;
      })
      // Popular TV
      .addCase(fetchPopularTV.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.popularTV = action.payload;
        } else {
          state.popularTV.results = [...state.popularTV.results, ...action.payload.results];
          state.popularTV.page = action.payload.page;
        }
        state.loading = false;
      })
      // Top Rated TV
      .addCase(fetchTopRatedTV.fulfilled, (state, action) => {
        state.topRatedTV = action.payload;
        state.loading = false;
      })
      // Detail
      .addCase(fetchMovieDetail.pending, (state) => { state.detailLoading = true; })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchMovieDetail.rejected, (state) => { state.detailLoading = false; })
      // Genre
      .addCase(fetchByGenre.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.genreResults = action.payload;
        } else {
          state.genreResults.results = [...state.genreResults.results, ...action.payload.results];
          state.genreResults.page = action.payload.page;
        }
        state.loading = false;
      });
  }
});

export const { clearDetail, clearGenreResults } = movieSlice.actions;
export default movieSlice.reducer;
