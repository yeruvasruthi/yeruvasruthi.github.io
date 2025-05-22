import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { name, email });
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify({ name, email }));
        setTimeout(() => {
          setLoading(false);
          navigate('/search');
        }, 300);
      }
    } catch (err) {
      setLoading(false);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="overlay" />
      <div className="login-box">
        <img
          src="https://cdn.builtin.com/cdn-cgi/image/f=auto,fit=contain,w=200,h=200,q=100/https://builtin.com/sites/www.builtin.com/files/2022-12/Fetch_PrimaryLogo.jpg"
          alt="dog gif"
          style={{ width: '100px', marginBottom: '1.5rem', borderRadius: '45%' }}
        />
        <h1>Welcome to Fetch</h1>
        <p style={{ color: 'black' }}>🐾 We help paws meet hearts.Sign in to meet your four-legged soulmate🐕!</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Paw-Parent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Paw-Parent Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : '🐾Start searching🐾'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
