# CineVerse - Movie Platform

A full-stack movie streaming platform built with React, Node.js, Express, and MongoDB.

## Features

- Browse and search movies
- User authentication and profiles
- Watch history tracking
- Add movies to favorites
- Admin dashboard for content management
- Integration with TMDB API for movie data

## Project Structure

```
cineverse/
├── backend/          # Node.js/Express API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth and admin middleware
│   ├── models/       # MongoDB schemas
│   └── routes/       # API routes
├── frontend/         # React application
│   ├── public/       # Static files
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── hooks/        # Custom React hooks
│       ├── store/        # Redux state management
│       └── utils/        # Utility functions
```

## Installation

### Backend Setup

```bash
cd cineverse/backend
npm install
```

Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
TMDB_API_KEY=your_tmdb_api_key
```

### Frontend Setup

```bash
cd cineverse/frontend
npm install
```

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
```

## Running Locally

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm start
```

The frontend will open at `http://localhost:3000` and API runs on `http://localhost:5000`

## Deployment

### Backend Deployment (Vercel, Railway, or Heroku)
- Push to GitHub
- Connect repository to hosting service
- Set environment variables
- Deploy

### Frontend Deployment (Vercel or Netlify)
- Push to GitHub
- Connect repository to Vercel/Netlify
- Deploy automatically on push

## Technologies

- **Frontend**: React, Redux, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **APIs**: TMDB Movie API, Supabase

## License

MIT
