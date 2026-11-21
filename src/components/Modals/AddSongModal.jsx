import React, { useState, useRef, useEffect } from 'react';
import {
  FaTimes,
  FaMusic,
  FaCheck,
  FaExclamationCircle,
  FaLanguage,
  FaCrown,
  FaShieldAlt,
  FaUpload,
  FaLink,
  FaMicrophone,
  FaStop,
  FaImage,
  FaPlay,
  FaPause,
} from 'react-icons/fa';
import { DEFAULT_COVERS } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useTranslate } from '../../hooks/useTranslate';

const SAMPLE_AUDIOS = [
  { label: 'SoundHelix 1 (Rok/Elektron)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { label: 'SoundHelix 2 (Gitara/Retro)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { label: 'SoundHelix 3 (Pop/Sokin)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { label: 'SoundHelix 4 (Zamonaviy)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

const GENRE_OPTIONS = ['Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Lo-Fi', 'Ethno', 'Chill', 'Folk', 'Klassik'];

const AddSongModal = ({ isOpen, onClose, onAddSong, onOpenLogin }) => {
  const { isAdmin, currentUser } = useAuth();
  const { t } = useTranslate();

  // Asosiy ma'lumotlar
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [language, setLanguage] = useState('ru'); // 'ru', 'en', 'uz', 'es'
  const [summary, setSummary] = useState('');
  const [originalLyrics, setOriginalLyrics] = useState('');
  const [uzbekTranslation, setUzbekTranslation] = useState('');

  // Audio manbasi: 'file' (kompyuterdan fayl) | 'url' (havola) | 'record' (mikrofondan yozish)
  const [audioSourceType, setAudioSourceType] = useState('file');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFilePreview, setAudioFilePreview] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // Rasm manbasi: 'gallery' (galereya) | 'file' (rasm fayli) | 'url' (havola)
  const [coverSourceType, setCoverSourceType] = useState('gallery');
  const [coverFile, setCoverFile] = useState(null);
  const [coverFilePreview, setCoverFilePreview] = useState('');
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVERS[0]);

  // Mikrofon yozuvi (Voice Recording)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Yuklanish va xabarlar
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Fayl input ref
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Komponent yopilganda tozalash
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (audioFilePreview && audioFilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(audioFilePreview);
      }
      if (coverFilePreview && coverFilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverFilePreview);
      }
    };
  }, [audioFilePreview, coverFilePreview]);

  if (!isOpen) return null;

  // Agar admin bo'lmasa, bu modal ochilmaydi
  if (!isAdmin) {
    return null;
  }

  // Audio fayl tanlanganda
  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAudioFilePreview(previewUrl);

    // Fayl nomidan qo'shiq nomi va ijrochini aniqlash (masalan: "Eminem - Mockingbird.mp3")
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (cleanName.includes('-')) {
      const parts = cleanName.split('-');
      if (!artist.trim()) setArtist(parts[0].trim());
      if (!title.trim()) setTitle(parts.slice(1).join('-').trim());
    } else if (!title.trim()) {
      setTitle(cleanName);
    }
  };

  // Cover rasm fayli tanlanganda
  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCoverFilePreview(previewUrl);
  };

  // Mikrofondan ovoz yozishni boshlash
  const startRecording = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const recordedFile = new File([audioBlob], `yozuv_${Date.now()}.mp3`, { type: 'audio/mp3' });
        setAudioFile(recordedFile);
        const url = URL.createObjectURL(audioBlob);
        setAudioFilePreview(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setErrorMsg("Mikrofonga ruxsat berilmadi yoki ulanishda xato: " + err.message);
    }
  };

  // Ovoz yozishni to'xtatish
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      setErrorMsg("Iltimos, qo'shiq nomi va ijrochisini kiriting!");
      return;
    }

    // Audio mavjudligini tekshirish
    if (audioSourceType === 'file' && !audioFile) {
      setErrorMsg("Iltimos, kompyuter yoki telefoningizdan audio fayl tanlang!");
      return;
    }
    if (audioSourceType === 'url' && !audioUrl.trim()) {
      setErrorMsg("Iltimos, audio havola (URL) kiriting!");
      return;
    }
    if (audioSourceType === 'record' && !audioFile) {
      setErrorMsg("Iltimos, mikrofon orqali ovoz yozib oling!");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Matn va tarjima qatorlari
    const origLines = originalLyrics.split('\n').map((l) => l.trim()).filter(Boolean);
    const uzbLines = uzbekTranslation.split('\n').map((l) => l.trim()).filter(Boolean);

    const pairedLyrics = [];
    const maxLen = Math.max(origLines.length, uzbLines.length);
    for (let i = 0; i < maxLen; i++) {
      pairedLyrics.push({
        original: origLines[i] || uzbLines[i] || '',
        translation: uzbLines[i] || origLines[i] || '',
      });
    }

    try {
      await onAddSong({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre || 'Pop',
        language: language,
        hasTranslation: language !== 'uz' && pairedLyrics.length > 0,
        lyrics: pairedLyrics,
        summary: summary.trim(),
        // Audio manbasi
        audioFile: (audioSourceType === 'file' || audioSourceType === 'record') ? audioFile : null,
        audio_url: audioSourceType === 'url' ? audioUrl.trim() : '',
        // Cover manbasi
        coverFile: coverSourceType === 'file' ? coverFile : null,
        cover_url: coverSourceType === 'url' ? coverUrl.trim() : (coverSourceType === 'gallery' ? coverUrl : ''),
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
        // Tozalash
        setTitle('');
        setArtist('');
        setAudioUrl('');
        setAudioFile(null);
        setAudioFilePreview('');
        setCoverFile(null);
        setCoverFilePreview('');
        setOriginalLyrics('');
        setUzbekTranslation('');
        setSummary('');
      }, 900);
    } catch (err) {
      setErrorMsg("Qo'shiqni qo'shishda xatolik yuz berdi: " + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <FaMusic className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('add_new_song', "Yangi musiqa qo'shish")}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                  <FaShieldAlt /> Faqat Admin (Humoyun)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fayldan, havoladan yoki mikrofondan qo'shish imkoniyati
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal formasi */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
              <FaExclamationCircle className="shrink-0 text-sm" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
              <FaCheck className="shrink-0 text-sm" />
              <span>{t('song_added_success', "Musiqa muvaffaqiyatli qo'shildi!")}</span>
            </div>
          )}

          {/* 1. AUDIO MANBASI: FAYLDAN / HAVOLADAN / MIKROFONDAN */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                <FaMusic className="text-indigo-600 dark:text-indigo-400" />
                <span>Audio manbasi (Qayerdan qo'shmoqchisiz?):</span>
              </span>
            </div>

            {/* Manba tablari */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAudioSourceType('file')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold transition-all ${
                  audioSourceType === 'file'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <FaUpload className="text-[11px]" />
                <span>Fayl yuklash</span>
              </button>

              <button
                type="button"
                onClick={() => setAudioSourceType('url')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold transition-all ${
                  audioSourceType === 'url'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <FaLink className="text-[11px]" />
                <span>Havola (Link)</span>
              </button>

              <button
                type="button"
                onClick={() => setAudioSourceType('record')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold transition-all ${
                  audioSourceType === 'record'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <FaMicrophone className="text-[11px]" />
                <span>Ovoz yozish</span>
              </button>
            </div>

            {/* 1A. Fayl yuklash maydoni */}
            {audioSourceType === 'file' && (
              <div className="space-y-2">
                <input
                  type="file"
                  ref={audioInputRef}
                  onChange={handleAudioFileChange}
                  accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                  className="hidden"
                />
                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-2xl p-4 text-center cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all"
                >
                  <FaUpload className="text-2xl text-indigo-500 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {audioFile ? audioFile.name : "Kompyuter yoki telefoningizdan audio tanlang"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {audioFile
                      ? `Hajmi: ${(audioFile.size / (1024 * 1024)).toFixed(2)} MB • O'zgartirish uchun bosing`
                      : "MP3, WAV, M4A, OGG formatlari qo'llab-quvvatlanadi"}
                  </p>
                </div>

                {/* Faylni tinglab ko'rish (Preview) */}
                {audioFilePreview && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold text-[11px] truncate">
                      🎧 Tanlangan audio preview:
                    </span>
                    <audio controls src={audioFilePreview} className="h-8 max-w-[200px]" />
                  </div>
                )}
              </div>
            )}

            {/* 1B. Havola (URL) maydoni */}
            {audioSourceType === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 self-center">Namunaviy:</span>
                  {SAMPLE_AUDIOS.map((s, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAudioUrl(s.url)}
                      className="px-2 py-0.5 text-[10px] rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      ⚡ {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 1C. Mikrofondan yozish */}
            {audioSourceType === 'record' && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  Mikrofon orqali o'z qo'shig'ingiz yoki ovozingizni yozib oling:
                </p>

                <div className="flex items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-md shadow-rose-500/25 active:scale-95"
                    >
                      <FaMicrophone />
                      <span>Yozishni boshlash</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2 shadow-md shadow-amber-500/25 animate-pulse"
                    >
                      <FaStop />
                      <span>To'xtatish ({recordingSeconds}s)</span>
                    </button>
                  )}
                </div>

                {audioFilePreview && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">✓ Yozib olindi:</span>
                    <audio controls src={audioFilePreview} className="h-8 max-w-[200px]" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Qo'shiq nomi va Ijrochi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('song_title', "Qo'shiq nomi")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Группа крови / Believer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('artist_name', "Ijrochi / Xonanda")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Виктор Цой / Imagine Dragons"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Janr va Til */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('genre', "Janr")}
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FaLanguage className="text-indigo-500" />
                <span>{t('song_language', "Qo'shiq tili")}</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ru">🇷🇺 Ruscha (Pastida tarjimasi bilan)</option>
                <option value="en">🇬🇧 Inglizcha (Pastida tarjimasi bilan)</option>
                <option value="es">🇪🇸 Ispancha (Pastida tarjimasi bilan)</option>
                <option value="uz">🇺🇿 O'zbekcha</option>
              </select>
            </div>
          </div>

          {/* 2. MUQOVA RASMI (COVER): GALEREYA / FAYL / HAVOLA */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {t('cover_url', "Muqova rasmi (Cover)")}
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setCoverSourceType('gallery')}
                  className={`px-2 py-0.5 rounded-lg ${
                    coverSourceType === 'gallery' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  Galereya
                </button>
                <button
                  type="button"
                  onClick={() => setCoverSourceType('file')}
                  className={`px-2 py-0.5 rounded-lg ${
                    coverSourceType === 'file' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  Fayl yuklash
                </button>
                <button
                  type="button"
                  onClick={() => setCoverSourceType('url')}
                  className={`px-2 py-0.5 rounded-lg ${
                    coverSourceType === 'url' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  URL havola
                </button>
              </div>
            </div>

            {coverSourceType === 'gallery' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {DEFAULT_COVERS.slice(0, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Cover ${i}`}
                    onClick={() => setCoverUrl(img)}
                    className={`w-12 h-12 rounded-xl object-cover cursor-pointer hover:scale-105 transition-transform border-2 shrink-0 ${
                      coverUrl === img ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70'
                    }`}
                  />
                ))}
              </div>
            )}

            {coverSourceType === 'file' && (
              <div className="space-y-2">
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {coverFile ? coverFile.name : "Rasm faylini tanlash uchun bosing (.jpg, .png, .webp)"}
                  </p>
                </div>
                {coverFilePreview && (
                  <img src={coverFilePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border" />
                )}
              </div>
            )}

            {coverSourceType === 'url' && (
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

          {/* 3. MATN VA PASTIDA CHIQUVCHI O'ZBEKCHA TARJIMASI */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <FaLanguage className="text-indigo-600" />
                <span>Qo'shiq matni va o'zbekcha tarjimasi:</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                (Pastida chiqishi uchun qatorma-qator yozing)
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                1. Asl tildagi matn (Ruscha / Chet tilida):
              </label>
              <textarea
                rows={2}
                placeholder="Masalan: Теплое место, но улицы ждут отпечатков наших ног..."
                value={originalLyrics}
                onChange={(e) => setOriginalLyrics(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                2. Pastida chiqadigan O'zbekcha tarjimasi:
              </label>
              <textarea
                rows={2}
                placeholder="Masalan: Iliq joy, lekin ko'chalar bizning qadamlarimiz izini kutmoqda..."
                value={uzbekTranslation}
                onChange={(e) => setUzbekTranslation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/60 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 italic"
              />
            </div>
          </div>

          {/* Tugmalar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t('cancel', 'Bekor qilish')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/25 active:scale-95 disabled:opacity-50 transition-all"
            >
              {loading ? "Yuklanmoqda..." : t('save_song', "Musiqani saqlash")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;
