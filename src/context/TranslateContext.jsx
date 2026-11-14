import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations/translations';

const TranslateContext = createContext(null);

const STORAGE_LANG_KEY = 'music_app_language_v1';

export const LANGUAGES = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const TranslateProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved && ['uz', 'ru', 'en'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn("Tilni yuklashda xatolik:", e);
    }
    return 'uz';
  });

  const setLang = useCallback((newLang) => {
    if (['uz', 'ru', 'en'].includes(newLang)) {
      setLangState(newLang);
      try {
        localStorage.setItem(STORAGE_LANG_KEY, newLang);
      } catch (e) {
        console.warn("Tilni saqlashda xatolik:", e);
      }
    }
  }, []);

  // Tarjima funksiyasi: t('key', fallback)
  const t = useCallback((key, fallback = '') => {
    const currentDict = translations[lang] || translations.uz;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    // Agar tanlangan tilda bo'lmasa, o'zbekchadan qidirish
    if (translations.uz && translations.uz[key] !== undefined) {
      return translations.uz[key];
    }
    return fallback || key;
  }, [lang]);

  return (
    <TranslateContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
};

export default useTranslate;
