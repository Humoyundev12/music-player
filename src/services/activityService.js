// Foydalanuvchilar harakatlari, arizalar va email xabarlarini boshqarish xizmati

const ACTIVITIES_KEY = 'music_app_activities_v3';
const REQUESTS_KEY = 'music_app_access_requests_v3';
const EMAILS_KEY = 'music_app_sent_emails_v3';
const CUSTOM_USERS_KEY = 'music_app_registered_users_v3';

// Boshlang'ich test faoliyatlari (Admin darhol ko'rishi uchun)
const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'LOGIN',
    user: 'Muhammad',
    role: 'user',
    details: "Tizimga kirdi (Chrome / Windows)",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'act-2',
    type: 'SEARCH',
    user: 'Muhammad',
    role: 'user',
    details: '"Группа крови" musiqasini qidirdi',
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
  {
    id: 'act-3',
    type: 'PLAY',
    user: 'Muhammad',
    role: 'user',
    details: '"Группа крови - Кино" qo\'shig\'ini tingladi',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'act-4',
    type: 'PROFILE_PHOTO',
    user: 'Muhammad',
    role: 'user',
    details: "Profilga yangi avatar rasmi yukladi",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

// Boshlang'ich arizalar namunasi
const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    firstName: 'Humoyun',
    lastName: 'Biymirzayev',
    birthYear: '2004',
    email: 'biymirzayev012@gmail.com',
    status: 'approved', // 'pending' | 'approved' | 'rejected'
    assignedLogin: 'biymirzayev.012',
    assignedPassword: 'hbMusic2026!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'req-2',
    firstName: 'Jasur',
    lastName: 'Karimov',
    birthYear: '2001',
    email: 'jasur.karimov@mail.ru',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
];

// Boshlang'ich yuborilgan emaillar namunasi
const INITIAL_EMAILS = [
  {
    id: 'email-1',
    to: 'biymirzayev012@gmail.com',
    subject: 'HB Music tizimiga kirish ma\'lumotlaringiz (Login & Parol)',
    firstName: 'Humoyun',
    lastName: 'Biymirzayev',
    login: 'biymirzayev.012',
    password: 'hbMusic2026!',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

export const getStoredActivities = () => {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const logActivity = (type, user, details, role = 'user') => {
  try {
    const current = getStoredActivities();
    const newAct = {
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type, // 'LOGIN' | 'LOGOUT' | 'SEARCH' | 'PLAY' | 'LIKE' | 'PROFILE_PHOTO' | 'PROFILE_EDIT' | 'PROFILE_STORY'
      user: typeof user === 'string' ? user : user?.name || user?.username || 'Mehmon',
      role: (typeof user === 'object' && user?.role) || role,
      details,
      timestamp: new Date().toISOString(),
    };
    const updated = [newAct, ...current].slice(0, 200); // Oxirgi 200 ta amalni saqlash
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
    // Hodisa tarqatish (jonli yangilanish uchun)
    window.dispatchEvent(new CustomEvent('music_app_activity_update', { detail: newAct }));
    return updated;
  } catch (e) {
    console.warn('Faoliyatni qayd etishda xato:', e);
    return [];
  }
};

export const clearStoredActivities = () => {
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('music_app_activity_update'));
};

// ============= ARIZALAR (REQUESTS) =============
export const getStoredRequests = () => {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
};

export const saveAccessRequest = (requestData) => {
  const current = getStoredRequests();
  const newReq = {
    id: `req_${Date.now()}`,
    firstName: requestData.firstName.trim(),
    lastName: requestData.lastName.trim(),
    birthYear: requestData.birthYear.trim(),
    email: requestData.email.trim().toLowerCase(),
    note: requestData.note || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const updated = [newReq, ...current];
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
  logActivity('REQUEST_SUBMITTED', `${newReq.firstName} ${newReq.lastName}`, `${newReq.email} orqali tizimga kirish uchun ariza yubordi`);
  window.dispatchEvent(new CustomEvent('music_app_requests_update'));
  return newReq;
};

// ============= YUBORILGAN EMAILLAR =============
export const getStoredEmails = () => {
  try {
    const raw = localStorage.getItem(EMAILS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_EMAILS;
  } catch {
    return INITIAL_EMAILS;
  }
};

export const sendCredentialsEmail = ({ to, firstName, lastName, login, password }) => {
  const current = getStoredEmails();
  const newEmail = {
    id: `email_${Date.now()}`,
    to,
    subject: 'HB Music tizimiga kirish ma\'lumotlaringiz (Login & Parol)',
    firstName,
    lastName,
    login,
    password,
    sentAt: new Date().toISOString(),
    status: 'Yuborildi (Muvaffaqiyatli)',
  };
  const updated = [newEmail, ...current];
  localStorage.setItem(EMAILS_KEY, JSON.stringify(updated));
  logActivity('EMAIL_SENT', 'Admin (Humoyun)', `${to} manziliga login: "${login}" va parol yuborildi`, 'admin');
  window.dispatchEvent(new CustomEvent('music_app_emails_update', { detail: newEmail }));
  return newEmail;
};

// ============= FOYDALANUVCHILAR RO'YXATI =============
export const getCustomUsers = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomUser = (userData) => {
  const current = getCustomUsers();
  const existingIdx = current.findIndex(
    (u) => u.username.toLowerCase() === userData.username.toLowerCase() || u.email?.toLowerCase() === userData.email?.toLowerCase()
  );
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...userData };
  } else {
    updated = [...current, userData];
  }
  localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('music_app_users_update'));
  return updated;
};
