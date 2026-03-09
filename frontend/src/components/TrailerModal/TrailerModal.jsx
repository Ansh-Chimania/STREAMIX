import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player/youtube';
import { FiX } from 'react-icons/fi';
import { closeTrailer } from '../../store/slices/uiSlice';
import './TrailerModal.css';

const TrailerModal = () => {
  const { showTrailerModal, trailerKey, trailerTitle } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  if (!showTrailerModal) return null;

  const handleClose = () => dispatch(closeTrailer());

  return (
    <div className="trailer-modal-overlay" onClick={handleClose}>
      <div className="trailer-modal" onClick={e => e.stopPropagation()}>
        <div className="trailer-header">
          <h3 className="trailer-title">{trailerTitle || 'Trailer'}</h3>
          <button className="trailer-close" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <div className="trailer-player">
          {trailerKey ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              width="100%"
              height="100%"
              playing
              controls
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0
                  }
                }
              }}
            />
          ) : (
            <div className="trailer-unavailable">
              <p>🎬 Trailer for this title is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
