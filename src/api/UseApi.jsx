import { useState, useEffect } from 'react';
import { fetchSongsApi, API_BASE_URL } from '../services/api';

/**
 * UseApi custom hooki - backenddan qo'shiqlarni yuklash uchun
 * Backend havolasi .env faylidan olinadi (API_BASE_URL)
 */
const UseApi = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSongsApi()
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { songs, loading, error, apiUrl: API_BASE_URL };
};

export default UseApi;
