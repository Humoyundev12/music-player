// Foydalanuvchilar fikrlari, takliflari va admin javoblari servisi
// LocalStorage da xavfsiz va doimiy saqlanadi

const FEEDBACK_STORAGE_KEY = 'hb_music_feedback_list_v2';
const SONG_REQUESTS_KEY = 'hb_music_song_requests_v2';
const SAVED_SONGS_KEY = 'hb_music_saved_song_ids_v2';

// Dastlabki namunaviy fikrlar va admin javoblari
const INITIAL_FEEDBACKS = [
  {
    id: 'fb-1',
    userId: 'Muhammad',
    userName: 'Muhammad',
    subject: "Konsta yangi treklarini qo'shish",
    message: "Assalomu alaykum Humoyun aka, iltimos Konsta va Shokirning eng yangi duet treklarini ham qo'shsangiz ajoyib bo'lardi. Sayt juda zo'r ishlayapti!",
    createdAt: '2026-11-20T10:15:00.000Z',
    status: 'replied', // 'pending' | 'replied'
    adminReply: "Vaalaykum assalom Muhammad! Taklifingiz uchun rahmat, Konsta va Shokirning yangi xit taronalari to'plamga kiritildi. Yoqimli tinglash tilayman!",
    repliedAt: '2026-11-20T11:40:00.000Z',
  },
  {
    id: 'fb-2',
    userId: 'biymirzayev.012',
    userName: 'Humoyun',
    subject: "Audio sifatini oshirish",
    message: "Saytdagi treklarni yuqori 320kbps formatda yuklash imkoniyatini ham tekshirib ko'rsak yaxshi bo'lardi.",
    createdAt: '2026-11-19T14:20:00.000Z',
    status: 'replied',
    adminReply: "Tizim optimizatsiyasi amalga oshirildi, barcha audio oqimlar yuqori sifatli HD audioda uzatilmoqda.",
    repliedAt: '2026-11-19T15:00:00.000Z',
  }
];

// Dastlabki namunaviy "Qaysi musiqani qo'shishimizni xohlaysiz" izohlari
const INITIAL_SONG_REQUESTS = [
  {
    id: 'req-1',
    userName: 'Sanjarbek',
    songTitle: 'Yurak',
    artist: 'Rayhon ft. Xamdam Sobirov',
    comment: "Shu qo'shiqni qo'shib beringlar, juda trendda ketyapti!",
    votes: 18,
    votedBy: ['user-1'],
    status: 'completed', // 'pending' | 'in_progress' | 'completed'
    adminNote: "Qo'shildi! Asosiy ro'yxatda tinglashingiz mumkin.",
    createdAt: '2026-11-20T08:30:00.000Z',
  },
  {
    id: 'req-2',
    userName: 'Madina',
    songTitle: 'Mockingbird',
    artist: 'Eminem',
    comment: "O'zbekcha tarjimasi bilan bo'lsa ajoyib bo'lardi, ma'nosi juda ta'sirli.",
    votes: 24,
    votedBy: ['user-2'],
    status: 'completed',
    adminNote: "O'zbekcha qatorma-qator tarjimasi bilan qo'shildi!",
    createdAt: '2026-11-20T09:45:00.000Z',
  },
  {
    id: 'req-3',
    userName: 'Azizbek',
    songTitle: 'Minor',
    artist: 'Miyagi & Andy Panda',
    comment: "Miyagining eng zo'r treki, saytga qo'shishingizni iltimos qilamiz.",
    votes: 31,
    votedBy: ['user-3'],
    status: 'completed',
    adminNote: "Muvaffaqiyatli qo'shildi va ro'yxatda mavjud.",
    createdAt: '2026-11-21T06:10:00.000Z',
  },
];

// 1. Fikrlar (Feedbacks) olish
export const getFeedbacks = () => {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Feedbacklarni o'qishda xatolik:", e);
  }
  return INITIAL_FEEDBACKS;
};

// 2. Yangi fikr / taklif yuborish
export const sendFeedback = ({ userId, userName, subject, message }) => {
  const current = getFeedbacks();
  const newFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: userId || 'Mehmon',
    userName: userName || 'Foydalanuvchi',
    subject: subject?.trim() || "Fikr va Taklif",
    message: message?.trim() || "",
    createdAt: new Date().toISOString(),
    status: 'pending',
    adminReply: null,
    repliedAt: null,
  };

  const updated = [newFeedback, ...current];
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_feedback_updated'));
  } catch (e) {
    console.error("Feedback saqlashda xatolik:", e);
  }
  return newFeedback;
};

// 3. Adminga fikrga javob qaytarish
export const replyToFeedback = (feedbackId, adminReply) => {
  const current = getFeedbacks();
  const updated = current.map((fb) => {
    if (fb.id === feedbackId) {
      return {
        ...fb,
        status: 'replied',
        adminReply: adminReply.trim(),
        repliedAt: new Date().toISOString(),
      };
    }
    return fb;
  });

  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_feedback_updated'));
  } catch (e) {
    console.error("Admin javobini saqlashda xato:", e);
  }
  return true;
};

// 4. "Qaysi musiqani qo'shishimizni xohlaysiz" izohlarini olish
export const getSongRequests = () => {
  try {
    const raw = localStorage.getItem(SONG_REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Musiqa so'rovlarini o'qishda xatolik:", e);
  }
  return INITIAL_SONG_REQUESTS;
};

// 5. Yangi musiqa taklif izohi qoldirish
export const addSongRequest = ({ userName, songTitle, artist, comment }) => {
  const current = getSongRequests();
  const newReq = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userName: userName || 'Foydalanuvchi',
    songTitle: songTitle?.trim() || "Musiqa nomi",
    artist: artist?.trim() || "Ijrochi",
    comment: comment?.trim() || "",
    votes: 1,
    votedBy: [userName],
    status: 'pending', // 'pending' | 'in_progress' | 'completed'
    adminNote: null,
    createdAt: new Date().toISOString(),
  };

  const updated = [newReq, ...current];
  try {
    localStorage.setItem(SONG_REQUESTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_song_requests_updated'));
  } catch (e) {
    console.error("Musiqa so'rovini saqlashda xatolik:", e);
  }
  return newReq;
};

// 6. Taklifga ovoz berish (Upvote)
export const toggleVoteSongRequest = (requestId, userName) => {
  const current = getSongRequests();
  const updated = current.map((item) => {
    if (item.id === requestId) {
      const voters = item.votedBy || [];
      const hasVoted = voters.includes(userName);
      const newVoters = hasVoted
        ? voters.filter((u) => u !== userName)
        : [...voters, userName];
      return {
        ...item,
        votes: Math.max(0, (item.votes || 0) + (hasVoted ? -1 : 1)),
        votedBy: newVoters,
      };
    }
    return item;
  });

  try {
    localStorage.setItem(SONG_REQUESTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_song_requests_updated'));
  } catch (e) {
    console.error("Ovoz berishda xato:", e);
  }
};

// 7. Admin musiqa taklifiga status yoki javob berish
export const updateSongRequestStatus = (requestId, status, adminNote) => {
  const current = getSongRequests();
  const updated = current.map((item) => {
    if (item.id === requestId) {
      return {
        ...item,
        status: status || item.status,
        adminNote: adminNote !== undefined ? adminNote : item.adminNote,
      };
    }
    return item;
  });

  try {
    localStorage.setItem(SONG_REQUESTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_song_requests_updated'));
  } catch (e) {
    console.error("Musiqa taklifini yangilashda xato:", e);
  }
};

// 8. Saqlangan musiqalar (Saved tracks in Library)
export const getSavedSongIds = () => {
  try {
    const raw = localStorage.getItem(SAVED_SONGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Saqlanganlarni o'qishda xatolik:", e);
  }
  return [];
};

export const toggleSaveSongId = (songId) => {
  const current = getSavedSongIds();
  const idStr = String(songId);
  const exists = current.includes(idStr);
  const updated = exists ? current.filter((id) => id !== idStr) : [...current, idStr];

  try {
    localStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_saved_songs_updated'));
  } catch (e) {
    console.error("Saqlashda xato:", e);
  }
  return !exists;
};
