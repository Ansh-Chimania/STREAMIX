import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tmdbAPI from '../../api/tmdb';
import Loader from '../../components/Loader/Loader';
import { getProfileUrl } from '../../utils/helpers';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import './People.css';

const People = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPeople = async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await tmdbAPI.getPopularPeople(pageNum);
      if (pageNum === 1) {
        setPeople(data.results);
      } else {
        setPeople(prev => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPeople(1); }, []);

  const loadMore = useCallback(async () => {
    await fetchPeople(page + 1);
  }, [page]);

  useInfiniteScroll(loadMore, page < totalPages);

  return (
    <div className="people-page page-container">
      <div className="container">
        <h1 className="page-title">👥 Popular People</h1>

        <div className="people-grid">
          {people.map(person => (
            <div key={person.id} className="person-card" onClick={() => navigate(`/person/${person.id}`)}>
              <img src={getProfileUrl(person.profile_path)} alt={person.name} loading="lazy" />
              <div className="person-info">
                <h3>{person.name}</h3>
                <p>{person.known_for_department}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && <Loader />}
      </div>
    </div>
  );
};

export default People;
