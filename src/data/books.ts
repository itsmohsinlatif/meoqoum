export type BookCategory = 'history' | 'language' | 'culture' | 'religion' | 'literature';
export type SourceType   = 'archive' | 'cloudinary' | 'pdf_url' | 'epub_url';

export interface Book {
  id: string;
  slug: string;
  title:  { en: string; ur: string; mew: string };
  author: string;
  year: number;
  language: ('en' | 'ur' | 'mew')[];
  category: BookCategory;
  description: { en: string; ur: string; mew: string };
  /** Cloudinary public_id, e.g.  meoqoum/covers/slug
   *  Upload your cover JPGs at: https://console.cloudinary.com */
  coverId: string | null;
  /** Fallback CSS gradient shown while cover loads or if coverId is null */
  coverGradient: string;
  source: {
    type: SourceType;
    /** archive.org identifier | Cloudinary raw public_id | full PDF URL */
    id: string;
  };
}

export const BOOKS: Book[] = [
  {
    id: '1',
    slug: 'tarikh-mewat',
    title: {
      en: 'Tārīkh-i-Mewāt — A History of Mewat',
      ur: 'تاریخِ میوات',
      mew: 'تواریخِ میوات',
    },
    author: 'Maulvi Zafar Ul-Islam Khan',
    year: 1993,
    language: ['ur'],
    category: 'history',
    description: {
      en: 'A comprehensive Urdu account of Mewat from its early Rajput roots through the Khanzada era, the 1857 revolt, and the Partition migrations of 1947.',
      ur: 'میوات کی جامع اردو تاریخ — ابتدائی راجپوت جڑوں سے لے کر خانزادہ دور، 1857 کی بغاوت، اور 1947 کی ہجرت تک۔',
      mew: 'میوات کی پوری تواریخ — پہلاں کے راجپوت دور سے لے کے خانزادہ، 1857 کی لڑائی اور 1947 کی ہجرت تک۔',
    },
    coverId: 'meoqoum/covers/tarikh-mewat',
    coverGradient: 'linear-gradient(135deg, #1a3a2a, #004225)',
    source: {
      type: 'archive',
      id: 'tarikh-i-mewat',
    },
  },
  {
    id: '2',
    slug: 'meos-of-mewat',
    title: {
      en: 'The Meos of Mewat: Old Neighbours in New Times',
      ur: 'میوات کے میو: نئے دور میں پرانے پڑوسی',
      mew: 'میوات کے میو: نئے دور میں پرانے پڑوسی',
    },
    author: 'Yoginder Sikand',
    year: 2004,
    language: ['en'],
    category: 'history',
    description: {
      en: 'An ethnographic and historical study of the Meo community — their religious identity, social organisation, relationship with the Tablighi Jamaat, and survival through Partition.',
      ur: 'میو قوم کا نسلیاتی و تاریخی مطالعہ — ان کی مذہبی شناخت، سماجی تنظیم، تبلیغی جماعت سے تعلق، اور تقسیم کے بعد بقاء۔',
      mew: 'میو قوم کی مکمل تاریخ — ان کو مذہب، سماج، تبلیغی جماعت سوں رشتہ، اور تقسیم کے بعد کی زندگی۔',
    },
    coverId: 'meoqoum/covers/meos-of-mewat',
    coverGradient: 'linear-gradient(135deg, #8a6a20, #5c4410)',
    source: {
      type: 'archive',
      id: 'meos-of-mewat-yoginder-sikand',
    },
  },
  {
    id: '3',
    slug: 'mewati-grammar',
    title: {
      en: 'A Grammar of the Mewati Language',
      ur: 'میواتی زبان کی گرامر',
      mew: 'میواتی بولی کی گرامر',
    },
    author: 'Community Editorial · Meo Qoum',
    year: 2024,
    language: ['en', 'ur', 'mew'],
    category: 'language',
    description: {
      en: 'A practical reference for learners and diaspora youth: phonology, script, verb conjugation, and how Mewati differs from standard Urdu — with example sentences in all three languages.',
      ur: 'سیکھنے والوں اور بیرونی نسل کے لیے عملی رہنما: صوتیات، رسم الخط، فعل کی گردان، اور میواتی کا اردو سے فرق — تینوں زبانوں میں مثالی جملوں کے ساتھ۔',
      mew: 'سیکھنے والاں اور باہر کے نوجوانوں کے لیے کام کی کتاب: آوازاں، لکھائی، فعل کی گردان، اور میواتی کو اردو سوں فرق — تیناں بولیاں میں مثالاں کے سنگ۔',
    },
    coverId: 'meoqoum/covers/mewati-grammar',
    coverGradient: 'linear-gradient(135deg, #2a4a5a, #1a3040)',
    source: {
      type: 'pdf_url',
      id: 'https://res.cloudinary.com/demo/raw/upload/meoqoum/books/mewati-grammar.pdf',
    },
  },
  {
    id: '4',
    slug: 'hasan-khan-mewati',
    title: {
      en: 'Hasan Khan Mewati — The Last Defender of Mewat',
      ur: 'حسن خان میواتی — میوات کا آخری محافظ',
      mew: 'حسن خان میواتی — میوات کو آخری محافظ',
    },
    author: 'Dr. R. P. Bahuguna',
    year: 1983,
    language: ['en'],
    category: 'history',
    description: {
      en: 'The definitive biography of Hasan Khan Mewati, the Khanzada ruler who allied with Rana Sanga against Babur at Khanwa (1527) and whose death sealed Mewat\'s fate under Mughal rule.',
      ur: 'حسن خان میواتی کی مکمل سوانح — خانزادہ حکمران جنہوں نے بابر کے خلاف رانا سانگا کا ساتھ دیا اور کھنوا (1527) میں شہادت پائی۔',
      mew: 'حسن خان میواتی کی پوری سوانح — خانزادہ حکمران جنہوں نے بابر کے خلاف رانا سانگا کو سنگ دیو اور کھنوا (1527) میں شہادت پائی۔',
    },
    coverId: 'meoqoum/covers/hasan-khan',
    coverGradient: 'linear-gradient(135deg, #4a1a1a, #2a0a0a)',
    source: {
      type: 'archive',
      id: 'hasan-khan-mewati-bahuguna',
    },
  },
  {
    id: '5',
    slug: 'mewati-qisse',
    title: {
      en: 'Mewati Qisse — Folk Tales of Mewat',
      ur: 'میواتی قصے',
      mew: 'میواتی قصہ',
    },
    author: 'Sayyid Mewati (ed.)',
    year: 2019,
    language: ['mew', 'ur'],
    category: 'literature',
    description: {
      en: 'A curated collection of oral folk tales (qisse) transcribed in Mewati script, with parallel Urdu translations — lullabies, hero legends, and seasonal harvest songs preserved by village elders.',
      ur: 'میواتی رسم الخط میں قلم بند زبانی روایتی قصوں کا مجموعہ، اردو ترجمے کے ساتھ — لوریاں، بہادروں کی داستانیں، اور بزرگوں کی یاد میں موسمی گیت۔',
      mew: 'میواتی لکھائی میں لکھے ہوئے زبانی قصاں کو مجموعو، اردو ترجمے کے سنگ — لوریاں، بہادراں کی داستاناں، اور بزرگاں کی یاد میں گیت۔',
    },
    coverId: 'meoqoum/covers/mewati-qisse',
    coverGradient: 'linear-gradient(135deg, #3a5a2a, #1a3010)',
    source: {
      type: 'archive',
      id: 'mewati-qisse-folk-tales',
    },
  },
  {
    id: '6',
    slug: 'mewat-gazetteer',
    title: {
      en: 'Gazetteer of the Gurgaon District — Mewat Sections',
      ur: 'ضلع گڑگاؤں کا گزیٹیئر — میواتی حصے',
      mew: 'گڑگاؤں ضلع کا گزیٹیئر — میواتی حصے',
    },
    author: 'Punjab Government (British India)',
    year: 1910,
    language: ['en'],
    category: 'history',
    description: {
      en: 'The British colonial district gazetteer for Gurgaon — public domain. The Mewat sections document village populations, gotra distributions, land tenure, and local customs as observed in the early 20th century.',
      ur: 'گڑگاؤں ضلع کا برطانوی نوآبادیاتی گزیٹیئر — پبلک ڈومین۔ میوات کے حصے گاؤں کی آبادی، گوتر کی تقسیم، زمین کی ملکیت اور مقامی رسم ورواج کی دستاویز ہیں۔',
      mew: 'گڑگاؤں کا برطانوی گزیٹیئر — پبلک ڈومین۔ میواتی حصے گاؤں کی آبادی، گوتر کی تقسیم، زمین اور رسم و رواج کی دستاویز ہاں۔',
    },
    coverId: 'meoqoum/covers/gurgaon-gazetteer',
    coverGradient: 'linear-gradient(135deg, #6a6a50, #4a4a30)',
    source: {
      type: 'archive',
      id: 'gazetteer-gurgaon-1910',
    },
  },
  {
    id: '7',
    slug: 'tabligh-movement',
    title: {
      en: 'The Tabligh Movement and the Meo',
      ur: 'تبلیغی تحریک اور میو',
      mew: 'تبلیغی تحریک اور میو',
    },
    author: 'Mumtaz Ahmad',
    year: 1991,
    language: ['en'],
    category: 'religion',
    description: {
      en: 'A scholarly account of how Maulana Muhammad Ilyas\'s Tablighi Jamaat took root in Mewat in the 1920s–30s, transforming the religious and social life of the Meo community.',
      ur: 'مولانا محمد الیاسؒ کی تبلیغی جماعت کا 1920-30 کی دہائی میں میوات میں آغاز، اور میو سماج کی مذہبی و سماجی زندگی پر اس کے اثرات کا علمی جائزہ۔',
      mew: 'مولانا محمد الیاسؒ کی تبلیغی جماعت کو 1920-30 کے دور میں میوات میں شروع ہونو، اور میو سماج کی زندگی پر اس کے اثراں کا جائزو۔',
    },
    coverId: 'meoqoum/covers/tabligh-meo',
    coverGradient: 'linear-gradient(135deg, #2a2a4a, #10102a)',
    source: {
      type: 'archive',
      id: 'tabligh-movement-meo-mumtaz-ahmad',
    },
  },
  {
    id: '8',
    slug: 'mewati-proverbs',
    title: {
      en: 'Mewati Proverbs & Sayings',
      ur: 'میواتی کہاوتیں اور محاورے',
      mew: 'میواتی کہاوتاں اور محاورے',
    },
    author: 'Community Collection · Meo Qoum',
    year: 2025,
    language: ['mew', 'ur', 'en'],
    category: 'language',
    description: {
      en: 'Over 400 proverbs, idioms and sayings in Mewati with Urdu and English translations — collected from elders across Nuh, Alwar and Bharatpur districts.',
      ur: '400 سے زائد میواتی کہاوتیں، محاورے اور مقولے — اردو اور انگریزی ترجمے کے ساتھ۔ نوح، الور اور بھرتپور کے بزرگوں سے جمع کیے گئے۔',
      mew: '400 سے زادو میواتی کہاوتاں، محاورے — اردو اور انگریزی ترجمے کے سنگ۔ نوح، الور اور بھرتپور کے بزرگاں سوں اکٹھی کری ہوئی۔',
    },
    coverId: 'meoqoum/covers/mewati-proverbs',
    coverGradient: 'linear-gradient(135deg, #5a3a1a, #3a2010)',
    source: {
      type: 'pdf_url',
      id: 'https://res.cloudinary.com/demo/raw/upload/meoqoum/books/mewati-proverbs.pdf',
    },
  },
];

export type { Book as BookType };
