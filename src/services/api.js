import axios from 'axios';

// Backend URL .env faylidan olinadi
const RAW_URL = import.meta.env.VITE_API_URL || 'https://music-l8kd.onrender.com';
export const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

// Axios instansiyasi
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Chiroyli default cover rasmlar (agar backend cover mavjud bo'lmasa yoki xato bersa)
export const DEFAULT_COVERS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
];

// Media URL ni to'g'irlash (nisbiy /uploads/... yo'llarni API_BASE_URL bilan birlashtirish)
export const resolveMediaUrl = (url, fallbackType = 'audio', id = 0) => {
  if (!url) {
    if (fallbackType === 'cover') {
      const idx = Math.abs(Number(id) || 0) % DEFAULT_COVERS.length;
      return DEFAULT_COVERS[idx];
    }
    return '';
  }

  // Agar to'liq URL bo'lsa
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  // Nisbiy yo'l bo'lsa
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Qo'shiqlarni olish
export const fetchSongsApi = async () => {
  const response = await apiClient.get('/api/songs');
  return response.data;
};

// Janrlarni olish
export const fetchGenresApi = async () => {
  try {
    const response = await apiClient.get('/api/genres');
    return response.data;
  } catch (error) {
    console.warn("Janrlarni olishda xato:", error);
    return ['Pop', 'Lo-Fi', 'Electronic', 'Rock', 'Jazz', 'Ethno', 'Chill'];
  }
};

// Qo'shiqni tinglash sonini oshirish
export const playSongApi = async (songId) => {
  try {
    const response = await apiClient.post(`/api/songs/${songId}/play`);
    return response.data;
  } catch (error) {
    console.warn("Play api xatoligi:", error?.message);
    return null;
  }
};

// Like bosish
export const toggleLikeApi = async (songId) => {
  const response = await apiClient.post(`/api/songs/${songId}/like`);
  return response.data;
};

// Yangi qo'shiq qo'shish (Backendga yuborish)
export const addSongApi = async (songData) => {
  const formData = new FormData();
  formData.append('title', songData.title);
  formData.append('artist', songData.artist);
  formData.append('genre', songData.genre || 'Pop');
  
  if (songData.audio_url) {
    formData.append('audio_url', songData.audio_url);
  }
  if (songData.cover_url) {
    formData.append('cover_url', songData.cover_url);
  }
  if (songData.audioFile) {
    formData.append('audio', songData.audioFile);
  }
  if (songData.coverFile) {
    formData.append('cover', songData.coverFile);
  }

  const response = await apiClient.post('/api/admin/songs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default apiClient;
