export type Locale = 'en' | 'ur' | 'mew';
type L = { en: string; ur: string; mew: string };

/* Brand */
export const BRAND = {
  en: { name: 'Meo Pehchan', tag: 'Heritage of the Meo people' },
  ur: { name: 'میو پہچان', tag: 'میو قوم کی پہچان و وراثت' },
  mew: { name: 'میو پہچان', tag: 'میو قوم کی نج، ہمارو ورسو' },
};

/* Navigation */
export const NAV: Record<string, L> = {
  home:    { en: 'Home',      ur: 'صفحہ اول',  mew: 'گھر' },
  history: { en: 'History',   ur: 'تاریخ',      mew: 'تواریخ' },
  dir:     { en: 'Directory', ur: 'گوتر فہرست', mew: 'گوتر کی فیرست' },
  news:    { en: 'News',      ur: 'خبریں',      mew: 'خبراں' },
  library: { en: 'Library',   ur: 'کتب خانہ',   mew: 'کتاب گھر' },
  rishta:  { en: 'Rishta',    ur: 'رشتہ',       mew: 'رشتو' },
};

/* HOME */
export const HOME = {
  eyebrow: { en: 'Vision · Est. of Community', ur: 'نصب العین · کمیونٹی کا تعارف', mew: 'نظریو · سماج کی پچھان' } as L,
  hero: {
    en: ['A people of the land,', 'a memory of seven centuries.'],
    ur: ['زمین کی اولاد،', 'سات صدیوں کی یاد۔'],
    mew: ['دھرتی کا بیٹا،', 'سات صدیاں کی یاد۔'],
  },
  sub: {
    en: 'Meo Pehchan is a living archive of the Meo community of Mewat — our gotras, our histories, our mother tongue, and the families who carry them forward across India, Pakistan, and the diaspora.',
    ur: 'میو پہچان میوات کے میو سماج کا ایک زندہ آرکائیو ہے — ہماری گوتریں، ہماری تاریخ، ہماری ماں بولی، اور وہ خاندان جو اسے ہندوستان، پاکستان اور بیرونِ ملک آگے بڑھاتے ہیں۔',
    mew: 'میو پہچان میوات کا میو لوگاں کو جیتو جاگتو خزانو ہے — ہماری گوتراں، ہماری تواریخ، ہماری ماں بولی، اور وے گھر جو ہندوستان، پاکستان اور باہر کے دیساں میں اے سب کوں آگے لے کے چلے ہیں۔',
  } as L,
  ctaPrimary:   { en: 'Explore the Timeline', ur: 'تاریخی سفر دیکھیں', mew: 'تواریخ کی سیر کرو' } as L,
  ctaSecondary: { en: 'Find your Gotra',      ur: 'اپنی گوتر تلاش کریں', mew: 'اپنی گوتر ڈھونڈو' } as L,
  statsTitle:   { en: 'By the numbers',       ur: 'ایک نظر میں',         mew: 'ایک نظراں میں' } as L,
  stats: [
    { n: '13',    l: { en: 'Principal Pals',      ur: 'بڑی پالیں',    mew: 'بڑی پالاں' } as L },
    { n: '1,200+',l: { en: 'Mewati villages',     ur: 'میواتی گاؤں',  mew: 'میواتی گاؤں' } as L },
    { n: '7',     l: { en: 'Centuries on record', ur: 'صدیاں محفوظ',  mew: 'صدیاں سنبھالی' } as L },
    { n: '3',     l: { en: 'Languages preserved', ur: 'زبانیں محفوظ', mew: 'بولیاں سنبھالی' } as L },
  ],
  pillarsEyebrow: { en: 'Three Pillars', ur: 'تین ستون', mew: 'تین کھمب' } as L,
  pillarsTitle: {
    en: 'What we keep, what we share',
    ur: 'ہم کیا محفوظ رکھتے ہیں، کیا بانٹتے ہیں',
    mew: 'ہم کے سنبھالاں ہیں، کے بانٹاں ہیں',
  } as L,
  pillars: [
    {
      t: { en: 'Lineage', ur: 'نسب', mew: 'نسب' } as L,
      d: {
        en: 'Thirteen pals, fifty-two clans, thousands of family lines — mapped and searchable, with origin stories told by elders.',
        ur: 'تیرہ پالیں، باون قبیلے، ہزاروں خاندان — ایک نقشے میں، تلاش کے قابل، اور بزرگوں کی زبانی روایات کے ساتھ۔',
        mew: 'تیرہ پالاں، باون خاندان، ہزاراں گھر — ایک نقشے میں، ڈھونڈنے جوگو، بزرگاں کی کہی ہوئی باتاں کے سنگ۔',
      } as L,
    },
    {
      t: { en: 'Memory', ur: 'یاد', mew: 'یاد' } as L,
      d: {
        en: 'From the Khanzada conversion era to the partition crossings of 1947 — first-person testimonies, photographs, and documents in one place.',
        ur: 'خانزادہ دور سے لے کر 1947 کی ہجرت تک — عینی شہادات، تصاویر، اور دستاویزات ایک جگہ۔',
        mew: 'خانزادہ دور سے لے کے 1947 کی ہجرت تک — اپنی آنکھاں سے دیکھنے والاں کی باتاں، تصویراں، اور کاغذ ایک ہی جگہ۔',
      } as L,
    },
    {
      t: { en: 'Mother Tongue', ur: 'ماں بولی', mew: 'ماں بولی' } as L,
      d: {
        en: 'Mewati lullabies, proverbs, qissas and panchayat records — preserved in script, audio, and the living voice of our elders.',
        ur: 'میواتی لوریاں، کہاوتیں، قصے اور پنچایتی روایات — تحریر، آواز اور بزرگوں کی زبان میں محفوظ۔',
        mew: 'میواتی لوریاں، کہاوتاں، قصہ اور پنچائتی روایتاں — لکھی، بولی، اور بزرگاں کی آواز میں سنبھالی۔',
      } as L,
    },
  ],
  featuredEyebrow: { en: 'From the Archive', ur: 'آرکائیو سے', mew: 'خزانے سے' } as L,
  featuredTitle: {
    en: 'Stories worth carrying forward',
    ur: 'وہ کہانیاں جو آگے لے جانے کے لائق ہیں',
    mew: 'وے کہانیاں جو آگے لے جان کے قابل ہاں',
  } as L,
  viewArchive: { en: 'View archive', ur: 'پورا آرکائیو', mew: 'پورو خزانو' } as L,
};

/* HISTORY */
export const HISTORY = {
  eyebrow: { en: 'Interactive Timeline', ur: 'متحرک تاریخی سفر', mew: 'چلتی پھرتی تواریخ' } as L,
  title:   { en: 'Seven centuries of the Meo people', ur: 'میو قوم کی سات صدیاں', mew: 'میو لوگاں کی سات صدیاں' } as L,
  sub: {
    en: 'Drag along the timeline. Each chapter pairs the canonical record with the voices of those who lived it.',
    ur: 'ٹائم لائن پر گھومیں۔ ہر باب میں دستاویزی روایت کے ساتھ ان لوگوں کی آوازیں ہیں جنہوں نے یہ دور جیا۔',
    mew: 'ٹائم لائن پر گھمو۔ ہر باب میں لکھی ہوئی بات کے سنگ اوناں کی آواز ہے جناں نے یو دور جیو۔',
  } as L,
  allChapters:  { en: 'All Chapters',  ur: 'تمام ابواب',   mew: 'سارے باب' } as L,
  prevEra:      { en: 'Previous era',  ur: 'پچھلا دور',    mew: 'پچھلو دور' } as L,
  nextEra:      { en: 'Next era',      ur: 'اگلا دور',     mew: 'اگلو دور' } as L,
  chapterOf: (n: number, total: number, locale: Locale) =>
    locale === 'en' ? `Chapter ${n} of ${total}` : `باب ${n} از ${total}`,
  eras: [
    {
      year: 'c. 1300',
      t: { en: 'Origins in Mewat', ur: 'میوات میں ابتدا', mew: 'میوات میں شروعات' } as L,
      d: {
        en: 'The Meo emerge across the Aravalli ranges — Rajput-descended cultivators settled in the broken country between Delhi, Alwar, and Bharatpur.',
        ur: 'میو اراولی کے سلسلوں میں نمودار ہوتے ہیں — راجپوت النسل کسان جو دہلی، الور اور بھرتپور کے درمیان آباد ہوئے۔',
        mew: 'میو اراولی کی پہاڑیاں میں نکل کے آئے — راجپوت گھرانے کے کسان جو دلی، الور اور بھرتپور کے بیچ بسے۔',
      } as L,
    },
    {
      year: '1372',
      t: { en: 'Khanzada era begins', ur: 'خانزادہ دور کا آغاز', mew: 'خانزادہ دور کی شروعات' } as L,
      d: {
        en: 'Raja Lakhan Pal converts and takes the title Bahadur Khan; Mewat becomes a frontier kingdom owing nominal allegiance to Delhi.',
        ur: 'راجہ لکھن پال اسلام قبول کرتے ہیں اور بہادر خان کا لقب پاتے ہیں؛ میوات دہلی کا ایک سرحدی نوابی خطہ بنتا ہے۔',
        mew: 'راجہ لکھن پال نے اسلام قبول کیو اور بہادر خان نام دھرو؛ میوات دلی کے زیر سایہ ایک سرحدی ریاست بنی۔',
      } as L,
    },
    {
      year: '1527',
      t: { en: 'Battle of Khanwa', ur: 'جنگِ کھنوا', mew: 'کھنوا کی جنگ' } as L,
      d: {
        en: 'Hasan Khan Mewati falls fighting alongside Rana Sanga against Babur — a defining loss that folds Mewat into the Mughal map.',
        ur: 'حسن خان میواتی رانا سانگا کے شانہ بشانہ بابر کے خلاف لڑتے ہوئے شہید ہوئے — وہ شکست جس نے میوات کو مغل نقشے میں شامل کر دیا۔',
        mew: 'حسن خان میواتی رانا سانگا کے سنگ بابر سوں لڑتاں شہید ہوئے — وا شکست جس نے میوات کوں مغلاں کے نقشے میں شامل کر دیو۔',
      } as L,
    },
    {
      year: '1857',
      t: { en: 'The Great Revolt', ur: 'غدر — جنگِ آزادی', mew: 'غدر — آزادی کی جنگ' } as L,
      d: {
        en: 'Meo villages across Mewat rise against the Company. Punishing reprisals follow; oral histories of this year still shape Meo memory.',
        ur: 'میوات بھر کے میو گاؤں کمپنی کے خلاف اٹھ کھڑے ہوتے ہیں۔ سخت سزائیں ملتی ہیں؛ اس سال کی روایات آج بھی میو حافظے میں زندہ ہیں۔',
        mew: 'میوات کے میو گاؤں کمپنی سوں اٹھ کھڑے ہوئے۔ سخت سزائیں ملیں؛ وے باتاں آج بھی میو لوگاں کی یاد میں زندہ ہاں۔',
      } as L,
    },
    {
      year: '1947',
      t: { en: 'Partition & migration', ur: 'تقسیم و ہجرت', mew: 'تقسیم اور ہجرت' } as L,
      d: {
        en: 'Roughly half the Meo population crosses to Pakistan. Those who remain regroup under the leadership of Maulana Ilyas and the Tablighi movement.',
        ur: 'تقریباً نصف میو آبادی پاکستان ہجرت کرتی ہے۔ جو رہ گئے وہ مولانا الیاسؒ اور تبلیغی تحریک کی رہنمائی میں اکٹھے ہوئے۔',
        mew: 'تقریباً آدھی میو آبادی پاکستان گئی۔ جو رہی، وہ مولانا الیاسؒ اور تبلیغی جماعت کے سنگ پھر سے اکٹھی ہوئی۔',
      } as L,
    },
    {
      year: '1995',
      t: { en: 'Mewati pride revival', ur: 'میواتی شناخت کی نشاۃِ ثانیہ', mew: 'میواتی پچھان کو دوبارو اٹھان' } as L,
      d: {
        en: 'A generation of poets, panchayat leaders and educators reclaim Mewati as a written language. Folk archives and qissa collections begin.',
        ur: 'شعراء، پنچایتی رہنماؤں اور اساتذہ کی ایک نسل میواتی کو ایک تحریری زبان کے طور پر دوبارہ زندہ کرتی ہے۔ لوک ادب اور قصوں کے ذخیرے بنتے ہیں۔',
        mew: 'شاعراں، پنچائتی بزرگاں اور ماستراں کی ایک نسل میواتی کوں لکھی ہوئی بولی بنا دیو۔ لوک گیت اور قصہ سنبھالنے لگے۔',
      } as L,
    },
    {
      year: 'Today',
      t: { en: 'A digital Pehchan', ur: 'ڈیجیٹل پہچان', mew: 'ڈیجیٹل پچھان' } as L,
      d: {
        en: 'Meo Pehchan goes online — a community-edited archive of gotras, families, voices, and the everyday life of Mewat across borders.',
        ur: 'میو پہچان آن لائن — گوتروں، خاندانوں، آوازوں، اور سرحدوں کے پار میواتی روزمرہ کا ایک کمیونٹی آرکائیو۔',
        mew: 'میو پہچان آن لائن — گوتراں، گھراں، آوازاں، اور سرحداں کے پار میواتی روزمرہ کو سماج کا اپنو خزانو۔',
      } as L,
    },
  ],
};

/* DIRECTORY */
export const DIR = {
  eyebrow: { en: 'Searchable Directory', ur: 'تلاش کے قابل فہرست', mew: 'ڈھونڈنے جوگی فیرست' } as L,
  title:   { en: 'The Thirteen Pals',     ur: 'تیرہ پالیں',          mew: 'تیرہ پالاں' } as L,
  sub: {
    en: 'The Meo are organised into thirteen pals and fifty-two gotras, classified across three vansh lineages — Agnivanshi, Chandravanshi, and Surajvanshi.',
    ur: 'میو تیرہ پالوں اور باون گوتروں میں منظم ہیں، تین ونش کے مطابق — اگنی ونش، چندر ونش، اور سورج ونش۔',
    mew: 'میو تیرہ پالاں اور باون گوتراں میں بٹے ہاں، تین ونش کے مطابق — اگنی ونش، چندر ونش، اور سورج ونش۔',
  } as L,
  searchPh: {
    en: 'Search by gotra, clan, village or region…',
    ur: 'گوتر، قبیلہ، گاؤں یا علاقے سے تلاش کریں…',
    mew: 'گوتر، خاندان، گاؤں یا علاقہ سوں ڈھونڈو…',
  } as L,
  searchBtn: { en: 'Search', ur: 'تلاش', mew: 'ڈھونڈو' } as L,
  filters: {
    all:    { en: 'All Gotras', ur: 'تمام',       mew: 'ساری' } as L,
    region: { en: 'By Region',  ur: 'علاقے سے',   mew: 'علاقے سوں' } as L,
    era:    { en: 'By Era',     ur: 'دور سے',     mew: 'دور سوں' } as L,
  },
  shownLabel: (n: number, locale: Locale) =>
    locale === 'en' ? `${n} gotras shown` :
    locale === 'ur' ? `${n} گوتریں دکھائی گئیں` :
    `${n} گوتراں دکھائی`,
  field: {
    clans:    { en: 'Clans',        ur: 'قبیلے',        mew: 'خاندان' } as L,
    villages: { en: 'Villages',     ur: 'گاؤں',         mew: 'گاؤں' } as L,
    era:      { en: 'Founded',      ur: 'آباد',         mew: 'آباد' } as L,
    region:   { en: 'Region',       ur: 'علاقہ',        mew: 'علاقو' } as L,
    explore:  { en: 'Origin Story', ur: 'روایت پڑھیں', mew: 'کہانی پڑھو' } as L,
  },
  /* 13 Pals as classified by Rana Kaku Balot Meo (13th century).
     Vansh: A=Agnivanshi, C=Chandravanshi, S=Surajvanshi */
  list: [
    { name: 'Demrot',    urdu: 'ڈَیمروٹ',    vansh: 'S·Jado',   region: { en: 'Alwar–Tijara',       ur: 'الور–تیجارہ',      mew: 'الور–تیجارہ'      } as L, clans: 42, villages: 118, era: { en: 'Pre-1300',  ur: '1300 سے پہلے', mew: '1300 سوں پہلاں' } as L },
    { name: 'Poonglot',  urdu: 'پُونگلوٹ',   vansh: 'S·Jado',   region: { en: 'Firozpur–Jhirka',    ur: 'فیروزپور–جھرکا',   mew: 'فیروزپور–جھرکا'   } as L, clans: 38, villages: 96,  era: { en: 'Pre-1300',  ur: '1300 سے پہلے', mew: '1300 سوں پہلاں' } as L },
    { name: 'Balot',     urdu: 'بَلوٹ',      vansh: 'S·Jado',   region: { en: 'Nuh–Nagina',         ur: 'نوح–ناگینہ',       mew: 'نوح–ناگینہ'       } as L, clans: 31, villages: 87,  era: { en: '1300–1400', ur: '1300–1400',    mew: '1300–1400'      } as L },
    { name: 'Ratwat',    urdu: 'رَتواٹ',     vansh: 'C·Chauhan', region: { en: 'Bharatpur–Kaman',    ur: 'بھرتپور–کامان',    mew: 'بھرتپور–کامان'    } as L, clans: 27, villages: 74,  era: { en: '1300–1400', ur: '1300–1400',    mew: '1300–1400'      } as L },
    { name: 'Sengal',    urdu: 'سِنگال',     vansh: 'C·Chauhan', region: { en: 'Tijara plateau',     ur: 'تیجارہ پٹھار',     mew: 'تیجارہ پٹھار'     } as L, clans: 24, villages: 68,  era: { en: '1400–1500', ur: '1400–1500',    mew: '1400–1500'      } as L },
    { name: 'Dulot',     urdu: 'دُلوٹ',      vansh: 'S·Jado',   region: { en: 'Sohna–Tauru',        ur: 'سوہنا–تاؤرو',      mew: 'سوہنا–تاؤرو'      } as L, clans: 22, villages: 61,  era: { en: '1400–1500', ur: '1400–1500',    mew: '1400–1500'      } as L },
    { name: 'Nai',       urdu: 'نَئی',       vansh: 'Agnivanshi',region: { en: 'Punahana–Ferozepur', ur: 'پنہانہ–فیروزپور',  mew: 'پنہانہ–فیروزپور'  } as L, clans: 19, villages: 54,  era: { en: '1400–1500', ur: '1400–1500',    mew: '1400–1500'      } as L },
    { name: 'Lundawat',  urdu: 'لُنداوَت',   vansh: 'S·Jado',   region: { en: 'Hodal–Hathin',       ur: 'ہودل–ہتھین',       mew: 'ہودل–ہتھین'       } as L, clans: 18, villages: 49,  era: { en: '1500–1600', ur: '1500–1600',    mew: '1500–1600'      } as L },
    { name: 'Chhirkalot',urdu: 'چِھرکلوٹ',  vansh: 'S·Jado',   region: { en: 'Kotla–Pinangwan',    ur: 'کوٹلہ–پنگوان',     mew: 'کوٹلہ–پنگوان'     } as L, clans: 17, villages: 44,  era: { en: '1500–1600', ur: '1500–1600',    mew: '1500–1600'      } as L },
    { name: 'Dhengal',   urdu: 'ڈھینگل',    vansh: 'Agnivanshi',region: { en: 'Ferozepur Namak',    ur: 'فیروزپور نمک',     mew: 'فیروزپور نمک'     } as L, clans: 15, villages: 41,  era: { en: '1600–1700', ur: '1600–1700',    mew: '1600–1700'      } as L },
    { name: 'Kalisa',    urdu: 'کَلیسا',     vansh: 'C·Chauhan', region: { en: 'Mahendragarh',       ur: 'مہندرگڑھ',         mew: 'مہندرگڑھ'         } as L, clans: 13, villages: 36,  era: { en: '1600–1700', ur: '1600–1700',    mew: '1600–1700'      } as L },
    { name: 'Dedwal',    urdu: 'دیدوال',     vansh: 'S·Tomar',  region: { en: 'Alwar–Rewari belt',  ur: 'الور–ریواڑی پٹی',  mew: 'الور–ریواڑی پٹی'  } as L, clans: 12, villages: 33,  era: { en: '1700–1800', ur: '1700–1800',    mew: '1700–1800'      } as L },
    { name: 'Pahat',     urdu: 'پاہَت',      vansh: 'S·Tomar',  region: { en: 'Hilly Mewat fringe', ur: 'پہاڑی میوات',      mew: 'پہاڑی میوات'      } as L, clans: 8,  villages: 22,  era: { en: '1700–1800', ur: '1700–1800',    mew: '1700–1800'      } as L },
  ],
};

/* NEWS */
export const NEWS = {
  eyebrow:     { en: 'News & Notices',               ur: 'خبریں و اعلانات',    mew: 'خبراں اور اعلان' } as L,
  title:       { en: 'From across Mewat and beyond', ur: 'میوات اور باہر سے',   mew: 'میوات اور باہر سوں' } as L,
  sub:         { en: 'Community announcements pinned at top. Editorial below.', ur: 'اوپر کمیونٹی اعلانات۔ نیچے ادارتی مضامین۔', mew: 'اوپر سماج کے اعلان۔ نیچے ادارتی لیکھ۔' } as L,
  pinnedTitle: { en: 'Community Board',  ur: 'کمیونٹی بورڈ',   mew: 'سماج کو بورڈ' } as L,
  feedTitle:   { en: 'Long Reads',       ur: 'تفصیلی مضامین', mew: 'لمبے لیکھ' } as L,
  readBtn:     { en: 'Read', ur: 'پڑھیں', mew: 'پڑھو' } as L,
  pinned: [
    {
      kind: { en: 'Gathering', ur: 'اجتماع', mew: 'اکٹّھ' } as L,
      date: '12 Shawwal · May 24',
      t: { en: 'Annual Mewat Sahitya Sammelan — Nuh, 24 May', ur: 'سالانہ میوات ادبی اجتماع — نوح، 24 مئی', mew: 'سالانو میوات ادبی اجتماع — نوح، 24 مئی' } as L,
      place: { en: 'Nuh, Haryana', ur: 'نوح، ہریانہ', mew: 'نوح، ہریانہ' } as L,
    },
    {
      kind: { en: 'Obituary', ur: 'وفات', mew: 'وفات' } as L,
      date: '8 Shawwal · May 20',
      t: { en: 'Chaudhary Yasin Khan Daimrot of Tijara — passed at 84', ur: 'چودھری یاسین خان ڈَیمروٹ تیجارہ — 84 برس کی عمر میں رحلت', mew: 'چودھری یاسین خان ڈَیمروٹ تیجارہ — 84 سال کی عمر میں چل بسے' } as L,
      place: { en: 'Tijara, Alwar', ur: 'تیجارہ، الور', mew: 'تیجارہ، الور' } as L,
    },
    {
      kind: { en: 'Wedding', ur: 'شادی', mew: 'بیاہ' } as L,
      date: '1 Shawwal · May 13',
      t: { en: 'Nikah of Bilal Pundlot & Ayesha Ratawat', ur: 'بلال پنڈلوٹ و عائشہ رتاوت کا نکاح', mew: 'بلال پنڈلوٹ اور عائشہ رتاوت کو نکاح' } as L,
      place: { en: 'Punahana', ur: 'پنہانہ', mew: 'پنہانہ' } as L,
    },
    {
      kind: { en: 'Notice', ur: 'اعلان', mew: 'اعلان' } as L,
      date: 'Ongoing',
      t: { en: 'Submit family photographs for the 1947 oral-history project', ur: '1947 کی زبانی تاریخ کے منصوبے کے لیے خاندانی تصاویر بھیجیں', mew: '1947 کی زبانی تواریخ کے منصوبے کے لیے گھر کی تصویراں بھیجو' } as L,
      place: { en: 'Open call', ur: 'دعوتِ عام', mew: 'سب کے لیے' } as L,
    },
  ],
  feed: [
    {
      cat:    { en: 'Lineage', ur: 'نسب', mew: 'نسب' } as L,
      date:   'April 28, 2026',
      t:      { en: 'How the Daimrot of Alwar trace their line to the pre-Khanzada era', ur: 'الور کے ڈَیمروٹ اپنا نسب خانزادہ سے پہلے کے دور تک کیسے جوڑتے ہیں', mew: 'الور کے ڈَیمروٹ اپنو نسب خانزادہ سوں پہلاں کے دور تک کیسے جوڑاں ہاں' } as L,
      ex:     { en: 'Three panchayat manuscripts, a tax-roll fragment, and a family memoir converge on a single Aravalli village.', ur: 'تین پنچایتی نسخے، ایک پرانا محصول کا کاغذ، اور ایک خاندانی یادداشت — سب ایک ہی اراولی گاؤں پر آ ٹھہرتے ہیں۔', mew: 'تین پنچائتی کتاب، ایک پرانو محصول کو کاغذ، اور ایک گھر کی یادداشت — سب ایک ہی اراولی گاؤں پر آ کے رکاں۔' } as L,
      author: 'Dr. R. Khan',
      read:   { en: '12 min read', ur: '12 منٹ', mew: '12 منٹ' } as L,
    },
    {
      cat:    { en: 'Memory', ur: 'یاد', mew: 'یاد' } as L,
      date:   'April 22, 2026',
      t:      { en: "Crossings of '47: voices from both sides of the line", ur: '47 کی ہجرت: سرحد کے دونوں طرف سے آوازیں', mew: '47 کی ہجرت: سرحد کے دوناں اور سوں آوازاں' } as L,
      ex:     { en: 'An oral-history project gathers eight families separated by partition and brings their accounts into one record.', ur: 'ایک زبانی تاریخ کا منصوبہ تقسیم سے بچھڑے آٹھ خاندانوں کی روایات کو ایک ریکارڈ میں جمع کرتا ہے۔', mew: 'ایک زبانی تواریخ کو منصوبو تقسیم سوں بچھڑے آٹھ گھراں کی باتاں کوں ایک کاغذ میں جمع کراں ہے۔' } as L,
      author: 'S. Mewati',
      read:   { en: '9 min read', ur: '9 منٹ', mew: '9 منٹ' } as L,
    },
    {
      cat:    { en: 'Language', ur: 'زبان', mew: 'بولی' } as L,
      date:   'April 14, 2026',
      t:      { en: "Reading Mewati: a beginner's guide for diaspora youth", ur: 'میواتی پڑھنا: بیرونِ ملک نوجوانوں کے لیے ابتدائی رہنما', mew: 'میواتی پڑھنو: باہر بسے نوجوانوں کے لیے شروعاتی کتاب' } as L,
      ex:     { en: 'Twelve sounds, three vowels, and a handful of grammatical quirks separate Mewati from Urdu — here is the full map.', ur: 'بارہ آوازیں، تین مصوتے، اور چند نحوی فرق میواتی کو اردو سے الگ کرتے ہیں — مکمل نقشہ یہاں ہے۔', mew: 'بارہ آوازاں، تین مصوتے، اور چند گرامر کے فرق میواتی کوں اردو سوں الگ کراں ہاں — پورو نقشو یہاں ہے۔' } as L,
      author: 'Maulvi A. Mev',
      read:   { en: '7 min read', ur: '7 منٹ', mew: '7 منٹ' } as L,
    },
  ],
};

/* LIBRARY */
export const LIBRARY = {
  eyebrow:   { en: 'Digital Library',             ur: 'ڈیجیٹل کتب خانہ',         mew: 'ڈیجیٹل کتاب گھر'       } as L,
  title:     { en: 'Books of Mewat',              ur: 'میوات کی کتابیں',          mew: 'میوات کی کتاباں'        } as L,
  sub: {
    en: 'Histories, manuscripts, poetry and language guides — read free in your browser.',
    ur: 'تاریخیں، نسخے، شاعری اور زبان کے رہنما — براؤزر میں مفت پڑھیں۔',
    mew: 'تواریخ، نسخے، شاعری اور بولی کی کتاباں — براؤزر میں مفت پڑھو۔',
  } as L,
  searchPh: {
    en: 'Search books, authors, topics…',
    ur: 'کتاب، مصنف، موضوع سے تلاش کریں…',
    mew: 'کتاب، لکھاری، موضوع سوں ڈھونڈو…',
  } as L,
  filters: {
    all:         { en: 'All',        ur: 'سب',         mew: 'سب'      } as L,
    history:     { en: 'History',    ur: 'تاریخ',       mew: 'تواریخ'  } as L,
    language:    { en: 'Language',   ur: 'زبان',        mew: 'بولی'    } as L,
    culture:     { en: 'Culture',    ur: 'ثقافت',       mew: 'تہذیب'   } as L,
    religion:    { en: 'Religion',   ur: 'دین',         mew: 'دین'     } as L,
    literature:  { en: 'Literature', ur: 'ادب',         mew: 'ادب'     } as L,
  },
  readBtn:   { en: 'Read',       ur: 'پڑھیں',    mew: 'پڑھو'   } as L,
  closeBtn:  { en: 'Close',      ur: 'بند کریں', mew: 'بند کرو' } as L,
  by:        { en: 'by',         ur: '—',         mew: '—'       } as L,
  noResults: {
    en: 'No books match your search.',
    ur: 'کوئی کتاب نہیں ملی۔',
    mew: 'کوئی کتاب نہیں ملی۔',
  } as L,
};

/* JOIN — member registration */
export const JOIN = {
  eyebrow: { en: 'Become a Member',       ur: 'ممبر بنیں',         mew: 'ممبر بنو'         } as L,
  title:   { en: 'Join Meo Pehchan',      ur: 'میو پہچان سے جڑیں', mew: 'میو پہچان سوں جڑو'} as L,
  sub: {
    en: 'Create your community profile — find your gotra relatives, access the Rishta directory, and help preserve Meo heritage.',
    ur: 'اپنی کمیونٹی پروفائل بنائیں — گوتر رشتہ داروں کو تلاش کریں، رشتہ ڈائریکٹری تک رسائی پائیں، اور میو ورثے کو محفوظ رکھنے میں مدد کریں۔',
    mew: 'اپنی کمیونٹی پروفائل بناؤ — گوتر رشتہ داراں کوں ڈھونڈو، رشتہ ڈائریکٹری تک پہنچو، اور میو ورثے کوں سنبھالنے میں مدد کرو۔',
  } as L,
  /* section headings */
  s1: { en: 'Personal Information',   ur: 'ذاتی معلومات',         mew: 'ذاتی معلومات'     } as L,
  s2: { en: 'Heritage & Lineage',     ur: 'وراثت اور نسب',        mew: 'ورسو اور نسب'     } as L,
  s3: { en: 'Education & Profession', ur: 'تعلیم اور پیشہ',       mew: 'تعلیم اور پیشو'   } as L,
  s4: { en: 'Location & Contact',     ur: 'مقام اور رابطہ',       mew: 'مقام اور رابطہ'   } as L,
  s5: { en: 'Account Setup',          ur: 'اکاؤنٹ بنائیں',        mew: 'اکاؤنٹ بناؤ'      } as L,
  s6: { en: 'Profile Picture',        ur: 'پروفائل تصویر',        mew: 'پروفائل تصویر'     } as L,
  /* labels */
  firstName:     { en: 'First Name *',        ur: 'پہلا نام *',             mew: 'پہلو نام *'           } as L,
  lastName:      { en: 'Last Name *',         ur: 'آخری نام *',             mew: 'آخری نام *'           } as L,
  fatherName:    { en: "Father's Name *",     ur: 'والد کا نام *',           mew: 'ابا کو نام *'          } as L,
  dob:           { en: 'Date of Birth *',     ur: 'تاریخ پیدائش *',         mew: 'پیدائش کی تاریخ *'     } as L,
  gender:        { en: 'Gender *',            ur: 'جنس *',                  mew: 'جنس *'                } as L,
  male:          { en: 'Male',                ur: 'مرد',                    mew: 'مرد'                  } as L,
  female:        { en: 'Female',              ur: 'عورت',                   mew: 'عورت'                 } as L,
  maritalStatus: { en: 'Marital Status *',    ur: 'ازدواجی حیثیت *',        mew: 'ازدواجی حالت *'        } as L,
  pal:           { en: 'Pal (Clan) *',        ur: 'پال (قبیلہ) *',           mew: 'پال (قبیلہ) *'         } as L,
  gotra:         { en: 'Gotra *',             ur: 'گوتر *',                 mew: 'گوتر *'               } as L,
  village:       { en: 'Ancestral Village (Pichla Gaoon)', ur: 'پچھلا گاؤں (ہندوستان)', mew: 'پچھلو گاؤں (ہندوستان)' } as L,
  education:     { en: 'Education Level *',   ur: 'تعلیمی سطح *',           mew: 'تعلیم کی سطح *'        } as L,
  eduField:      { en: 'Field of Education',  ur: 'تعلیم کا میدان',          mew: 'تعلیم کو میدان'        } as L,
  profession:    { en: 'Profession',          ur: 'پیشہ',                   mew: 'پیشو'                 } as L,
  bloodGroup:    { en: 'Blood Group',         ur: 'خون کا گروپ',             mew: 'خون کو گروپ'           } as L,
  cnic:          { en: 'CNIC / ID Number *',  ur: 'شناختی کارڈ نمبر *',     mew: 'شناختی کارڈ نمبر *'   } as L,
  permAddr:      { en: 'Permanent Address *', ur: 'مستقل پتہ *',             mew: 'مستقل پتہ *'           } as L,
  currAddr:      { en: 'Current Address',     ur: 'موجودہ پتہ',              mew: 'موجودہ پتہ'            } as L,
  country:       { en: 'Country *',           ur: 'ملک *',                  mew: 'ملک *'                } as L,
  province:      { en: 'Province / State',    ur: 'صوبہ / ریاست',           mew: 'صوبہ / ریاست'         } as L,
  city:          { en: 'City *',              ur: 'شہر *',                  mew: 'شہر *'                } as L,
  email:         { en: 'Email ID (Login) *',  ur: 'ای میل (لاگ ان) *',      mew: 'ای میل (لاگ ان) *'    } as L,
  contact:       { en: 'Contact Number',      ur: 'رابطہ نمبر',              mew: 'رابطہ نمبر'            } as L,
  password:      { en: 'Password *',          ur: 'پاس ورڈ *',              mew: 'پاس ورڈ *'             } as L,
  confirmPass:   { en: 'Confirm Password *',  ur: 'پاس ورڈ دوبارہ *',       mew: 'پاس ورڈ دوبارہ *'      } as L,
  uploadPic:     { en: 'Upload Photo',        ur: 'تصویر اپ لوڈ کریں',      mew: 'تصویر اپ لوڈ کرو'     } as L,
  selectOption:  { en: 'Select…',             ur: 'انتخاب کریں…',            mew: 'چُنو…'                 } as L,
  submitBtn:     { en: 'Create My Account',   ur: 'میرا اکاؤنٹ بنائیں',     mew: 'میرو اکاؤنٹ بناؤ'     } as L,
  alreadyMember: { en: 'Already a member?',   ur: 'پہلے سے ممبر ہیں؟',      mew: 'پہلاں سے ممبر ہو؟'    } as L,
  loginLink:     { en: 'Log in',              ur: 'لاگ ان کریں',            mew: 'لاگ ان کرو'           } as L,
  successTitle:  { en: 'Welcome to Meo Pehchan!', ur: 'میو پہچان میں خوش آمدید!', mew: 'میو پہچان میں خوش آمدید!' } as L,
  successSub: {
    en: 'Your account has been created. Check your email to verify, then log in.',
    ur: 'آپ کا اکاؤنٹ بن گیا ہے۔ ای میل چیک کریں اور پھر لاگ ان کریں۔',
    mew: 'تمہارو اکاؤنٹ بن گئو۔ ای میل چیک کرو اور پھر لاگ ان کرو۔',
  } as L,
};

/* LOGIN */
export const LOGIN = {
  eyebrow:    { en: 'Member Login',          ur: 'ممبر لاگ ان',           mew: 'ممبر لاگ ان'          } as L,
  title:      { en: 'Welcome back',          ur: 'خوش آمدید واپس',        mew: 'واپس خوش آمدید'       } as L,
  email:      { en: 'Email Address',         ur: 'ای میل',                mew: 'ای میل'               } as L,
  password:   { en: 'Password',             ur: 'پاس ورڈ',               mew: 'پاس ورڈ'              } as L,
  loginBtn:   { en: 'Log In',               ur: 'لاگ ان',                mew: 'لاگ ان'               } as L,
  noAccount:  { en: "Don't have an account?", ur: 'اکاؤنٹ نہیں ہے؟',     mew: 'اکاؤنٹ نہیں ہے؟'      } as L,
  joinLink:   { en: 'Join now',             ur: 'ابھی جڑیں',             mew: 'ابھی جڑو'             } as L,
  errorMsg:   { en: 'Invalid email or password.', ur: 'غلط ای میل یا پاس ورڈ۔', mew: 'غلط ای میل یا پاس ورڈ۔' } as L,
};

/* RISHTA — marriage matching */
export const RISHTA = {
  eyebrow:      { en: 'Rishta Directory',          ur: 'رشتہ ڈائریکٹری',         mew: 'رشتہ ڈائریکٹری'          } as L,
  title:        { en: 'Find a Match',               ur: 'رشتہ تلاش کریں',         mew: 'رشتو ڈھونڈو'              } as L,
  sub: {
    en: 'Verified Meo community profiles — filter by pal, education, country and more.',
    ur: 'تصدیق شدہ میو کمیونٹی پروفائلز — پال، تعلیم، ملک اور مزید سے فلٹر کریں۔',
    mew: 'تصدیق شدہ میو کمیونٹی پروفائلز — پال، تعلیم، ملک اور بہوتو سوں فلٹر کرو۔',
  } as L,
  loginCta: {
    en: 'You need to be a member to view profiles.',
    ur: 'پروفائل دیکھنے کے لیے ممبر ہونا ضروری ہے۔',
    mew: 'پروفائل دیکھنے کے لیے ممبر ہونو ضروری ہے۔',
  } as L,
  joinBtn:      { en: 'Join Free',             ur: 'مفت شامل ہوں',       mew: 'مفت شامل ہوجاؤ'        } as L,
  /* filter labels */
  filterGender: { en: 'Looking for',           ur: 'رشتہ چاہیے',         mew: 'رشتو چاہیے'            } as L,
  filterAge:    { en: 'Age range',             ur: 'عمر کی حد',          mew: 'عمر کی حد'             } as L,
  filterPal:    { en: 'Pal',                   ur: 'پال',                mew: 'پال'                   } as L,
  filterGotra:  { en: 'Gotra',                 ur: 'گوتر',               mew: 'گوتر'                  } as L,
  filterEdu:    { en: 'Min. Education',        ur: 'کم از کم تعلیم',     mew: 'کم از کم تعلیم'        } as L,
  filterCountry:{ en: 'Country',               ur: 'ملک',                mew: 'ملک'                   } as L,
  filterStatus: { en: 'Marital Status',        ur: 'ازدواجی حیثیت',      mew: 'ازدواجی حالت'          } as L,
  clearFilters: { en: 'Clear Filters',         ur: 'فلٹر صاف کریں',      mew: 'فلٹر صاف کرو'          } as L,
  anyOption:    { en: 'Any',                   ur: 'کوئی بھی',           mew: 'کوئی بھی'              } as L,
  noResults:    { en: 'No profiles match your filters.', ur: 'کوئی پروفائل نہیں ملی۔', mew: 'کوئی پروفائل نہیں ملی۔' } as L,
  openRishta:   { en: 'Open my Rishta profile',ur: 'میری رشتہ پروفائل کھولیں', mew: 'میری رشتہ پروفائل کھولو' } as L,
  degreeVerified: { en: '✓ Degree Verified',  ur: '✓ ڈگری تصدیق شدہ',   mew: '✓ ڈگری تصدیق شدہ'      } as L,
  viewProfile:  { en: 'View Profile',          ur: 'پروفائل دیکھیں',     mew: 'پروفائل دیکھو'         } as L,
};

/* FOOTER */
export const FOOTER = {
  about: {
    en: 'Meo Pehchan is an open community archive maintained by volunteer editors across Mewat, Karachi, Lahore, and the Gulf. Contributions in any of our three languages are welcome.',
    ur: 'میو پہچان ایک کھلا کمیونٹی آرکائیو ہے جسے میوات، کراچی، لاہور اور خلیج کے رضاکار مرتب کرتے ہیں۔ ہماری تینوں زبانوں میں شراکت کا خیر مقدم ہے۔',
    mew: 'میو پہچان ایک کھلو سماج کو خزانو ہے جسے میوات، کراچی، لاہور اور خلیج کے رضاکار سنبھالاں ہاں۔ ہماری تیناں بولیاں میں حصہ ڈالنو خوش آمدید۔',
  } as L,
  explore:    { en: 'Explore',    ur: 'دیکھیں',    mew: 'دیکھو' } as L,
  contribute: { en: 'Contribute', ur: 'حصہ ڈالیں', mew: 'حصہ ڈالو' } as L,
  contact:    { en: 'Contact',    ur: 'رابطہ',      mew: 'رابطہ' } as L,
  contactItems: [
    { en: 'editors@meopehchan.org', ur: 'editors@meopehchan.org', mew: 'editors@meopehchan.org' } as L,
    { en: 'Nuh, Haryana · India',  ur: 'نوح، ہریانہ · ہندوستان', mew: 'نوح، ہریانہ · ہندوستان' } as L,
    { en: 'Karachi · Pakistan',    ur: 'کراچی · پاکستان',        mew: 'کراچی · پاکستان'       } as L,
  ],
  contributeItems: [
    { en: 'Submit a family record', ur: 'خاندانی روایت بھیجیں', mew: 'گھر کی روایت بھیجو' } as L,
    { en: 'Share photographs',      ur: 'تصاویر بھیجیں',        mew: 'تصویراں بھیجو'      } as L,
    { en: 'Become an editor',       ur: 'مدیر بنیں',             mew: 'مدیر بنو'           } as L,
    { en: 'Translate an article',   ur: 'مضمون کا ترجمہ کریں', mew: 'لیکھ کو ترجمو کرو'  } as L,
  ],
  rights: {
    en: '© 2026 Meo Pehchan · Made with care across three borders',
    ur: '© 2026 میو پہچان · تین سرحدوں کے پار محبت سے بنایا گیا',
    mew: '© 2026 میو پہچان · تیناں سرحداں کے پار محبت سوں بنایو',
  } as L,
};
