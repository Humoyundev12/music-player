import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_AUTH_KEY = 'music_app_auth_user_v1';

// Belgilangan foydalanuvchilar va ularning huquqlari
export const VALID_CREDENTIALS = [
  {
    username: 'Muhammad',
    password: 'Muhammad02',
    role: 'user',
    name: 'Muhammad',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Foydalanuvchi',
  },
  {
    username: 'Humoyun',
    password: 'Humoyun12',
    role: 'admin',
    name: 'Humoyun',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    title: 'Bosh Administrator',
  },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Auth ma'lumotlarini o'qishda xatolik:", e);
    }
    // Dastlabki qulaylik uchun default user sifatida Muhammad kirgan holatda bo'lishi mumkin
    // yoki foydalanuvchi kiritmaguncha null
    return {
      username: 'Muhammad',
      role: 'user',
      name: 'Muhammad',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Foydalanuvchi',
      loginTime: new Date().toISOString(),
    };
  });

  // LocalStorage ga sinxronizatsiya
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    } catch (e) {
      console.warn("Auth ma'lumotlarini saqlashda xatolik:", e);
    }
  }, [currentUser]);

  // Login funksiyasi
  const login = useCallback((inputUsername, inputPassword) => {
    const trimmedUser = (inputUsername || '').trim();
    const trimmedPass = (inputPassword || '').trim();

    const matched = VALID_CREDENTIALS.find(
      (acc) =>
        acc.username.toLowerCase() === trimmedUser.toLowerCase() &&
        acc.password === trimmedPass
    );

    if (matched) {
      const userPayload = {
        username: matched.username,
        role: matched.role,
        name: matched.name,
        avatar: matched.avatar,
        title: matched.title,
        loginTime: new Date().toISOString(),
      };
      setCurrentUser(userPayload);
      return { success: true, user: userPayload };
    }

    return {
      success: false,
      message: "Login yoki parol noto'g'ri! Iltimos, qayta tekshirib ko'ring.",
    };
  }, []);

  // Logout funksiyasi
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const isAdmin = currentUser?.role === 'admin';
  const isUser = currentUser?.role === 'user';
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAdmin,
        isUser,
        isLoggedIn,
        validAccounts: VALID_CREDENTIALS,
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
