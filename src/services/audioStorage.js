// Native IndexedDB yordamida audio fayllar va rasmlarni brauzerda to'liq saqlash
// Bu orqali foydalanuvchi kompyuterdan yuklagan MP3 fayllari sahifa yangilansa ham o'chib ketmaydi

const DB_NAME = 'soundwave_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB qo'llab-quvvatlanmaydi"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Fayl saqlash (Blob yoki File)
export const saveMediaToDB = async (key, blobOrFile) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(blobOrFile, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB ga saqlashda xato:", err);
    return false;
  }
};

// Faylni olish
export const getMediaFromDB = async (key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB dan olishda xato:", err);
    return null;
  }
};

// Faylni o'chirish
export const deleteMediaFromDB = async (key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB dan o'chirishda xato:", err);
    return false;
  }
};
