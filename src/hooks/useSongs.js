import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchSongsApi, fetchGenresApi, toggleLikeApi, addSongApi } from '../services/api';

const LIKED_STORAGE_KEY = 'music_app_liked_ids_v1';
const LOCAL_SONGS_KEY = 'music_app_custom_songs_v1';

export const useSongs = () => {
  const [backendSongs, setBackendSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Qidiruv va filtrlar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);

  // LocalStorage dan saqlangan likelarni olish
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage dan foydalanuvchi qo'shgan maxsus qo'shiqlarni olish
  const [customSongs, setCustomSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SONGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Backenddan qo'shiqlarni yuklab olish funksiyasi
  const loadSongs = useCallback(async (isReload = false) => {
    if (isReload) {
      setLoading(true);
    }
    setError(null);
    try {
      const [fetchedSongs, fetchedGenres] = await Promise.all([
        fetchSongsApi().catch((err) => {
          console.warn("Backenddan qo'shiqlar olinmadi:", err);
          return [];
        }),
        fetchGenresApi().catch(() => []),
      ]);

      setBackendSongs(fetchedSongs);

      // Janrlar ro'yxatini shakllantirish
      const allGenres = new Set(fetchedGenres);
      fetchedSongs.forEach((s) => {
        if (s.genre) allGenres.add(s.genre);
      });
      setGenres(['All', ...Array.from(allGenres)]);
    } catch (err) {
      console.error("Qo'shiqlarni yuklashda xatolik:", err);
      setError("Qo'shiqlarni yuklab bo'lmadi. Internet aloqasini tekshiring.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Faqat dastur yuklanganda 1 marta chaqiriladi
  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetchSongsApi().catch((err) => {
        console.warn("Backenddan qo'shiqlar olinmadi:", err);
        return [];
      }),
      fetchGenresApi().catch(() => []),
    ])
      .then(([fetchedSongs, fetchedGenres]) => {
        if (!ignore) {
          setBackendSongs(fetchedSongs);

          const allGenres = new Set(fetchedGenres);
          fetchedSongs.forEach((s) => {
            if (s.genre) allGenres.add(s.genre);
          });
          setGenres(['All', ...Array.from(allGenres)]);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Qo'shiqlarni yuklashda xatolik:", err);
          setError("Qo'shiqlarni yuklab bo'lmadi. Internet aloqasini tekshiring.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // LikedIds o'zgarganda localStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedIds));
    } catch (e) {
      console.warn("Likelarni saqlashda xato:", e);
    }
  }, [likedIds]);

  // CustomSongs o'zgarganda localStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_SONGS_KEY, JSON.stringify(customSongs));
    } catch (e) {
      console.warn("Maxsus qo'shiqlarni saqlashda xato:", e);
    }
  }, [customSongs]);

  // Backend va custom qo'shiqlarni birlashtirib, like holatini hisoblash
  const songs = useMemo(() => {
    const combined = [...customSongs, ...backendSongs];
    const uniqueMap = new Map();

    combined.forEach((s) => {
      if (!uniqueMap.has(s.id)) {
        const isLiked = likedIds.includes(s.id) || !!s.liked;
        const baseLikes = Number(s.likes) || 0;
        // Agar foydalanuvchi like bosgan bo'lsa, sonini hisobga olish
        const extraLike = likedIds.includes(s.id) && !s.liked ? 1 : 0;

        uniqueMap.set(s.id, {
          ...s,
          liked: isLiked,
          likes: baseLikes + extraLike,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }, [backendSongs, customSongs, likedIds]);

  // Like bosish / olib tashlash funksiyasi
  const toggleLike = useCallback(async (songId) => {
    setLikedIds((prev) => {
      const exists = prev.includes(songId);
      return exists ? prev.filter((id) => id !== songId) : [...prev, songId];
    });

    // Backend API ga yuborish
    try {
      await toggleLikeApi(songId);
    } catch (err) {
      console.info("Like backendga yuborildi (lokal saqlandi):", err?.response?.data || err.message);
    }
  }, []);

  // Yangi qo'shiq qo'shish funksiyasi
  const addSong = useCallback(async (newSongData) => {
    let createdSong = null;

    // 1. Backendga yuborishga urinish
    try {
      const res = await addSongApi(newSongData);
      if (res && res.id) {
        createdSong = res;
      }
    } catch (backendErr) {
      console.warn("Backendga qo'shiq yuklanmadi (lokal saqlanadi):", backendErr?.message);
    }

    // 2. Lokal nusxa yaratish (agar backend login talab qilsa)
    if (!createdSong) {
      createdSong = {
        id: `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        title: newSongData.title,
        artist: newSongData.artist,
        genre: newSongData.genre || 'Pop',
        audio_url: newSongData.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_url: newSongData.cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
        plays: 0,
        likes: 0,
        liked: false,
        created_at: new Date().toISOString(),
        isLocal: true,
      };
    }

    // Janrlar ro'yxatini yangilash
    if (newSongData.genre) {
      setGenres((prev) => (prev.includes(newSongData.genre) ? prev : [...prev, newSongData.genre]));
    }

    // Saqlash
    setCustomSongs((prev) => [createdSong, ...prev]);

    return createdSong;
  }, []);

  // Filtrlangan qo'shiqlar ro'yxati
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      // Qidiruv
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = song.title?.toLowerCase().includes(query);
        const matchArtist = song.artist?.toLowerCase().includes(query);
        const matchGenre = song.genre?.toLowerCase().includes(query);
        if (!matchTitle && !matchArtist && !matchGenre) return false;
      }

      // Janr
      if (selectedGenre !== 'All') {
        if (song.genre?.toLowerCase() !== selectedGenre.toLowerCase()) return false;
      }

      // Faqat yoqtirilganlar
      if (showOnlyLiked) {
        if (!song.liked && !likedIds.includes(song.id)) return false;
      }

      return true;
    });
  }, [songs, searchQuery, selectedGenre, showOnlyLiked, likedIds]);

  return {
    songs,
    filteredSongs,
    genres,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    showOnlyLiked,
    setShowOnlyLiked,
    likedCount: likedIds.length,
    toggleLike,
    addSong,
    reloadSongs: () => loadSongs(true),
  };
};

export default useSongs;
