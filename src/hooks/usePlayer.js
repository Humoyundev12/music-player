import { useState, useEffect, useRef, useCallback } from 'react';
import { playSongApi, resolveMediaUrl } from '../services/api';

export const usePlayer = () => {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Audio obyektini inicializatsiya qilish
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.8;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };

    const handleEnded = () => {
      if (audio.loop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e) => {
      console.warn("Audio ijrosida xatolik:", e);
      setAudioError("Audio faylni o'qishda xatolik yuz berdi");
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Loop o'zgarishi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Qo'shiqni ijro etish yoki to'xtatish
  const playSong = useCallback((song) => {
    if (!song) return;
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(null);

    // Agar o'sha qo'shiq bo'lsa, play/pause qilamiz
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Audio play xatosi:", err);
            setAudioError("Qo'shiqni ijro etib bo'lmadi");
            setIsPlaying(false);
          });
      }
      return;
    }

    // Yangi qo'shiq tanlansa
    setCurrentSong(song);
    const audioUrl = resolveMediaUrl(song.audio_url, 'audio');
    audio.src = audioUrl;
    audio.currentTime = 0;

    audio.play()
      .then(() => {
        setIsPlaying(true);
        // Backendga tinglanganlik hisobini yuborish
        playSongApi(song.id);
      })
      .catch((err) => {
        console.warn("Yangi qo'shiq play xatosi:", err);
        setAudioError("Audio manzilida muammo bor yoki format qo'llab-quvvatlanmaydi");
        setIsPlaying(false);
      });
  }, [currentSong, isPlaying]);

  // Play / Pause almashtirish
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play xatosi:", err);
          setAudioError("Ijroni davom ettirib bo'lmadi");
        });
    }
  }, [currentSong, isPlaying]);

  // Vaqtni o'zgartirish (Seek)
  const seek = useCallback((timeInSeconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = timeInSeconds;
    setCurrentTime(timeInSeconds);
  }, []);

  // Ovozni sozlash
  const setVolume = useCallback((val) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audio) {
      audio.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      if (audio) audio.muted = false;
    }
  }, [isMuted]);

  // Ovozni o'chirish / yoqish
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audio.muted = newMuteState;
  }, [isMuted]);

  // Loop ni yoqish/o'chirish
  const toggleLoop = useCallback(() => {
    setIsLoop(prev => !prev);
  }, []);

  // Shuffle ni yoqish/o'chirish
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  // Keyingi qo'shiq
  const nextSong = useCallback((songsList = []) => {
    if (!songsList || songsList.length === 0) return;
    if (!currentSong) {
      playSong(songsList[0]);
      return;
    }

    if (isShuffle) {
      const remaining = songsList.filter(s => s.id !== currentSong.id);
      if (remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        playSong(remaining[randomIndex]);
        return;
      }
    }

    const currentIndex = songsList.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songsList.length;
    playSong(songsList[nextIndex]);
  }, [currentSong, isShuffle, playSong]);

  // Oldingi qo'shiq
  const prevSong = useCallback((songsList = []) => {
    if (!songsList || songsList.length === 0) return;
    if (!currentSong) {
      playSong(songsList[0]);
      return;
    }

    const currentIndex = songsList.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songsList.length) % songsList.length;
    playSong(songsList[prevIndex]);
  }, [currentSong, playSong]);

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoop,
    isShuffle,
    audioError,
    playSong,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    nextSong,
    prevSong,
  };
};

export default usePlayer;
