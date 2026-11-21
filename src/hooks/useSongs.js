import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_COVERS } from '../services/api';
import { INITIAL_SONGS_COLLECTION } from '../data/songsData';

const SONGS_LIBRARY_KEY = 'hb_music_songs_v5';
const LIKED_STORAGE_KEY = 'hb_music_liked_ids_v5';

export const useSongs = () => {
  // Eski qoldiqlarni tozalash (foydalanuvchi talabi: hamma qo'shiqni o'chirib yubor)
  useEffect(() => {
    try {
      localStorage.removeItem('music_app_custom_songs_v2');
      localStorage.removeItem('music_app_custom_songs_v3');
      localStorage.removeItem('music_app_deleted_ids_v2');
      localStorage.removeItem('music_app_deleted_ids_v3');
    } catch (e) {}
  }, []);

  const [genres, setGenres] = useState([
    'All',
    'Pop',
    'Rock',
    'Electronic',
    'Hip-Hop',
    'Lo-Fi',
    'Ethno',
    'Chill',
    'Folk',
    'Klassik',
  ]);

  // Qo'shiqlar ro'yxati (Barcha dastlabki qo'shiqlar o'chirildi, Admin o'zi yuklaydi)
  const [songsList, setSongsList] = useState(() => {
    try {
      const saved = localStorage.getItem(SONGS_LIBRARY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Musiqalarni o'qishda xatolik:", e);
    }
    return INITIAL_SONGS_COLLECTION; // [] (bo'sh)
  });

  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Qidiruv va filtrlar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);
  const [showOnlyTrending, setShowOnlyTrending] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Har bir o'zgarishda darhol LocalStorage ga saqlash (mobil telefondan kirganda ham saqlanib qoladi)
  const persistSongs = useCallback((updatedList) => {
    setSongsList(updatedList);
    try {
      localStorage.setItem(SONGS_LIBRARY_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new Event('hb_songs_library_updated'));
    } catch (e) {
      console.error("Musiqalarni saqlashda xato:", e);
    }
  }, []);

  // Liked IDs saqlash
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedIds));
    } catch (e) {}
  }, [likedIds]);

  // Jonli hodisalarni tinglash
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(SONGS_LIBRARY_KEY);
        if (saved) {
          setSongsList(JSON.parse(saved));
        }
      } catch (e) {}
    };
    window.addEventListener('hb_songs_library_updated', handleSync);
    return () => window.removeEventListener('hb_songs_library_updated', handleSync);
  }, []);

  // Janrlar ro'yxatini yangilash
  useEffect(() => {
    const all = new Set(['All', 'Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Lo-Fi', 'Ethno', 'Chill', 'Folk', 'Klassik']);
    songsList.forEach((s) => {
      if (s.genre) all.add(s.genre);
    });
    setGenres(Array.from(all));
  }, [songsList]);

  // Like bosish
  const toggleLike = useCallback(
    (songId) => {
      const idStr = String(songId);
      const isCurrentlyLiked = likedIds.includes(idStr);

      const nextLikedIds = isCurrentlyLiked
        ? likedIds.filter((id) => id !== idStr)
        : [...likedIds, idStr];
      setLikedIds(nextLikedIds);

      const updated = songsList.map((s) => {
        if (String(s.id) === idStr) {
          const currentLikes = Number(s.likes) || 0;
          return {
            ...s,
            liked: !isCurrentlyLiked,
            likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          };
        }
        return s;
      });

      persistSongs(updated);
    },
    [likedIds, songsList, persistSongs]
  );

  // Yangi musiqa qo'shish (Faqat Admin kiritadi, mobil yoki kompyuterdan to'liq saqlanadi)
  const addSong = useCallback(
    async (newSongData) => {
      const songId = `song_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const newSong = {
        id: songId,
        title: newSongData.title?.trim() || "Nomsiz tarona",
        artist: newSongData.artist?.trim() || "Noma'lum ijrochi",
        genre: newSongData.genre || 'Pop',
        language: newSongData.language || 'uz',
        hasTranslation: !!newSongData.hasTranslation,
        lyrics: newSongData.lyrics || [],
        summary: newSongData.summary?.trim() || '',
        audio_url: newSongData.audio_url || '',
        cover_url: newSongData.cover_url || DEFAULT_COVERS[0],
        plays: 0,
        likes: 0,
        liked: false,
        created_at: new Date().toISOString(),
      };

      const updated = [newSong, ...songsList];
      persistSongs(updated);
      return newSong;
    },
    [songsList, persistSongs]
  );

  // Qo'shiqni o'chirish (Admin o'chirsa, qayta tiklanmaydi, doimiy o'chadi)
  const deleteSong = useCallback(
    (songId) => {
      const idStr = String(songId);
      const updated = songsList.filter((s) => String(s.id) !== idStr);
      persistSongs(updated);
    },
    [songsList, persistSongs]
  );

  // Filtrlangan qo'shiqlar
  const filteredSongs = useMemo(() => {
    let list = songsList.map((s) => ({
      ...s,
      liked: likedIds.includes(String(s.id)) || !!s.liked,
    }));

    // Qidiruv
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.artist?.toLowerCase().includes(q) ||
          s.genre?.toLowerCase().includes(q)
      );
    }

    // Janr filtri
    if (selectedGenre !== 'All') {
      list = list.filter((s) => s.genre?.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Til filtri
    if (selectedLanguage !== 'All') {
      if (selectedLanguage === 'hasTranslation') {
        list = list.filter((s) => s.hasTranslation);
      } else {
        list = list.filter((s) => s.language === selectedLanguage);
      }
    }

    // Sevimlilar filtri
    if (showOnlyLiked) {
      list = list.filter((s) => s.liked);
    }

    // Trenddagilar filtri
    if (showOnlyTrending) {
      list = list.filter((s) => s.isTrending || Number(s.plays) >= 900 || Number(s.likes) >= 10);
      list.sort((a, b) => (Number(b.plays) || 0) - (Number(a.plays) || 0));
    }

    return list;
  }, [songsList, likedIds, searchQuery, selectedGenre, selectedLanguage, showOnlyLiked, showOnlyTrending]);

  return {
    songs: songsList,
    filteredSongs,
    genres,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedLanguage,
    setSelectedLanguage,
    showOnlyLiked,
    setShowOnlyLiked,
    showOnlyTrending,
    setShowOnlyTrending,
    likedCount: likedIds.length,
    toggleLike,
    addSong,
    deleteSong,
    reloadSongs: () => {},
  };
};

export default useSongs;
