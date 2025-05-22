// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true, // sends cookies with requests
});

export default api;
