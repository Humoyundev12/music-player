# 🎵 SoundWave - React Music Player UI

`https://music-l8kd.onrender.com` backend API bilan integratsiya qilingan zamonaviy React musiqa ilovasi.

## ✨ Imkoniyatlar

- 🔒 **Xavfsiz konfiguratsiya (`.env`)**: Backend URL manzili `.env` faylida saqlanadi va `.gitignore` ga qo'shilgan.
- 🪝 **Maxsus Custom Hooklar**:
  - [`useTheme`](src/hooks/useTheme.js) - Dark Mode & Light Mode (tizim yoki foydalanuvchi tanlovi, `localStorage` bilan sinxronlashadi).
  - [`useSongs`](src/hooks/useSongs.js) - Backend API (`/api/songs`, `/api/genres`, `/api/songs/{id}/like`) bilan ishlash, qidiruv, janrlar bo'yicha filtrlash, yangi musiqa qo'shish.
  - [`usePlayer`](src/hooks/usePlayer.js) - To'liq audio pleyer boshqaruvi (Play, Pause, Oldingi, Keyingi, Shuffle, Loop, Ovoz, Vaqt bo'yicha siljitish va `/api/songs/{id}/play` hisoblagichi).
  - [`useComments`](src/hooks/useComments.js) - Har bir qo'shiqqa izoh (comment) qoldirish va o'qish, `localStorage`da saqlash.
- 🎨 **Tailwind CSS Dizayn**: Glassmorphism, zamonaviy gradientlar, tenglashtiruvchi audio vizualizatori (equalizer) va to'liq moslashuvchan (responsive) interfeys.
- 🖼️ **Modal oynalar**:
  - **Musiqa qo'shish modali**: Yangi qo'shiq nomi, ijrochi, janr, audio va rasm URL kiritish imkoniyati (tezkor namunaviy audio va rasmlar bilan).
  - **Izohlar (Comments) modali**: Har qanday qo'shiqqa fikr bildirish, oldingi izohlarni ko'rish.
- ❤️ **Like tizimi**: Sevimli qo'shiqlarga like bosish, faqat yoqtirilganlarni alohida filtrlab ko'rish imkoniyati.

## 🚀 Ishga tushirish

1. `.env` faylini tekshiring:
```env
VITE_API_URL=https://music-l8kd.onrender.com
```

2. Dasturni ishga tushirish:
```bash
npm run dev
```

3. Dasturni yig'ish (build):
```bash
npm run build
```

4. Kod sifatini tekshirish (oxlint):
```bash
npm run lint
```
