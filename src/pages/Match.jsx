import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import api from '../api';
import './Match.css';

const Match = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const favoritesFromSearch = location.state?.favorites || [];

  const [matchDog, setMatchDog] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const { width, height } = useWindowSize();

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const getMatch = async () => {
      try {
        const res = await api.post('/dogs/match', favoritesFromSearch);
        const matchId = res.data.match;
        const { data } = await api.post('/dogs', [matchId]);
        setMatchDog(data[0]);
        toast.success('You found a match made in bark-heaven!', { toastId: 'match-success', autoClose: 900 });
      } catch (err) {
        console.error('Error fetching matched dog:', err);
        toast.error('Failed to load match. Try again.');
      }
    };

    const getFavoritesData = async () => {
      if (!favorites.length) return;
      try {
        const { data } = await api.post('/dogs', favorites);
        setFavoriteDogs(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    getMatch();
    getFavoritesData();
  }, [favorites, favoritesFromSearch]);

  const handleClearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
    toast('Favorites cleared.', { autoClose: 700 });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((dog) => dog !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info('You have been logged out.', { autoClose: 700 });
    navigate('/');
  };

  return (
    <div className="match-wrapper">
      {matchDog && !showFavoritesOnly && (
        <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      )}

      <div className="header">
        <h1> 🐾 Every DOG deserves LOVE</h1>
        <div className="top-actions">
          <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
            {showFavoritesOnly ? 'Hide Favorites' : 'Show Favorites'}
          </button>
          <button onClick={handleClearFavorites}>Clear Favorites</button>
          <Link to="/profile"><button>👤 Profile</button></Link>
          <button onClick={handleLogout}>🚪 Logout</button>
          <div className="heart-badge">❤️ {favorites.length}</div>
        </div>
      </div>

      {matchDog && !showFavoritesOnly && (
        <div className="match-card">
          <img src={matchDog.img} alt={matchDog.name} />
          <h2>{matchDog.name}</h2>
          <p><strong>Breed:</strong> {matchDog.breed}</p>
          <p><strong>Age:</strong> {matchDog.age}</p>
          <p><strong>Location:</strong> {matchDog.zip_code}</p>
        </div>
      )}

      {showFavoritesOnly && (
        <div className="dog-grid">
          {favoriteDogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <img src={dog.img} alt={dog.name} />
              <h3>{dog.name}</h3>
              <p><strong>Breed:</strong> {dog.breed}</p>
              <p><strong>Age:</strong> {dog.age}</p>
              <p><strong>Zip:</strong> {dog.zip_code}</p>
              <button
                className={favorites.includes(dog.id) ? 'fav active' : 'fav'}
                onClick={() => toggleFavorite(dog.id)}
              >
                {favorites.includes(dog.id) ? '❤️ Remove' : '🤍 Favorite'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="match-box">
        <button className="back-button" onClick={() => navigate('/search')}>
          Back to Search
        </button>
      </div>
    </div>
  );
};

export default Match;
