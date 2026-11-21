import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  logActivity,
  getStoredRequests,
  saveAccessRequest,
  getCustomUsers,
  saveCustomUser,
  sendCredentialsEmail,
  getStoredActivities,
  getStoredEmails,
} from '../services/activityService';

const AuthContext = createContext(null);

const STORAGE_AUTH_KEY = 'music_app_auth_user_v2';

// Standart belgilangan akkauntlar
export const VALID_CREDENTIALS = [
  {
    username: 'Humoyun',
    password: 'Humoyun12',
    role: 'admin',
    name: 'Humoyun Biymirzayev',
    displayName: 'biymirzayev.012',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    title: 'Bosh Administrator',
    bio: '🎵 Musiqa olami admini • HB Music Pro • (@moxirvich_7)2',
    followers: 94,
    following: 44,
    postsCount: 12,
    highlights: [
      { id: 'hl-1', title: 'Futbol', emoji: '⚽' },
      { id: 'hl-2', title: '543', emoji: '🔥' },
      { id: 'hl-3', title: 'Sertifikat', emoji: '🎓' },
    ],
  },
  {
    username: 'Muhammad',
    password: 'Muhammad02',
    role: 'user',
    name: 'Muhammad',
    displayName: 'muhammad_02',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    title: 'Foydalanuvchi',
    bio: 'Sevgan musiqalarimni tinglayman 🎧 • HB Music a\'zosi',
    followers: 120,
    following: 75,
    postsCount: 4,
    highlights: [
      { id: 'hl-1', title: 'Top Hits', emoji: '🎧' },
      { id: 'hl-2', title: 'Mening playlistim', emoji: '✨' },
    ],
  },
  {
    username: 'biymirzayev.012',
    password: 'hbMusic2026!',
    role: 'user',
    name: 'Humoyun',
    displayName: 'biymirzayev.012',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    title: 'Foydalanuvchi',
    bio: '(@moxirvich_7)2 • Instagram-style profile',
    followers: 94,
    following: 44,
    postsCount: 0,
    highlights: [
      { id: 'hl-1', title: 'Futbol', emoji: '⚽' },
      { id: 'hl-2', title: '543', emoji: '🔥' },
      { id: 'hl-3', title: 'sertifikat', emoji: '🎓' },
    ],
  },
];

export const AuthProvider = ({ children }) => {
  const [customUsers, setCustomUsers] = useState(() => getCustomUsers());
  const [requests, setRequests] = useState(() => getStoredRequests());
  const [activities, setActivities] = useState(() => getStoredActivities());
  const [emails, setEmails] = useState(() => getStoredEmails());

  // Hozirgi kirgan foydalanuvchi (birinchi marta kirganda login sahifasi chiqishi kerak)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Auth ma'lumotlarini o'qishda xatolik:", e);
    }
    return null; // Foydalanuvchi birinchi bo'lib login/parol kiritishi kerak!
  });

  // Hodisalarni tinglash (jonli yangilanish uchun)
  useEffect(() => {
    const handleActUpdate = () => setActivities(getStoredActivities());
    const handleReqUpdate = () => setRequests(getStoredRequests());
    const handleEmailUpdate = () => setEmails(getStoredEmails());
    const handleUsersUpdate = () => setCustomUsers(getCustomUsers());

    window.addEventListener('music_app_activity_update', handleActUpdate);
    window.addEventListener('music_app_requests_update', handleReqUpdate);
    window.addEventListener('music_app_emails_update', handleEmailUpdate);
    window.addEventListener('music_app_users_update', handleUsersUpdate);

    return () => {
      window.removeEventListener('music_app_activity_update', handleActUpdate);
      window.removeEventListener('music_app_requests_update', handleReqUpdate);
      window.removeEventListener('music_app_emails_update', handleEmailUpdate);
      window.removeEventListener('music_app_users_update', handleUsersUpdate);
    };
  }, []);

  // LocalStorage ga sinxronizatsiya
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    } catch (e) {
      console.warn("Auth saqlashda xatolik:", e);
    }
  }, [currentUser]);

  // Barcha hisoblar ro'yxati (standart + admin tasdiqlagan yangi foydalanuvchilar)
  const allAccounts = [...VALID_CREDENTIALS, ...customUsers];

  // Login funksiyasi
  const login = useCallback(
    (inputUsername, inputPassword) => {
      const trimmedUser = (inputUsername || '').trim();
      const trimmedPass = (inputPassword || '').trim();

      const matched = allAccounts.find(
        (acc) =>
          acc.username.toLowerCase() === trimmedUser.toLowerCase() &&
          acc.password === trimmedPass
      );

      if (matched) {
        const userPayload = {
          ...matched,
          loginTime: new Date().toISOString(),
        };
        setCurrentUser(userPayload);
        logActivity('LOGIN', userPayload, `Tizimga kirdi (${userPayload.role === 'admin' ? 'Admin' : 'Foydalanuvchi'})`);
        return { success: true, user: userPayload };
      }

      return {
        success: false,
        message: "Login yoki parol noto'g'ri! Agar birinchi marta kirayotgan bo'lsangiz, so'rov qoldiring.",
      };
    },
    [allAccounts]
  );

  // Yangi hisob ro'yxatdan o'tkazish
  const registerUser = useCallback(
    (userData) => {
      const trimmedUser = (userData.username || '').trim();
      const trimmedPass = (userData.password || '').trim();
      const name = (userData.name || trimmedUser).trim();

      if (!trimmedUser || !trimmedPass) {
        return { success: false, message: "Iltimos, login va parolni to'liq kiriting!" };
      }

      const existing = allAccounts.find(
        (a) => a.username.toLowerCase() === trimmedUser.toLowerCase()
      );
      if (existing) {
        return { success: false, message: "Bu login band! Iltimos, boshqa login tanlang." };
      }

      const newUser = {
        username: trimmedUser,
        password: trimmedPass,
        role: 'user',
        name: name,
        displayName: trimmedUser,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        title: 'Foydalanuvchi',
        bio: "Musiqa ixlosmandi • HB Music a'zosi",
        followers: 0,
        following: 0,
        postsCount: 0,
      };

      saveCustomUser(newUser);
      setCustomUsers(getCustomUsers());
      const userPayload = { ...newUser, loginTime: new Date().toISOString() };
      setCurrentUser(userPayload);
      logActivity('REGISTER', userPayload, `Yangi ro'yxatdan o'tdi: ${trimmedUser}`);
      return { success: true, user: userPayload };
    },
    [allAccounts]
  );

  // Logout funksiyasi
  const logout = useCallback(() => {
    if (currentUser) {
      logActivity('LOGOUT', currentUser, "Tizimdan chiqdi");
    }
    setCurrentUser(null);
  }, [currentUser]);

  // Profilni yangilash (u yerga ozi hohlagan rasimni qoysin, bioni o'zgartirsin va h.k.)
  const updateUserProfile = useCallback(
    (updates) => {
      if (!currentUser) return;

      const updated = {
        ...currentUser,
        ...updates,
      };

      setCurrentUser(updated);

      // Agar custom foydalanuvchi bo'lsa uni ham yangilaymiz
      saveCustomUser(updated);

      // Admin monitoringiga qayd qilish:
      if (updates.avatar && updates.avatar !== currentUser.avatar) {
        logActivity('PROFILE_PHOTO', updated, `Profiliga yangi rasm o'rnatdi`);
      }
      if (updates.bio !== undefined && updates.bio !== currentUser.bio) {
        logActivity('PROFILE_EDIT', updated, `Bio ma'lumotini o'zgartirdi: "${updates.bio.slice(0, 30)}..."`);
      }
      if (updates.name !== undefined && updates.name !== currentUser.name) {
        logActivity('PROFILE_EDIT', updated, `Ismini "${updates.name}" ga o'zgartirdi`);
      }
      if (updates.highlights) {
        logActivity('PROFILE_STORY', updated, `Profil Stories (Highlights) larni yangiladi`);
      }
    },
    [currentUser]
  );

  // Yangi foydalanuvchi ariza yuborishi
  const requestAccess = useCallback((formData) => {
    const newReq = saveAccessRequest(formData);
    setRequests(getStoredRequests());
    return newReq;
  }, []);

  // Admin yangi foydalanuvchiga Login va Parol berishi
  const approveRequest = useCallback(
    (requestId, loginVal, passVal) => {
      const allReqs = getStoredRequests();
      const targetReq = allReqs.find((r) => r.id === requestId);
      if (!targetReq) return { success: false, message: 'Ariza topilmadi' };

      const assignedLogin = (loginVal || `${targetReq.firstName.toLowerCase()}_${targetReq.birthYear}`).trim();
      const assignedPassword = (passVal || `hb${Math.floor(1000 + Math.random() * 9000)}!`).trim();

      // 1. Yangi foydalanuvchi obyektini yaratish
      const newUser = {
        username: assignedLogin,
        password: assignedPassword,
        role: 'user',
        name: `${targetReq.firstName} ${targetReq.lastName}`,
        displayName: assignedLogin,
        email: targetReq.email,
        birthYear: targetReq.birthYear,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        title: 'Foydalanuvchi',
        bio: 'Musiqa tinglovchisi • Yangi qo\'shildi',
        followers: 1,
        following: 10,
        postsCount: 0,
        highlights: [{ id: 'hl-1', title: 'Musiqa', emoji: '🎵' }],
      };

      saveCustomUser(newUser);

      // 2. Arizani tasdiqlangan deb belgilash
      const updatedReqs = allReqs.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              assignedLogin,
              assignedPassword,
              approvedAt: new Date().toISOString(),
            }
          : r
      );
      localStorage.setItem('music_app_access_requests_v3', JSON.stringify(updatedReqs));
      setRequests(updatedReqs);

      // 3. Emailga login va parol xatini yuborish
      const sentEmail = sendCredentialsEmail({
        to: targetReq.email,
        firstName: targetReq.firstName,
        lastName: targetReq.lastName,
        login: assignedLogin,
        password: assignedPassword,
      });

      // 4. Monitoringga yozish
      logActivity(
        'ADMIN_APPROVED',
        'Humoyun (Admin)',
        `${targetReq.firstName} ${targetReq.lastName} uchun login: "${assignedLogin}" berildi va ${targetReq.email} ga email yuborildi`,
        'admin'
      );

      return { success: true, user: newUser, email: sentEmail };
    },
    []
  );

  // Qidiruv harakatini monitoringga yozish
  const trackSearch = useCallback(
    (query) => {
      if (!query || query.trim().length < 2) return;
      logActivity('SEARCH', currentUser || 'Mehmon', `"${query.trim()}" so'zini qidirdi`);
    },
    [currentUser]
  );

  // Musiqa tinglash harakatini monitoringga yozish
  const trackPlay = useCallback(
    (song) => {
      if (!song) return;
      logActivity('PLAY', currentUser || 'Mehmon', `"${song.title} - ${song.artist}" musiqasini tingladi`);
    },
    [currentUser]
  );

  // Like bosish harakatini monitoringga yozish
  const trackLike = useCallback(
    (song, isLiked) => {
      if (!song) return;
      logActivity('LIKE', currentUser || 'Mehmon', `"${song.title}" qo'shig'iga ${isLiked ? 'like qo\'ydi' : 'likeni bekor qildi'}`);
    },
    [currentUser]
  );

  const isAdmin = currentUser?.role === 'admin';
  const isUser = currentUser?.role === 'user';
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        registerUser,
        isAdmin,
        isUser,
        isLoggedIn,
        validAccounts: allAccounts,
        updateUserProfile,
        requests,
        requestAccess,
        approveRequest,
        activities,
        emails,
        trackSearch,
        trackPlay,
        trackLike,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
