import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchSongsApi, fetchGenresApi, toggleLikeApi, addSongApi } from '../services/api';
import { INITIAL_SONGS_COLLECTION } from '../data/songsData';
import { saveMediaToDB, getMediaFromDB, deleteMediaFromDB } from '../services/audioStorage';

const LIKED_STORAGE_KEY = 'music_app_liked_ids_v3';
const LOCAL_SONGS_KEY = 'music_app_custom_songs_v3';
const DELETED_SONGS_KEY = 'music_app_deleted_ids_v3';

export const useSongs = () => {
  const [backendSongs, setBackendSongs] = useState([]);
  const [genres, setGenres] = useState(['All', 'Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Lo-Fi', 'Ethno', 'Chill', 'Folk']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Qidiruv va filtrlar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);
  const [showOnlyTrending, setShowOnlyTrending] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // O'chirilgan qo'shiqlar ID ro'yxati (Admin o'chirganida)
  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(DELETED_SONGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage dan saqlangan likelarni olish
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['ru-1', 'ru-2', 'en-1', 'uz-1'];
    } catch {
      return ['ru-1', 'ru-2'];
    }
  });

  // LocalStorage dan Admin qo'shgan maxsus qo'shiqlarni olish
  const [customSongs, setCustomSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SONGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local fayllar (IndexedDB) dan audio va cover bloblarini qayta tiklash
  useEffect(() => {
    let active = true;
    const restoreBlobs = async () => {
      const updated = await Promise.all(
        customSongs.map(async (song) => {
          let audioUrl = song.audio_url;
          let coverUrl = song.cover_url;

          if (song.hasLocalAudio) {
            const audioBlob = await getMediaFromDB(`audio_${song.id}`);
            if (audioBlob) {
              audioUrl = URL.createObjectURL(audioBlob);
            }
          }

          if (song.hasLocalCover) {
            const coverBlob = await getMediaFromDB(`cover_${song.id}`);
            if (coverBlob) {
              coverUrl = URL.createObjectURL(coverBlob);
            }
          }

          return { ...song, audio_url: audioUrl, cover_url: coverUrl };
        })
      );

      if (active) {
        // Faqat o'zgargan bo'lsa yangilaymiz
        setCustomSongs((prev) => {
          let hasChange = false;
          const merged = prev.map((s) => {
            const match = updated.find((u) => u.id === s.id);
            if (match && (match.audio_url !== s.audio_url || match.cover_url !== s.cover_url)) {
              hasChange = true;
              return match;
            }
            return s;
          });
          return hasChange ? merged : prev;
        });
      }
    };

    if (customSongs.some((s) => s.hasLocalAudio || s.hasLocalCover)) {
      restoreBlobs();
    }

    return () => {
      active = false;
    };
  }, []);

  // Backenddan qo'shiqlarni yuklash
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

      const allGenres = new Set(['All', 'Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Lo-Fi', 'Ethno', 'Chill', 'Folk', ...fetchedGenres]);
      fetchedSongs.forEach((s) => {
        if (s.genre) allGenres.add(s.genre);
      });
      INITIAL_SONGS_COLLECTION.forEach((s) => {
        if (s.genre) allGenres.add(s.genre);
      });
      setGenres(Array.from(allGenres));
    } catch (err) {
      console.error("Qo'shiqlarni yuklashda xatolik:", err);
      setError("Qo'shiqlarni yuklab bo'lmadi. Internet aloqasini tekshiring.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSongs(false);
  }, [loadSongs]);

  // LikedIds saqlash
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedIds));
    } catch (e) {
      console.warn("Likelarni saqlashda xato:", e);
    }
  }, [likedIds]);

  // CustomSongs saqlash (Blob URL lardan tashqari serializable ma'lumotlar saqlanadi)
  useEffect(() => {
    try {
      const serializableSongs = customSongs.map((s) => {
        // Blob URL lar sahifa yangilanganda yangilanadi
        return {
          ...s,
          audio_url: s.hasLocalAudio ? '' : s.audio_url,
          cover_url: s.hasLocalCover ? '' : s.cover_url,
        };
      });
      localStorage.setItem(LOCAL_SONGS_KEY, JSON.stringify(serializableSongs));
    } catch (e) {
      console.warn("Maxsus qo'shiqlarni saqlashda xato:", e);
    }
  }, [customSongs]);

  // DeletedIds saqlash
  useEffect(() => {
    try {
      localStorage.setItem(DELETED_SONGS_KEY, JSON.stringify(deletedIds));
    } catch (e) {
      console.warn("O'chirilganlarni saqlashda xato:", e);
    }
  }, [deletedIds]);

  // Birlashtirish
  const songs = useMemo(() => {
    const combined = [...customSongs, ...INITIAL_SONGS_COLLECTION, ...backendSongs];
    const uniqueMap = new Map();

    combined.forEach((s) => {
      if (deletedIds.includes(String(s.id))) {
        return;
      }

      if (!uniqueMap.has(String(s.id))) {
        const isLiked = likedIds.includes(s.id) || likedIds.includes(String(s.id)) || !!s.liked;
        const baseLikes = Number(s.likes) || 0;
        const extraLike = (likedIds.includes(s.id) || likedIds.includes(String(s.id))) && !s.liked ? 1 : 0;

        uniqueMap.set(String(s.id), {
          ...s,
          liked: isLiked,
          likes: baseLikes + extraLike,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }, [backendSongs, customSongs, likedIds, deletedIds]);

  // Like bosish
  const toggleLike = useCallback(async (songId) => {
    setLikedIds((prev) => {
      const exists = prev.includes(songId) || prev.includes(String(songId));
      if (exists) {
        return prev.filter((id) => id !== songId && id !== String(songId));
      } else {
        return [...prev, songId];
      }
    });

    if (typeof songId === 'number' || (!isNaN(songId) && !String(songId).includes('-') && !String(songId).includes('local_'))) {
      try {
        await toggleLikeApi(songId);
      } catch (err) {
        console.info("Like lokal saqlandi:", err?.message);
      }
    }
  }, []);

  // Yangi qo'shiq qo'shish (Faqat admin uchun - URL, Fayl yoki Ovoz yozuvi orqali)
  const addSong = useCallback(async (newSongData) => {
    const songId = `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let finalAudioUrl = newSongData.audio_url || '';
    let finalCoverUrl = newSongData.cover_url || '';
    let hasLocalAudio = false;
    let hasLocalCover = false;

    // 1. Agar foydalanuvchi Audio fayl yuklagan bo'lsa
    if (newSongData.audioFile) {
      try {
        await saveMediaToDB(`audio_${songId}`, newSongData.audioFile);
        finalAudioUrl = URL.createObjectURL(newSongData.audioFile);
        hasLocalAudio = true;
      } catch (e) {
        console.warn("Audio faylni saqlashda xato:", e);
      }
    }

    // 2. Agar foydalanuvchi Cover rasm fayl yuklagan bo'lsa
    if (newSongData.coverFile) {
      try {
        await saveMediaToDB(`cover_${songId}`, newSongData.coverFile);
        finalCoverUrl = URL.createObjectURL(newSongData.coverFile);
        hasLocalCover = true;
      } catch (e) {
        console.warn("Cover faylni saqlashda xato:", e);
      }
    }

    // Backendga yuborishga urinish
    let createdSong = null;
    try {
      const res = await addSongApi({
        ...newSongData,
        audio_url: finalAudioUrl,
        cover_url: finalCoverUrl,
      });
      if (res && res.id) {
        createdSong = {
          ...res,
          language: newSongData.language || 'uz',
          hasTranslation: !!newSongData.hasTranslation,
          lyrics: newSongData.lyrics || [],
          summary: newSongData.summary || '',
          hasLocalAudio,
          hasLocalCover,
          audio_url: finalAudioUrl,
          cover_url: finalCoverUrl,
        };
      }
    } catch (backendErr) {
      console.warn("Backendga qo'shiq yuklanmadi (lokal saqlanadi):", backendErr?.message);
    }

    if (!createdSong) {
      createdSong = {
        id: songId,
        title: newSongData.title,
        artist: newSongData.artist,
        genre: newSongData.genre || 'Pop',
        language: newSongData.language || 'uz',
        hasTranslation: !!newSongData.hasTranslation,
        lyrics: newSongData.lyrics || [],
        summary: newSongData.summary || '',
        audio_url: finalAudioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_url: finalCoverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
        hasLocalAudio,
        hasLocalCover,
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

  // Admin qo'shiqni o'chirishi
  const deleteSong = useCallback(async (songId) => {
    const idStr = String(songId);
    setDeletedIds((prev) => [...prev, idStr]);
    setCustomSongs((prev) => prev.filter((s) => String(s.id) !== idStr));

    // IndexedDB dan ham o'chirish
    await deleteMediaFromDB(`audio_${idStr}`);
    await deleteMediaFromDB(`cover_${idStr}`);
  }, []);

  // Filtrlangan qo'shiqlar ro'yxati
  const filteredSongs = useMemo(() => {
    let list = songs.filter((song) => {
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

      // Til filtri
      if (selectedLanguage !== 'All') {
        if (selectedLanguage === 'hasTranslation') {
          if (!song.hasTranslation) return false;
        } else if (song.language !== selectedLanguage) {
          return false;
        }
      }

      // Faqat yoqtirilganlar
      if (showOnlyLiked) {
        if (!song.liked && !likedIds.includes(song.id) && !likedIds.includes(String(song.id))) {
          return false;
        }
      }

      // Faqat trenddagi qo'shiqlar
      if (showOnlyTrending) {
        const isTrend = song.isTrending || Number(song.plays) >= 900 || Number(song.likes) >= 150;
        if (!isTrend) return false;
      }

      return true;
    });

    if (showOnlyTrending) {
      list = [...list].sort((a, b) => (Number(b.plays) || 0) - (Number(a.plays) || 0));
    }

    return list;
  }, [songs, searchQuery, selectedGenre, selectedLanguage, showOnlyLiked, showOnlyTrending, likedIds]);

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
    reloadSongs: () => loadSongs(true),
  };
};

export default useSongs;
