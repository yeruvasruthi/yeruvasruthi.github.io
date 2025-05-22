import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import './Search.css';

const Search = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(() => localStorage.getItem('selectedBreed') || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [ageMin, setAgeMin] = useState(() => localStorage.getItem('ageMin') || '');
  const [ageMax, setAgeMax] = useState(() => localStorage.getItem('ageMax') || '');
  const [zipCode, setZipCode] = useState(() => localStorage.getItem('zipCode') || '');
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [from, setFrom] = useState(() => {
    const storedFrom = localStorage.getItem('from');
    return storedFrom ? parseInt(storedFrom, 10) : 0;
  });
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const navigate = useNavigate();
  const size = 20;

  useEffect(() => {
    localStorage.setItem('from', from);
  }, [from]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [from]);

  useEffect(() => {
    api.get('/dogs/breeds')
      .then(res => setBreeds(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => localStorage.setItem('selectedBreed', selectedBreed), [selectedBreed]);
  useEffect(() => localStorage.setItem('ageMin', ageMin), [ageMin]);
  useEffect(() => localStorage.setItem('ageMax', ageMax), [ageMax]);
  useEffect(() => localStorage.setItem('zipCode', zipCode), [zipCode]);

  useEffect(() => {
    if (ageMin && ageMax && Number(ageMax) < Number(ageMin)) {
      toast.error('Max Age cannot be less than Min Age', { autoClose: 1200 });
      return;
    }

    const fetchDogs = async () => {
      try {
        const res = await api.get('/dogs/search', {
          params: {
            size,
            from,
            sort: `breed:${sortOrder}`,
            breeds: selectedBreed ? [selectedBreed] : undefined,
            ageMin: ageMin ? Number(ageMin) : undefined,
            ageMax: ageMax ? Number(ageMax) : undefined,
            zipCodes: zipCode ? [zipCode.trim()] : undefined,
          },
        });
        setDogIds(res.data.resultIds);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Search error', err);
      }
    };

    if (!showFavoritesOnly) fetchDogs();
  }, [selectedBreed, sortOrder, ageMin, ageMax, zipCode, from, showFavoritesOnly]);

  useEffect(() => {
    if (showFavoritesOnly) setDogIds(favorites);
  }, [showFavoritesOnly, favorites]);

  useEffect(() => {
    if (!dogIds.length) {
      setDogs([]);
      return;
    }

    api.post('/dogs', dogIds)
      .then(res => setDogs(res.data))
      .catch(err => console.error(err));
  }, [dogIds]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(fav => fav !== id));
      toast.info('Removed from favorites.', { autoClose: 700 });
    } else {
      setFavorites(prev => [...prev, id]);
      toast.success('Added to favorites!', { autoClose: 700 });
    }
  };

  const handleMatch = () => {
    if (!favorites.length) {
      toast.warn('Please select at least one dog to match.', { autoClose: 700 });
      return;
    }
    navigate('/match', { state: { favorites } });
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
    toast('Favorites cleared.', { autoClose: 700 });
  };

  const handleClearFilters = () => {
    setSelectedBreed('');
    setAgeMin('');
    setAgeMax('');
    setZipCode('');
    localStorage.removeItem('selectedBreed');
    localStorage.removeItem('ageMin');
    localStorage.removeItem('ageMax');
    localStorage.removeItem('zipCode');
    toast('Filters cleared.', { autoClose: 700 });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info('You have been logged out.', { autoClose: 700 });
    navigate('/');
  };

  return (
    <div className="search-wrapper">
      <div className="header">
        <h1>🐾 Every DOG deserves LOVE</h1>
        <div className="top-actions">
          <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
            {showFavoritesOnly ? 'Show All Dogs' : 'Show Favorites Only'}
          </button>
          <button onClick={handleClearFavorites}>Clear Favorites</button>
          <Link to="/profile">
            <button>👤 Profile</button>
          </Link>
          <button onClick={handleLogout}>🚪 Logout</button>
          <div className="heart-badge">❤️ {favorites.length}</div>
        </div>
      </div>

      <div className="filters">
        <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Breed A–Z</option>
          <option value="desc">Breed Z–A</option>
        </select>

        <input
          type="number"
          placeholder="Min Age"
          value={ageMin}
          onChange={(e) => setAgeMin(e.target.value)}
          className="filter-input"
        />

        <input
          type="number"
          placeholder="Max Age"
          value={ageMax}
          onChange={(e) => setAgeMax(e.target.value)}
          className="filter-input"
        />

        <input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="filter-input"
        />

        <div className="filter-buttons">
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            ✖ Clear Filters
          </button>
          <button
            className="match-btn"
            onClick={handleMatch}
            disabled={!favorites.length}
            title={!favorites.length ? 'Please select at least one dog to match' : ''}>
            🎯 Find My Match
          </button>
        </div>
      </div>

      <div className="active-filters">
        {selectedBreed && <span className="filter-tag">Breed: {selectedBreed}</span>}
        {ageMin && <span className="filter-tag">Min Age: {ageMin}</span>}
        {ageMax && <span className="filter-tag">Max Age: {ageMax}</span>}
        {zipCode && <span className="filter-tag">Zip: {zipCode}</span>}
      </div>

      <div className="dog-grid">
        {dogs.length === 0 ? (
          <p className="empty-state">No dogs found. Try adjusting your filters!</p>
        ) : (
          dogs.map((dog) => (
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
          ))
        )}
      </div>

      {!showFavoritesOnly && (
        <div className="pagination">
          <button onClick={() => setFrom(from - size)} disabled={from === 0}>Prev</button>
          <span>Page {Math.floor(from / size) + 1} / {Math.ceil(total / size)}</span>
          <button onClick={() => setFrom(from + size)} disabled={from + size >= total}>Next</button>
        </div>
      )}

      <div className="match-box">
        <button
          onClick={handleMatch}
          disabled={!favorites.length}
          title={!favorites.length ? 'Please select at least one dog to match' : ''}
        >
          🎯 Find My Match
        </button>
      </div>
    </div>
  );
};

export default Search;
