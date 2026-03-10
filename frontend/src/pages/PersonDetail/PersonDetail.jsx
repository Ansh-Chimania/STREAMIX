import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdbAPI from '../../api/tmdb';
import MovieRow from '../../components/MovieRow/MovieRow';
import Loader from '../../components/Loader/Loader';
import { getProfileUrl, formatDate } from '../../utils/helpers';
import './PersonDetail.css';

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const { data } = await tmdbAPI.getPersonDetail(id);
        setPerson(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPerson();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !person) return <Loader fullPage />;

  const movieCredits = person.movie_credits?.cast?.slice(0, 20) || [];
  const tvCredits = person.tv_credits?.cast?.slice(0, 20) || [];

  return (
    <div className="person-detail-page page-container">
      <div className="container">
        <div className="person-main">
          <div className="person-photo">
            <img
              src={getProfileUrl(person.profile_path, 'large')}
              alt={person.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getProfileUrl(null);
              }}
            />
          </div>
          <div className="person-bio">
            <h1>{person.name}</h1>
            <div className="person-meta">
              {person.birthday && <span>🎂 {formatDate(person.birthday)}</span>}
              {person.place_of_birth && <span>📍 {person.place_of_birth}</span>}
              {person.known_for_department && <span>🎬 {person.known_for_department}</span>}
            </div>
            <p className="bio-text">{person.biography || 'Biography not available.'}</p>
          </div>
        </div>
      </div>

      {movieCredits.length > 0 && (
        <MovieRow title="Movies" items={movieCredits.map(m => ({ ...m, media_type: 'movie' }))} />
      )}
      {tvCredits.length > 0 && (
        <MovieRow title="TV Shows" items={tvCredits.map(t => ({ ...t, media_type: 'tv' }))} />
      )}
    </div>
  );
};

export default PersonDetail;
