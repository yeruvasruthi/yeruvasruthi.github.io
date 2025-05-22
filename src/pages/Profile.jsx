import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import api from '../api';

const generateAvatarUrl = (name) => {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'puppy')}`;
};

const getMostLikedBreed = (dogs) => {
  if (!dogs.length) return null;
  const count = {};
  dogs.forEach(d => {
    count[d.breed] = (count[d.breed] || 0) + 1;
  });
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
};

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user')) || { name: '', email: '' };

  const [name] = useState(storedUser.name);
  const [email] = useState(storedUser.email);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [mostLikedBreed, setMostLikedBreed] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!favorites.length) return;
      try {
        const { data } = await api.post('/dogs', favorites);
        setFavoriteDogs(data);
        setMostLikedBreed(getMostLikedBreed(data));
      } catch (err) {
        console.error('Failed to fetch favorite dogs:', err);
      }
    };
    fetchFavorites();
  }, [favorites]);

  const handleClearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
    setFavoriteDogs([]);
    setMostLikedBreed(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="profile-wrapper">
      <div className="header">
        <h1> 🐾 Every DOG deserves LOVE</h1>
        <div className="top-actions">
          <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
            {showFavoritesOnly ? 'Hide Favorites' : 'Show Favorites'}
          </button>
          <button onClick={handleClearFavorites}>🗑 Clear Favorites</button>
          <button onClick={handleLogout}>🚪 Logout</button>
          <div className="heart-badge">❤️ {favorites.length}</div>
        </div>
      </div>

      {!showFavoritesOnly && (
        <div className="profile-card horizontal">
          <img src={generateAvatarUrl(name)} alt="Avatar" className="small-avatar" />
          <div className="profile-info">
            <h2>{name || 'Dog Lover'}</h2>
            <p>{email}</p>
          </div>
        </div>
      )}

      {!showFavoritesOnly && mostLikedBreed && (
        <div className="metrics-box">
          <p>💡 <strong>The breed you like the most:</strong> {mostLikedBreed}</p>
        </div>
      )}

      <div className="favorites-section">
        {!showFavoritesOnly && <h3>Your Favorite Dogs 🐾</h3>}
        {favoriteDogs.length === 0 ? (
          <p className="empty-state">You haven’t favorited any dogs yet.</p>
        ) : (
          <div className="dog-grid">
            {favoriteDogs.map(dog => (
              <div className="dog-card" key={dog.id}>
                <img src={dog.img} alt={dog.name} />
                <h4>{dog.name}</h4>
                <p><strong>Breed:</strong> {dog.breed}</p>
                <p><strong>Age:</strong> {dog.age}</p>
                <p><strong>Zip:</strong> {dog.zip_code}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="match-box">
        <button className="back-button" onClick={() => navigate('/search')}>
           Back to Search
        </button>
      </div>
    </div>
  );
};

export default Profile;
