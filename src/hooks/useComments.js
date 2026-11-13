import { useState, useEffect, useCallback } from 'react';

// Boshlang'ich namunaviy fikrlar (izohlar)
const INITIAL_COMMENTS = {
  1: [
    {
      id: 'c1-1',
      author: 'Jasur',
      text: "Ajoyib trek! Tungi Toshkent ko'chalarida eshitishga juda mos 🔥",
      createdAt: '2026-11-10T14:20:00Z',
    },
    {
      id: 'c1-2',
      author: 'Madina',
      text: "Bitlari judayam maroqli, kayfiyatni ko'taradi 🎧",
      createdAt: '2026-11-11T09:15:00Z',
    }
  ],
  12: [
    {
      id: 'c12-1',
      author: 'Doston',
      text: "Yomg'irli kunda choy bilan eshitadigan ajoyib sokin Lo-Fi ☕🌧️",
      createdAt: '2026-11-11T18:40:00Z',
    }
  ],
  2: [
    {
      id: 'c2-1',
      author: 'Sherzod',
      text: "Milliy va zamonaviy ohanglar uyg'unligi zo'r chiqibdi 👏",
      createdAt: '2026-11-09T12:00:00Z',
    }
  ]
};

const STORAGE_KEY = 'music_app_comments_v1';

export const useComments = () => {
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Fikrlarni o'qishda xatolik:", e);
    }
    return INITIAL_COMMENTS;
  });

  // LocalStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(commentsMap));
    } catch (e) {
      console.warn("Fikrlarni saqlashda xatolik:", e);
    }
  }, [commentsMap]);

  // Muayyan qo'shiq uchun izohlarni olish
  const getSongComments = useCallback((songId) => {
    if (!songId) return [];
    return commentsMap[songId] || [];
  }, [commentsMap]);

  // Izohlar sonini olish
  const getCommentCount = useCallback((songId) => {
    if (!songId) return 0;
    return (commentsMap[songId] || []).length;
  }, [commentsMap]);

  // Yangi izoh qo'shish
  const addComment = useCallback((songId, { author, text }) => {
    if (!songId || !text?.trim()) return null;

    const newComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: author?.trim() || "Foydalanuvchi",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setCommentsMap(prev => {
      const existing = prev[songId] || [];
      return {
        ...prev,
        [songId]: [newComment, ...existing],
      };
    });

    return newComment;
  }, []);

  return {
    commentsMap,
    getSongComments,
    getCommentCount,
    addComment,
  };
};

export default useComments;
