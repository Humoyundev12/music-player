// HB Music Pro — 50 ta boy va rang-barang universal qo'shiqlar to'plami
// O'zbek, Rus va Xorijiy xitlar, to'liq ma'lumotlar va o'zbekcha tarjimalari bilan

const SOUND_AUDIOS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
];

export const INITIAL_SONGS_COLLECTION = [
  // ================= 1-20: O'ZBEK ENG SARA VA ZAMONAVIY XITLARI =================
  {
    id: 'uz-1',
    title: 'Sensiz',
    artist: 'Shohruh (Rap)',
    genre: 'Hip-Hop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[0],
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: 1450,
    likes: 830,
    isTrending: true,
    summary: "O'zbek repining klassikasi. Shohruhning eng mashhur va qadrdon taronalaridan biri.",
    lyrics: [
      { original: "Sensiz o'tgan har bir kunim ma'nosiz,", translation: "Sensiz o'tgan har bir kunim ma'nosiz," },
      { original: "Yuragimda qolgan faqat bir tuyg'u bepoyon.", translation: "Yuragimda qolgan faqat bir tuyg'u bepoyon." },
      { original: "Ko'zlaringni eslasam yana hayol suraman,", translation: "Ko'zlaringni eslasam yana hayol suraman," },
      { original: "Sensiz bu dunyoda qanday yashayman?", translation: "Sensiz bu dunyoda qanday yashayman?" }
    ]
  },
  {
    id: 'uz-2',
    title: "O'tadi kunlar",
    artist: 'Konsta & Timur Alixonov',
    genre: 'Hip-Hop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[1],
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    plays: 1980,
    likes: 1120,
    isTrending: true,
    summary: "Falsafiy ma'noga boy, zamonaviy o'zbek lirikasining eng sara namunasidir.",
    lyrics: [
      { original: "O'tadi kunlar, o'tadi yillar shoshilib,", translation: "O'tadi kunlar, o'tadi yillar shoshilib," },
      { original: "Orzularimiz yo'llarda qolmasin sochilib.", translation: "Orzularimiz yo'llarda qolmasin sochilib." },
      { original: "Har bir soniyani qadrla ey inson,", translation: "Har bir soniyani qadrla ey inson," },
      { original: "Bugungi kuning ertaga qaytmaydi oson.", translation: "Bugungi kuning ertaga qaytmaydi oson." }
    ]
  },
  {
    id: 'uz-3',
    title: 'Holimga qara',
    artist: 'Xamdam Sobirov',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[2],
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: 1620,
    likes: 940,
    isTrending: true,
    summary: "Xamdam Sobirovning millionlab qalblardan joy olgan mungli va samimiy qo'shig'i.",
    lyrics: [
      { original: "Kelib bir bor holimga qara ey bevafo,", translation: "Kelib bir bor holimga qara ey bevafo," },
      { original: "Sensizlik menga bo'ldi katta jafo.", translation: "Sensizlik menga bo'ldi katta jafo." },
      { original: "Ko'z yoshlarim to'kildi qaro kechalarda,", translation: "Ko'z yoshlarim to'kildi qaro kechalarda," },
      { original: "Isming qoldi faqatgina ko'chalarda.", translation: "Isming qoldi faqatgina ko'chalarda." }
    ]
  },
  {
    id: 'uz-4',
    title: "Ulug'imsan Vatanim",
    artist: 'Sevara Nazarkhan',
    genre: 'Ethno',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[3],
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: 2300,
    likes: 1450,
    isTrending: true,
    summary: "Vatan madhi, milliy va xalqaro miqyosda tan olingan betakror san'at asari.",
    lyrics: [
      { original: "Sen mening ko'nglimning gavhari ardog'i,", translation: "Sen mening ko'nglimning gavhari ardog'i," },
      { original: "Har giyohing aziz, azizdir tuprog'ing.", translation: "Har giyohing aziz, azizdir tuprog'ing." },
      { original: "Ulug'imsan go'zal ona Vatanim,", translation: "Ulug'imsan go'zal ona Vatanim," },
      { original: "Jonim fido senga ko'zim ravshanim.", translation: "Jonim fido senga ko'zim ravshanim." }
    ]
  },
  {
    id: 'uz-5',
    title: 'Karvon',
    artist: "Sherali Jo'rayev",
    genre: 'Classic',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[4],
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    plays: 3100,
    likes: 2100,
    isTrending: true,
    summary: "O'zbek mumtoz va xalq qo'shiqlarining eng buyuk cho'qqisi hisoblangan 'Karvon ko'rdim'.",
    lyrics: [
      { original: "Karvon ko'rdim tuyalari bo'zlab kelar,", translation: "Karvon ko'rdim tuyalari bo'zlab kelar," },
      { original: "Nor tuyada mening yorim yig'lab kelar.", translation: "Nor tuyada mening yorim yig'lab kelar." }
    ]
  },
  {
    id: 'uz-6',
    title: 'Yurak',
    artist: 'Rayhon',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[5],
    cover_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
    plays: 1320,
    likes: 710,
    isTrending: false,
    summary: "Rayhonning romantik va ohangdor estrada kompozitsiyasi.",
    lyrics: [
      { original: "Yurak, nega buncha ezasan meni tinmay?", translation: "Yurak, nega buncha ezasan meni tinmay?" },
      { original: "Sevgi yo'llarida qoldim hech narsa bilmay.", translation: "Sevgi yo'llarida qoldim hech narsa bilmay." }
    ]
  },
  {
    id: 'uz-7',
    title: 'Bolalar xiti',
    artist: 'Tohir Sodiqov (Bolalar)',
    genre: 'Rock',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[6],
    cover_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    plays: 2450,
    likes: 1390,
    isTrending: true,
    summary: "90-yillardan hozirgacha avlodlar sevimli bo'lib kelayotgan pop-rok sadolari.",
    lyrics: [
      { original: "Esingdami o'sha yoshlik damlari,", translation: "Esingdami o'sha yoshlik damlari," },
      { original: "Beg'ubor va orzular olami.", translation: "Beg'ubor va orzular olami." }
    ]
  },
  {
    id: 'uz-8',
    title: 'Janon bo‘laman',
    artist: 'Jaloliddin Ahmadaliyev',
    genre: 'Folk',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[7],
    cover_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    plays: 1890,
    likes: 980,
    isTrending: true,
    summary: "Xalqona uslubdagi shirali va yurakka yaqin tarona.",
    lyrics: [
      { original: "Ko'zlaringga boqsam hayron bo'laman,", translation: "Ko'zlaringga boqsam hayron bo'laman," },
      { original: "Bir kun senga atalgan jon bo'laman.", translation: "Bir kun senga atalgan jon bo'laman." }
    ]
  },
  {
    id: 'uz-9',
    title: "Qizg'aldog'im",
    artist: "Ulug'bek Rahmatullayev",
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[8],
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    plays: 1540,
    likes: 820,
    isTrending: false,
    summary: "Muhammad Yusuf she'riga bastalangan betakror qo'shiq.",
    lyrics: [
      { original: "Qizg'aldog'im, qirdan ketgan lolazorim,", translation: "Qizg'aldog'im, qirdan ketgan lolazorim," },
      { original: "Mening mungli, beozor sevgilim.", translation: "Mening mungli, beozor sevgilim." }
    ]
  },
  {
    id: 'uz-10',
    title: 'Muhabbat',
    artist: 'Yulduz Usmonova',
    genre: 'Ethno',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[9],
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    plays: 2800,
    likes: 1670,
    isTrending: true,
    summary: "Prima donna ijrosidagi kuchli vokal va o'lmas musiqa.",
    lyrics: [
      { original: "Muhabbat sen borsan bu dunyo go'zal,", translation: "Muhabbat sen borsan bu dunyo go'zal," },
      { original: "Sensiz har bir nafas g'amga aylanar.", translation: "Sensiz har bir nafas g'amga aylanar." }
    ]
  },
  {
    id: 'uz-11',
    title: 'Yonar',
    artist: 'Munisa Rizayeva',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[10],
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    plays: 1730,
    likes: 910,
    isTrending: false,
    summary: "Sho'x va zamonaviy raqsbop estrada taronasi.",
    lyrics: [
      { original: "Yonar yuragim yonar seni ko'rganda,", translation: "Yonar yuragim yonar seni ko'rganda," },
      { original: "Qalbim quvonchga to'lar sen kulganda.", translation: "Qalbim quvonchga to'lar sen kulganda." }
    ]
  },
  {
    id: 'uz-12',
    title: 'Eslama meni',
    artist: 'Ummon guruhi',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[11],
    cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    plays: 2150,
    likes: 1240,
    isTrending: true,
    summary: "Ummon guruhining afsonaviy xiti. Millionlab muxlislarning eng sevimli taronasi.",
    lyrics: [
      { original: "Endi meni eslama, qaytib kelma dema,", translation: "Endi meni eslama, qaytib kelma dema," },
      { original: "Bizning sevgimizga qo'yildi nuqta.", translation: "Bizning sevgimizga qo'yildi nuqta." }
    ]
  },
  {
    id: 'uz-13',
    title: 'Qaddi baland',
    artist: 'Jahangir Otajonov',
    genre: 'Folk',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[12],
    cover_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80',
    plays: 1610,
    likes: 850,
    isTrending: false,
    summary: "Xorazm milliy ohanglari va zamonaviy ijro uyg'unligi.",
    lyrics: [
      { original: "Qaddi baland parivash ko'zlari zebo,", translation: "Qaddi baland parivash ko'zlari zebo," },
      { original: "O'ziga rom ayladi aqlu hushim shaydo.", translation: "O'ziga rom ayladi aqlu hushim shaydo." }
    ]
  },
  {
    id: 'uz-14',
    title: 'Dilbarim',
    artist: 'DJ Piligrim',
    genre: 'Electronic',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[13],
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    plays: 1420,
    likes: 770,
    isTrending: false,
    summary: "Sharqona ohanglar va elektron klub musiqasining yorqin sintezi.",
    lyrics: [
      { original: "Dilbarim go'zallar ichra tanho sanam,", translation: "Dilbarim go'zallar ichra tanho sanam," },
      { original: "Sen tomon intilar har doim qadam.", translation: "Sen tomon intilar har doim qadam." }
    ]
  },
  {
    id: 'uz-15',
    title: 'Alamli sevgim',
    artist: 'Doston Ergashev',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[14],
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: 1290,
    likes: 680,
    isTrending: false,
    summary: "Armonli sevgi haqidagi dardli va samimiy qo'shiq.",
    lyrics: [
      { original: "Yurakda qolgan alamli dog'larim,", translation: "Yurakda qolgan alamli dog'larim," },
      { original: "Kuz kelib to'kildi sevgim bog'lari.", translation: "Kuz kelib to'kildi sevgim bog'lari." }
    ]
  },
  {
    id: 'uz-16',
    title: 'Turist',
    artist: 'VIA Marokand',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[15],
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: 1180,
    likes: 590,
    isTrending: false,
    summary: "Samarqand va Buxoro ruhiyati tarannum etilgan quvnoq estrada taronasi.",
    lyrics: [
      { original: "Bizning go'zal yurtimizga kelgan mehmon,", translation: "Bizning go'zal yurtimizga kelgan mehmon," },
      { original: "Qalbingizga quvonch bag'ishlar har on.", translation: "Qalbingizga quvonch bag'ishlar har on." }
    ]
  },
  {
    id: 'uz-17',
    title: 'Rayhon senga uylanaman',
    artist: 'Ozodbek Nazarbekov',
    genre: 'Classic',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[0],
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: 2600,
    likes: 1530,
    isTrending: true,
    summary: "Xalq artisti Ozodbek Nazarbekovning eng mashhur xitlaridan biri.",
    lyrics: [
      { original: "Rayhon seni ko'rganda hushim ketar,", translation: "Rayhon seni ko'rganda hushim ketar," },
      { original: "Bir tabassuming butun umrga yetar.", translation: "Bir tabassuming butun umrga yetar." }
    ]
  },
  {
    id: 'uz-18',
    title: 'Farishtam',
    artist: 'Sardor Rahimxon',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[1],
    cover_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
    plays: 1350,
    likes: 720,
    isTrending: false,
    summary: "Onajonlarga atalgan chuqur ma'noli va ta'sirchan qo'shiq.",
    lyrics: [
      { original: "Farishtam onam, baxtimning poydevori,", translation: "Farishtam onam, baxtimning poydevori," },
      { original: "Har bir duongiz dardlarimning darmoni.", translation: "Har bir duongiz dardlarimning darmoni." }
    ]
  },
  {
    id: 'uz-19',
    title: 'Sevgingni menga ayt',
    artist: 'Lola Yo‘ldosheva',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[2],
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    plays: 1410,
    likes: 670,
    isTrending: false,
    summary: "Nozik tuyg'ular va romantika tarannumi.",
    lyrics: [
      { original: "Sevgingni yashirma, ko'zlaringda ko'rdim,", translation: "Sevgingni yashirma, ko'zlaringda ko'rdim," },
      { original: "Yuragim eshigini senga deb ochdim.", translation: "Yuragim eshigini senga deb ochdim." }
    ]
  },
  {
    id: 'uz-20',
    title: 'Yolg‘onchim',
    artist: 'Shohruhxon',
    genre: 'Pop',
    language: 'uz',
    hasTranslation: false,
    audio_url: SOUND_AUDIOS[3],
    cover_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    plays: 1720,
    likes: 890,
    isTrending: false,
    summary: "Shohruhxonning zamonaviy va raqsbop estrada xiti.",
    lyrics: [
      { original: "Yolg'on so'zlaringga ishondim nega?", translation: "Yolg'on so'zlaringga ishondim nega?" },
      { original: "Sensiz bu qalbim bo'ldi beega.", translation: "Sensiz bu qalbim bo'ldi beega." }
    ]
  },

  // ================= 21-35: RUSCHA VA MDH ENG OMRABOP XITLARI (O'ZBEKCHA TARJIMASI BILAN) =================
  {
    id: 'ru-1',
    title: 'Группа крови',
    artist: 'Кино (Виктор Цой)',
    genre: 'Rock',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[4],
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: 2850,
    likes: 1820,
    isTrending: true,
    summary: "Afsonaviy Viktor Tsoyning eng mashhur rok taronasi. Urush, qat'iyat va jasorat haqida.",
    lyrics: [
      { original: "Теплое место, но улицы ждут отпечатков наших ног.", translation: "Iliq joy, lekin ko'chalar bizning qadamlarimiz izini kutmoqda." },
      { original: "Звездная пыль на сапогах.", translation: "Etiklar ustida yulduzlar changi." },
      { original: "Мягкое кресло, клетчатый плед, не нажатый вовремя курок.", translation: "Yumshoq kreslo, katakli adyol, vaqtida bosilmagan tepki." },
      { original: "Группа крови на рукаве, мой порядковый номер на рукаве,", translation: "Qo'limdagi yengimda qon guruhi, yengimdagi mening tartib raqamim," },
      { original: "Пожелай мне удачи в бою, пожелай мне:", translation: "Jangda menga omad tilagin, menga tilagin:" },
      { original: "Не остаться в этой траве, не остаться в этой траве.", translation: "Bu maysalar orasida qolib ketmaslikni, shu yerda qolib ketmaslikni." }
    ]
  },
  {
    id: 'ru-2',
    title: 'Седая ночь',
    artist: 'Юрий Шатунов (Ласковый май)',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[5],
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: 2900,
    likes: 1950,
    isTrending: true,
    summary: "Butun dunyo bo'ylab millionlab qalblarni zabt etgan retro nostalgiya qo'shig'i.",
    lyrics: [
      { original: "И снова седая ночь, и только ей доверяю я.", translation: "Va yana oq sochli tun, va faqat unga ishonaman men." },
      { original: "Знаешь, седая ночь, ты все мои тайны.", translation: "Bilasanku, ey oq tun, sen mening barcha sirlarimni." },
      { original: "Но даже и ты помочь не можешь, и темнота твоя", translation: "Lekin sen ham yordam bera olmaysan, va sening zulmating" },
      { original: "Мене не ответит, и не вернет ее.", translation: "Menga javob bermaydi, va uni qaytara olmaydi." }
    ]
  },
  {
    id: 'ru-3',
    title: 'Minor',
    artist: 'Miyagi & Andy Panda',
    genre: 'Hip-Hop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[6],
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    plays: 3400,
    likes: 2400,
    isTrending: true,
    summary: "Miyagining eng chuqur falsafiy va zamonaviy rep durdonasi.",
    lyrics: [
      { original: "Я снова засыпаю под этот минорный лад,", translation: "Men yana shu ma'yus minor ohangida uyquga ketyapman," },
      { original: "Где каждый прохожий прячет свой усталый взгляд.", translation: "Qayerdaki har bir yo'lovchi o'z toliqqan nigohini yashiradi." },
      { original: "Но музыка лечит раны разбитой души,", translation: "Ammo musiqa yaralangan qalb jarohatlariga malham bo'ladi," },
      { original: "Ты только вперед иди и дыши.", translation: "Sen faqat olg'a qadam bos va nafas ol." }
    ]
  },
  {
    id: 'ru-4',
    title: 'Комета',
    artist: 'JONY',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[7],
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: 2750,
    likes: 1680,
    isTrending: true,
    summary: "JONY ning afsonaviy xiti, Aleksandr Pushkin she'riyati elementlari bilan uyg'unlashgan.",
    lyrics: [
      { original: "О боже, как ты красива, комета моя!", translation: "Ey xudo, naqadar go'zalsan, mening porloq kometam!" },
      { original: "Светишь сквозь мрак и холодные небеса.", translation: "Zulmat va sovuq osmonlar aro charog'on nursan." },
      { original: "Я за тобой пойду на край земли,", translation: "Men sening izingdan dunyoning chetiga ham boraman," },
      { original: "Только меня ты с собой забери.", translation: "Faqat meni o'zing bilan birga olib ket." }
    ]
  },
  {
    id: 'ru-5',
    title: 'Сансара',
    artist: 'Баста',
    genre: 'Hip-Hop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[8],
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    plays: 3100,
    likes: 2150,
    isTrending: true,
    summary: "Avlodlar davomiyligi, hayot va farzandlar haqidagi buyuk tarona.",
    lyrics: [
      { original: "Когда меня не станет, я буду петь голосами", translation: "Men bu dunyodan ketganimda, men kuylayman ovozlarida" },
      { original: "Моих детей и голосами их детей.", translation: "O'z farzandlarimning va ularning farzandlari ovozida." },
      { original: "Нас просто меняют местами, таков закон сансары.", translation: "Bizni shunchaki o'rinlarimizni almashtirishadi, bu hayot charxpalagi qonuni." }
    ]
  },
  {
    id: 'ru-6',
    title: 'Положение',
    artist: 'Скриптонит',
    genre: 'Hip-Hop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[9],
    cover_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
    plays: 2600,
    likes: 1540,
    isTrending: false,
    summary: "Skriptonitning o'ziga xos ritmi va chuqur baslari bilan mashhur kompozitsiyasi.",
    lyrics: [
      { original: "Это мое положение, твердо на ногах стоять,", translation: "Bu mening mavqeim, oyoqda mustahkam turish kerak," },
      { original: "Никому не позволю свои мечты отнять.", translation: "Hech kimga o'z orzularimni tortib olishiga yo'l qo'ymayman." }
    ]
  },
  {
    id: 'ru-7',
    title: 'Асфальт 8',
    artist: 'MACAN & Jakone',
    genre: 'Hip-Hop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[10],
    cover_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    plays: 2890,
    likes: 1870,
    isTrending: true,
    summary: "Yoshlar orasida eng mashhur avto-treklardan biri. Shahar ko'chalari va tezlik zavqi.",
    lyrics: [
      { original: "Мокрый асфальт, скорость и ночной город,", translation: "Ho'l asfalt, tezlik va tungi shahar," },
      { original: "Этот драйв согревает, когда на сердце холод.", translation: "Qalbda sovuq bo'lganda, bu shiddat isitadi." }
    ]
  },
  {
    id: 'ru-8',
    title: 'Лейла',
    artist: 'Jah Khalib',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[11],
    cover_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    plays: 2420,
    likes: 1430,
    isTrending: false,
    summary: "Jah Khalibning sharqona muhabbatga yo'g'rilgan lirik xiti.",
    lyrics: [
      { original: "Лейла, где ты бродишь в ночной тишине?", translation: "Laylo, tun sukunatida qayerlarda kezmoqdasan?" },
      { original: "Твой образ прекрасный видится мне.", translation: "Sening go'zal surating ko'z oldimda namoyon." }
    ]
  },
  {
    id: 'ru-9',
    title: 'Прятки',
    artist: 'HammAli & Navai',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[12],
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    plays: 2310,
    likes: 1320,
    isTrending: false,
    summary: "HammAli & Navaining yurakni titratuvchi his-tuyg'ularga boy dueti.",
    lyrics: [
      { original: "Мы играем в прятки с собственной судьбой,", translation: "Biz o'z taqdirimiz bilan bekinmachoq o'ynamoqdamiz," },
      { original: "Я хочу остаться навсегда с тобой.", translation: "Men butun umr sen bilan qolishni istayman." }
    ]
  },
  {
    id: 'ru-10',
    title: 'По барам',
    artist: 'ANNA ASTI',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[13],
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    plays: 2550,
    likes: 1560,
    isTrending: true,
    summary: "Kuchli xarakter va zamonaviy diskoteka ritmlari.",
    lyrics: [
      { original: "Я больше не плачу по ночам в подушку,", translation: "Men endi kechalari yostiqqa ko'z yosh to'kmayman," },
      { original: "Я выхожу в свет и поднимаю бокал.", translation: "Men yorug'lik sari qadam bosaman va qadax ko'taraman." }
    ]
  },
  {
    id: 'ru-11',
    title: 'Детство',
    artist: 'Rauf & Faik',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[14],
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    plays: 2790,
    likes: 1780,
    isTrending: true,
    summary: "Bolalik beg'uborligi va unutilmas xotiralarga bag'ishlangan taronalar.",
    lyrics: [
      { original: "В детстве мы мечтали поскорее вырасти,", translation: "Bolalikda tezroq ulg'ayishni orzu qilardik," },
      { original: "А теперь мечтаем детство назад вернуть.", translation: "Hozir esa bolalikni qaytarishni orzu qilamiz." }
    ]
  },
  {
    id: 'ru-12',
    title: 'Стрелки',
    artist: 'Markul',
    genre: 'Hip-Hop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[15],
    cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    plays: 1870,
    likes: 1040,
    isTrending: false,
    summary: "Vaqt o'tishi va maqsadlar sari to'xtovsiz harakat haqida.",
    lyrics: [
      { original: "Стрелки на часах бегут без остановки,", translation: "Soat millari to'xtovsiz chopmoqda," },
      { original: "Каждый шаг вперед требует сноровки.", translation: "Oldinga har bir qadam epchillik talab qiladi." }
    ]
  },
  {
    id: 'ru-13',
    title: 'X.O',
    artist: 'The Limba & Andro',
    genre: 'Pop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[0],
    cover_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80',
    plays: 2380,
    likes: 1390,
    isTrending: false,
    summary: "Romantik va yengil kayfiyat bag'ishlovchi mashhur kompozitsiya.",
    lyrics: [
      { original: "Она пьет Х.О, и думает о нем,", translation: "U X.O ichib, u haqida o'ylamoqda," },
      { original: "А за окном опять играет гром.", translation: "Deraza ortida esa momaqaldiroq gulduramoqda." }
    ]
  },
  {
    id: 'ru-14',
    title: 'Кукушка',
    artist: 'Полина Гагарина / Цой',
    genre: 'Rock',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[1],
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    plays: 3050,
    likes: 2190,
    isTrending: true,
    summary: "Yuraklarni larzaga soluvchi qudratli vokal va jangovar ruh.",
    lyrics: [
      { original: "Песен еще сколько, скажи, кукушка?", translation: "Nechta qo'shiq qoldi yana, aytgin menga, kakku?" },
      { original: "Пропой, в городе мне жить или на выселках.", translation: "Kuylab ber, shahardami yo chekkadami yashayman." }
    ]
  },
  {
    id: 'ru-15',
    title: 'Кадиллак',
    artist: 'MORGENSHTERN & Элджей',
    genre: 'Hip-Hop',
    language: 'ru',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[2],
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: 2680,
    likes: 1470,
    isTrending: false,
    summary: "Trap va klub musiqasining yorqin vakili bo'lgan mega-xit.",
    lyrics: [
      { original: "Эй, посмотри на этот новый стиль,", translation: "Ey, qara ushbu yangicha uslubga," },
      { original: "Мы покоряем тысячи дорог и миль.", translation: "Biz minglab yo'llar va masofalarni zabt etyapmiz." }
    ]
  },

  // ================= 36-50: DUNYOVA XORIJ (INGLIZCHA) MEGA XITLAR (O'ZBEKCHA TARJIMA BILAN) =================
  {
    id: 'en-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Electronic',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[3],
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: 4200,
    likes: 3100,
    isTrending: true,
    summary: "Billboard tarixidagi eng muvaffaqiyatli 80-yillar sint-pop uslubidagi super xit.",
    lyrics: [
      { original: "I've been on my own for long enough.", translation: "Men ancha vaqtdan beri yolg'iz qolib ketdim." },
      { original: "Maybe you can show me how to love, maybe.", translation: "Balki sen menga qanday sevishni o'rgatarsan, balki." },
      { original: "I'm blinded by the lights,", translation: "Ko'zni qamashtiruvchi chiroqlardan ko'r bo'lyapman," },
      { original: "No, I can't sleep until I feel your touch.", translation: "Yo'q, sening teginishingni his qilmaguncha uxlay olmayman." }
    ]
  },
  {
    id: 'en-2',
    title: 'Mockingbird',
    artist: 'Eminem',
    genre: 'Hip-Hop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[4],
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: 3890,
    likes: 2750,
    isTrending: true,
    summary: "Eminemning o'z qiziga atagan, dunyo bo'ylab millionlab odamlarni yig'latgan taronasi.",
    lyrics: [
      { original: "Yeah, I know sometimes things may not make sense to you right now.", translation: "Ha, bilaman, ba'zida hozir hamma narsa senga tushunarsiz tuyulishi mumkin." },
      { original: "Now hush, little baby, don't you cry.", translation: "Endi tinchlan, jajji go'dagim, yig'lama." },
      { original: "Everything's gonna be alright.", translation: "Hammasi yaxshi bo'ladi, xavotir olma." },
      { original: "Stiffen that upper lip up, little lady, I told ya.", translation: "O'zingni qo'lga ol, kichkintoy xonimim, senga aytgandimku." },
      { original: "Daddy's here to hold ya through the night.", translation: "Dadang tun bo'yi seni bag'riga bosib himoya qiladi." }
    ]
  },
  {
    id: 'en-3',
    title: 'Believer',
    artist: 'Imagine Dragons',
    genre: 'Rock',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[5],
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    plays: 3650,
    likes: 2450,
    isTrending: true,
    summary: "Qiyinchiliklar va og'riqlarni kuchga aylantirish haqidagi baquvvat madhiya.",
    lyrics: [
      { original: "First things first, I'ma say all the words inside my head.", translation: "Avvalo, miyamdagi barcha so'zlarni baralla aytib olaman." },
      { original: "I'm fired up and tired of the way that things have been.", translation: "Men g'azabdaman va narsalar avval qanday bo'lganidan charchadim." },
      { original: "Pain! You made me a, you made me a believer, believer!", translation: "Og'riq! Sen meni ishonuvchiga, o'z kuchiga iymon keltirganga aylantirding!" }
    ]
  },
  {
    id: 'en-4',
    title: 'Lovely',
    artist: 'Billie Eilish & Khalid',
    genre: 'Chill',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[6],
    cover_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80',
    plays: 3420,
    likes: 2280,
    isTrending: true,
    summary: "Nozik skripka sadosi va sokin ovozlar uyg'unligidagi go'zal asar.",
    lyrics: [
      { original: "Thought I found a way out, but you never go away.", translation: "Chiqish yo'lini topdim deb o'ylagandim, ammo sen hech ketmaysan." },
      { original: "Isn't it lovely, all alone? Heart made of glass, my mind of stone.", translation: "Yolg'iz qolish shunchalar go'zalmi? Yuragim shishadan, aqlim esa toshdan." }
    ]
  },
  {
    id: 'en-5',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'Rock',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[7],
    cover_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    plays: 4500,
    likes: 3300,
    isTrending: true,
    summary: "Rok musiqasi tarixidagi eng buyuk shoh asarlardan biri.",
    lyrics: [
      { original: "Is this the real life? Is this just fantasy?", translation: "Bu haqiqiy hayotmi? Yoki shunchaki shirin tushmi?" },
      { original: "Caught in a landslide, no escape from reality.", translation: "Ko'chki ostida qoldim, haqiqatdan qochib qutulish yo'q." },
      { original: "Open your eyes, look up to the skies and see.", translation: "Ko'zlaringni och, osmonga qara va o'zing ko'r." }
    ]
  },
  {
    id: 'en-6',
    title: 'In the End',
    artist: 'Linkin Park',
    genre: 'Rock',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[8],
    cover_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    plays: 3950,
    likes: 2600,
    isTrending: true,
    summary: "Chester Bennington vokalidagi afsonaviy alternativ rok.",
    lyrics: [
      { original: "It starts with one thing, I don't know why,", translation: "Barchasi bir narsadan boshlanadi, nega ekanini bilmayman," },
      { original: "It doesn't even matter how hard you try.", translation: "Qanchalik qattiq urinishingning hatto ahamiyati ham yo'q." },
      { original: "I tried so hard and got so far, but in the end, it doesn't even matter.", translation: "Men juda qattiq harakat qildim va uzoqqa yetdim, lekin oxir-oqibat, buning hech qanday ahamiyati yo'q." }
    ]
  },
  {
    id: 'en-7',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[9],
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    plays: 3100,
    likes: 1980,
    isTrending: false,
    summary: "Tarixiy ulug'vorlik, qirollar va hayot go'zalligi haqida shohona tarona.",
    lyrics: [
      { original: "I used to rule the world, seas would rise when I gave the word.", translation: "Bir paytlar men dunyoni boshqarardim, bir so'zim bilan dengizlar to'lqinlanardi." },
      { original: "Now in the morning I sleep alone, sweep the streets I used to own.", translation: "Endi tongda yolg'iz uyg'onaman, bir vaqtlar o'zimniki bo'lgan ko'chalarni supuraman." }
    ]
  },
  {
    id: 'en-8',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[10],
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    plays: 3250,
    likes: 2100,
    isTrending: false,
    summary: "Adele ning kuchli ovozi va yurakdan chiqqan dardi.",
    lyrics: [
      { original: "There's a fire starting in my heart,", translation: "Mening yuragimda bir alanga boshlanmoqda," },
      { original: "Reaching a fever pitch and it's bringing me out the dark.", translation: "Cho'qqisiga chiqib, meni zulmat qa'ridan olib chiqmoqda." }
    ]
  },
  {
    id: 'en-9',
    title: 'Time (Inception)',
    artist: 'Hans Zimmer',
    genre: 'Classic',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[11],
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    plays: 3700,
    likes: 2800,
    isTrending: true,
    summary: "Kino musiqasi daho bastakori Xans Zimmerning kosmik darajadagi simfonik asari.",
    lyrics: [
      { original: "Instrumental orchestral masterpiece.", translation: "Vaqt va tafakkur haqidagi so'zsiz simfonik durdona." }
    ]
  },
  {
    id: 'en-10',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[12],
    cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    plays: 4100,
    likes: 2900,
    isTrending: true,
    summary: "YouTube da milliardlab ko'rilgan jahon estrada madhiyasi.",
    lyrics: [
      { original: "The club isn't the best place to find a lover,", translation: "Klub sevgilimni topish uchun eng yaxshi joy emas," },
      { original: "So the bar is where I go.", translation: "Shuning uchun men sokin qahvaxonaga boraman." }
    ]
  },
  {
    id: 'en-11',
    title: 'Levitating',
    artist: 'Dua Lipa',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[13],
    cover_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80',
    plays: 2850,
    likes: 1750,
    isTrending: false,
    summary: "Yorqin disko-pop sadolari va kosmik energiya.",
    lyrics: [
      { original: "If you wanna run away with me, I know a galaxy.", translation: "Agar men bilan qochib ketmoqchi bo'lsang, men ajoyib galaktikani bilaman." }
    ]
  },
  {
    id: 'en-12',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[14],
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    plays: 4600,
    likes: 3450,
    isTrending: true,
    summary: "Pop qirolining afsonaviy xiti va oy yurishi (moonwalk) ritmi.",
    lyrics: [
      { original: "Billie Jean is not my lover, she's just a girl who claims that I am the one.", translation: "Billi Jin mening sevgilim emas, u shunchaki meni o'sha inson deb da'vo qilayotgan qiz." }
    ]
  },
  {
    id: 'en-13',
    title: 'Unstoppable',
    artist: 'Sia',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[15],
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays: 3500,
    likes: 2300,
    isTrending: true,
    summary: "Har qanday to'siqni yengib o'tishga undovchi kuchli motivatsion qo'shiq.",
    lyrics: [
      { original: "I'm unstoppable, I'm a Porsche with no brakes.", translation: "Meni to'xtatib bo'lmaydi, men tormozi yo'q Porsche avtomobiliman." },
      { original: "I'm invincible, yeah, I win every single game.", translation: "Men yengilmasman, ha, men har bitta o'yinda g'olib bo'laman." }
    ]
  },
  {
    id: 'en-14',
    title: 'Faded',
    artist: 'Alan Walker',
    genre: 'Electronic',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[0],
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    plays: 3900,
    likes: 2650,
    isTrending: true,
    summary: "Elektron musiqa olamidagi eng mashhur melodik xit.",
    lyrics: [
      { original: "Where are you now? Was it all in my fantasy?", translation: "Hozir qayerdasan sen? Barchasi mening xayolotim edimi?" },
      { original: "I'm faded, so lost, I'm faded.", translation: "Men g'oyib bo'ldim, sarsonman, yo'qolib boryapman." }
    ]
  },
  {
    id: 'en-15',
    title: 'Circles',
    artist: 'Post Malone',
    genre: 'Pop',
    language: 'en',
    hasTranslation: true,
    audio_url: SOUND_AUDIOS[1],
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    plays: 3150,
    likes: 2020,
    isTrending: false,
    summary: "Aylana bo'ylab davom etuvchi munosabatlar haqidagi chiroyli melodiya.",
    lyrics: [
      { original: "Seasons change and our love went cold,", translation: "Fasllar almashdi va sevgimiz sovuqlashdi," },
      { original: "Feed the flame 'cause we can't let go, run around in circles.", translation: "Olovni yoqamiz, chunki qo'yib yuborolmaymiz, aylanib yana bir joyda yuramiz." }
    ]
  }
];
