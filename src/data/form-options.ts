// ── Pals (13, from Wikipedia) ────────────────────────────────────────────────
export const PALS = [
  { id: 1,  slug: 'demrot',     name: 'Demrot',     urdu: 'ڈَیمروٹ',    vansh: 'Surajvanshi·Jado'    },
  { id: 2,  slug: 'poonglot',   name: 'Poonglot',   urdu: 'پُونگلوٹ',   vansh: 'Surajvanshi·Jado'    },
  { id: 3,  slug: 'balot',      name: 'Balot',      urdu: 'بَلوٹ',      vansh: 'Surajvanshi·Jado'    },
  { id: 4,  slug: 'ratwat',     name: 'Ratwat',     urdu: 'رَتواٹ',     vansh: 'Chandravanshi·Chauhan'},
  { id: 5,  slug: 'sengal',     name: 'Sengal',     urdu: 'سِنگال',     vansh: 'Chandravanshi·Chauhan'},
  { id: 6,  slug: 'dulot',      name: 'Dulot',      urdu: 'دُلوٹ',      vansh: 'Surajvanshi·Jado'    },
  { id: 7,  slug: 'nai',        name: 'Nai',        urdu: 'نَئی',       vansh: 'Agnivanshi'           },
  { id: 8,  slug: 'lundawat',   name: 'Lundawat',   urdu: 'لُنداوَت',   vansh: 'Surajvanshi·Jado'    },
  { id: 9,  slug: 'chhirkalot', name: 'Chhirkalot', urdu: 'چِھرکلوٹ',  vansh: 'Surajvanshi·Jado'    },
  { id: 10, slug: 'dhengal',    name: 'Dhengal',    urdu: 'ڈھینگل',    vansh: 'Agnivanshi'           },
  { id: 11, slug: 'kalisa',     name: 'Kalisa',     urdu: 'کَلیسا',     vansh: 'Chandravanshi·Chauhan'},
  { id: 12, slug: 'dedwal',     name: 'Dedwal',     urdu: 'دیدوال',     vansh: 'Surajvanshi·Tomar'   },
  { id: 13, slug: 'pahat',      name: 'Pahat',      urdu: 'پاہَت',      vansh: 'Surajvanshi·Tomar'   },
] as const;

// ── Gotras (52, grouped by pal) ──────────────────────────────────────────────
export const GOTRAS: { palSlug: string; name: string; urdu: string }[] = [
  // Demrot · Surajvanshi-Jado
  { palSlug: 'demrot',     name: 'Demrot',      urdu: 'ڈیمروٹ'     },
  { palSlug: 'demrot',     name: 'Boridha',     urdu: 'بوریدھا'     },
  { palSlug: 'demrot',     name: 'Kataria',     urdu: 'کٹاریہ'      },
  { palSlug: 'demrot',     name: 'Naharwad',    urdu: 'نہارواڈ'     },
  // Poonglot · Surajvanshi-Jado
  { palSlug: 'poonglot',   name: 'Poonglot',    urdu: 'پونگلوٹ'     },
  { palSlug: 'poonglot',   name: 'Sekhawat',    urdu: 'سیکھاوٹ'     },
  { palSlug: 'poonglot',   name: 'Gorwal',      urdu: 'گورول'       },
  // Balot · Surajvanshi-Jado
  { palSlug: 'balot',      name: 'Balot',       urdu: 'بلوٹ'        },
  { palSlug: 'balot',      name: 'Bugla',       urdu: 'بُگلا'        },
  { palSlug: 'balot',      name: 'Sagadawat',   urdu: 'ساگداوٹ'     },
  { palSlug: 'balot',      name: 'Jatlawat',    urdu: 'جٹلاوٹ'      },
  { palSlug: 'balot',      name: 'Bhegot',      urdu: 'بھیگوٹ'      },
  // Ratwat · Chandravanshi-Chauhan
  { palSlug: 'ratwat',     name: 'Ratwat',      urdu: 'رتواٹ'       },
  { palSlug: 'ratwat',     name: 'Veer',        urdu: 'ویر'         },
  { palSlug: 'ratwat',     name: 'Godh',        urdu: 'گودھ'        },
  { palSlug: 'ratwat',     name: 'Chhokar',     urdu: 'چھوکر'       },
  // Sengal · Chandravanshi-Chauhan
  { palSlug: 'sengal',     name: 'Sengal',      urdu: 'سنگال'       },
  { palSlug: 'sengal',     name: 'Badgujar',    urdu: 'بادگوجر'     },
  { palSlug: 'sengal',     name: 'Pawar (Mewal)',urdu: 'پوار (میوال)'},
  { palSlug: 'sengal',     name: 'Bilyana',     urdu: 'بلیانہ'      },
  { palSlug: 'sengal',     name: 'Bhati',       urdu: 'بھاٹی'       },
  // Dulot · Surajvanshi-Jado
  { palSlug: 'dulot',      name: 'Dulot',       urdu: 'دلوٹ'        },
  { palSlug: 'dulot',      name: 'Bodhiyan',    urdu: 'بودھیان'     },
  { palSlug: 'dulot',      name: 'Dhatawat',    urdu: 'دھاٹاوٹ'     },
  { palSlug: 'dulot',      name: 'Lalawat',     urdu: 'لالاوٹ'      },
  // Nai · Agnivanshi
  { palSlug: 'nai',        name: 'Nai',         urdu: 'نائی'        },
  { palSlug: 'nai',        name: 'Bhamdawat',   urdu: 'بھامداوٹ'    },
  { palSlug: 'nai',        name: 'Khokkar',     urdu: 'کھوکھر'      },
  { palSlug: 'nai',        name: 'Chaurasia',   urdu: 'چوراسیہ'     },
  { palSlug: 'nai',        name: 'Kangar',      urdu: 'کنگر'        },
  // Lundawat · Surajvanshi-Jado
  { palSlug: 'lundawat',   name: 'Lundawat',    urdu: 'لنداوٹ'      },
  { palSlug: 'lundawat',   name: 'Baghodia',    urdu: 'باگھوڈیا'    },
  { palSlug: 'lundawat',   name: 'Majilawat',   urdu: 'ماجیلاوٹ'    },
  { palSlug: 'lundawat',   name: 'Jhelawat',    urdu: 'جھیلاوٹ'     },
  // Chhirkalot · Surajvanshi-Jado
  { palSlug: 'chhirkalot', name: 'Chhirkalot',  urdu: 'چھرکلوٹ'    },
  { palSlug: 'chhirkalot', name: 'Kadawat',     urdu: 'کداوٹ'       },
  // Dhengal · Agnivanshi
  { palSlug: 'dhengal',    name: 'Dhengal',     urdu: 'ڈھینگل'     },
  { palSlug: 'dhengal',    name: 'Dehangal',    urdu: 'دیہنگل'      },
  // Kalisa · Chandravanshi-Chauhan
  { palSlug: 'kalisa',     name: 'Kalisa',      urdu: 'کلیسا'       },
  { palSlug: 'kalisa',     name: 'Chauhan',     urdu: 'چوہان'       },
  { palSlug: 'kalisa',     name: 'Malik',       urdu: 'ملک'         },
  { palSlug: 'kalisa',     name: 'Jamaliya',    urdu: 'جمالیہ'      },
  // Dedwal · Surajvanshi-Tomar
  { palSlug: 'dedwal',     name: 'Dedwal',      urdu: 'دیدوال'      },
  { palSlug: 'dedwal',     name: 'Kalsia',      urdu: 'کلسیہ'       },
  { palSlug: 'dedwal',     name: 'Sukeda',      urdu: 'سوکیدہ'      },
  { palSlug: 'dedwal',     name: 'Bhabla',      urdu: 'بھابلہ'      },
  { palSlug: 'dedwal',     name: 'Gehlot',      urdu: 'گہلوٹ'       },
  { palSlug: 'dedwal',     name: 'Jhangala',    urdu: 'جھنگالہ'     },
  { palSlug: 'dedwal',     name: 'Silania',     urdu: 'سیلانیہ'     },
  // Pahat · Surajvanshi-Tomar
  { palSlug: 'pahat',      name: 'Pahat',       urdu: 'پاہت'        },
  { palSlug: 'pahat',      name: 'Lamkhara',    urdu: 'لامکھارہ'    },
  { palSlug: 'pahat',      name: 'Tanwar',      urdu: 'تنور'        },
  { palSlug: 'pahat',      name: 'Gomal',       urdu: 'گومل'        },
];

// ── Education levels ─────────────────────────────────────────────────────────
export const EDUCATION_LEVELS = [
  { value: 'none',         label: 'No formal education',   ur: 'کوئی تعلیم نہیں' },
  { value: 'primary',      label: 'Primary (up to 5th)',   ur: 'ابتدائی (پانچویں تک)' },
  { value: 'secondary',    label: 'Matric / 10th grade',   ur: 'میٹرک / دسویں' },
  { value: 'intermediate', label: 'Intermediate / 12th',   ur: 'انٹرمیڈیٹ / بارہویں' },
  { value: 'bachelor',     label: "Bachelor's (BA/BSc/MBBS/LLB)", ur: 'بیچلر (BA/BSc/MBBS/LLB)' },
  { value: 'master',       label: "Master's (MA/MSc/MBA)", ur: 'ماسٹر (MA/MSc/MBA)' },
  { value: 'phd',          label: 'PhD / Doctorate',       ur: 'پی ایچ ڈی / ڈاکٹریٹ' },
  { value: 'other',        label: 'Other',                  ur: 'دیگر' },
] as const;

// ── Professions ───────────────────────────────────────────────────────────────
export const PROFESSIONS = [
  'Doctor / Physician', 'Engineer', 'Teacher / Professor', 'Lawyer / Advocate',
  'Accountant / CA', 'IT Professional', 'Businessman / Trader', 'Farmer / Agriculturist',
  'Government Employee', 'Army / Military', 'Police', 'Nurse / Paramedic',
  'Pharmacist', 'Architect', 'Journalist / Media', 'Social Worker / NGO',
  'Driver / Transport', 'Shopkeeper / Retail', 'Tailor / Craftsman',
  'Student', 'Homemaker', 'Retired', 'Other',
];

// ── Blood groups ──────────────────────────────────────────────────────────────
export const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'] as const;

// ── Marital status ────────────────────────────────────────────────────────────
export const MARITAL_STATUS = [
  { value: 'unmarried', label: 'Unmarried',   ur: 'غیر شادی شدہ' },
  { value: 'married',   label: 'Married',     ur: 'شادی شدہ'     },
  { value: 'divorced',  label: 'Divorced',    ur: 'طلاق یافتہ'    },
  { value: 'widowed',   label: 'Widowed',     ur: 'بیوہ/بیوا'     },
  { value: 'other',     label: 'Other',       ur: 'دیگر'          },
] as const;

// ── Countries with provinces + cities ─────────────────────────────────────────
export type City = { name: string };
export type Province = { name: string; cities: City[] };
export type Country = { code: string; name: string; provinces: Province[] };

export const COUNTRIES: Country[] = [
  {
    code: 'PK', name: 'Pakistan',
    provinces: [
      {
        name: 'Punjab',
        cities: [
          { name: 'Lahore' }, { name: 'Faisalabad' }, { name: 'Rawalpindi' },
          { name: 'Gujranwala' }, { name: 'Multan' }, { name: 'Sialkot' },
          { name: 'Bahawalpur' }, { name: 'Sargodha' }, { name: 'Jhang' },
          { name: 'Sheikhupura' }, { name: 'Gujrat' }, { name: 'Kasur' },
          { name: 'Rahim Yar Khan' }, { name: 'Sahiwal' }, { name: 'Okara' },
          { name: 'Wah Cantt' }, { name: 'Dera Ghazi Khan' }, { name: 'Mirpur Khas' },
          { name: 'Chiniot' }, { name: 'Khanewal' }, { name: 'Hafizabad' },
          { name: 'Other (Punjab)' },
        ],
      },
      {
        name: 'Sindh',
        cities: [
          { name: 'Karachi' }, { name: 'Hyderabad' }, { name: 'Sukkur' },
          { name: 'Larkana' }, { name: 'Nawabshah' }, { name: 'Mirpurkhas' },
          { name: 'Jacobabad' }, { name: 'Shikarpur' }, { name: 'Other (Sindh)' },
        ],
      },
      {
        name: 'Khyber Pakhtunkhwa',
        cities: [
          { name: 'Peshawar' }, { name: 'Mardan' }, { name: 'Abbottabad' },
          { name: 'Mingora/Swat' }, { name: 'Kohat' }, { name: 'Dera Ismail Khan' },
          { name: 'Other (KPK)' },
        ],
      },
      {
        name: 'Balochistan',
        cities: [
          { name: 'Quetta' }, { name: 'Turbat' }, { name: 'Khuzdar' },
          { name: 'Other (Balochistan)' },
        ],
      },
      {
        name: 'Azad Kashmir',
        cities: [
          { name: 'Muzaffarabad' }, { name: 'Mirpur' }, { name: 'Rawalakot' },
          { name: 'Other (AJK)' },
        ],
      },
      {
        name: 'Gilgit-Baltistan',
        cities: [{ name: 'Gilgit' }, { name: 'Skardu' }, { name: 'Other (GB)' }],
      },
      {
        name: 'Islamabad (Federal)',
        cities: [{ name: 'Islamabad' }],
      },
    ],
  },
  {
    code: 'IN', name: 'India',
    provinces: [
      {
        name: 'Haryana',
        cities: [
          { name: 'Nuh (Mewat)' }, { name: 'Gurugram' }, { name: 'Faridabad' },
          { name: 'Palwal' }, { name: 'Rewari' }, { name: 'Jhajjar' },
          { name: 'Ambala' }, { name: 'Panipat' }, { name: 'Sonipat' },
          { name: 'Rohtak' }, { name: 'Hisar' }, { name: 'Other (Haryana)' },
        ],
      },
      {
        name: 'Rajasthan',
        cities: [
          { name: 'Alwar' }, { name: 'Bharatpur' }, { name: 'Dausa' },
          { name: 'Jaipur' }, { name: 'Sawai Madhopur' }, { name: 'Dholpur' },
          { name: 'Other (Rajasthan)' },
        ],
      },
      {
        name: 'Uttar Pradesh',
        cities: [
          { name: 'Agra' }, { name: 'Mathura' }, { name: 'Aligarh' },
          { name: 'Meerut' }, { name: 'Muzaffarnagar' }, { name: 'Hapur' },
          { name: 'Other (UP)' },
        ],
      },
      {
        name: 'Delhi',
        cities: [
          { name: 'New Delhi' }, { name: 'Central Delhi' }, { name: 'South Delhi' },
          { name: 'North Delhi' }, { name: 'East Delhi' }, { name: 'West Delhi' },
          { name: 'Noida / Greater Noida' }, { name: 'Ghaziabad' }, { name: 'Faridabad' },
        ],
      },
      {
        name: 'Other Indian State',
        cities: [{ name: 'Mumbai' }, { name: 'Hyderabad' }, { name: 'Other' }],
      },
    ],
  },
  {
    code: 'AE', name: 'United Arab Emirates',
    provinces: [
      {
        name: 'UAE',
        cities: [
          { name: 'Dubai' }, { name: 'Abu Dhabi' }, { name: 'Sharjah' },
          { name: 'Ajman' }, { name: 'Ras Al Khaimah' }, { name: 'Fujairah' },
          { name: 'Umm Al Quwain' },
        ],
      },
    ],
  },
  {
    code: 'SA', name: 'Saudi Arabia',
    provinces: [
      {
        name: 'Saudi Arabia',
        cities: [
          { name: 'Riyadh' }, { name: 'Jeddah' }, { name: 'Makkah' },
          { name: 'Madinah' }, { name: 'Dammam' }, { name: 'Khobar' },
          { name: 'Tabuk' }, { name: 'Other (KSA)' },
        ],
      },
    ],
  },
  {
    code: 'GB', name: 'United Kingdom',
    provinces: [
      {
        name: 'United Kingdom',
        cities: [
          { name: 'London' }, { name: 'Birmingham' }, { name: 'Manchester' },
          { name: 'Bradford' }, { name: 'Leeds' }, { name: 'Leicester' },
          { name: 'Glasgow' }, { name: 'Edinburgh' }, { name: 'Other (UK)' },
        ],
      },
    ],
  },
  {
    code: 'CA', name: 'Canada',
    provinces: [
      {
        name: 'Canada',
        cities: [
          { name: 'Toronto' }, { name: 'Mississauga' }, { name: 'Brampton' },
          { name: 'Vancouver' }, { name: 'Calgary' }, { name: 'Ottawa' },
          { name: 'Montreal' }, { name: 'Other (Canada)' },
        ],
      },
    ],
  },
  {
    code: 'US', name: 'United States',
    provinces: [
      {
        name: 'United States',
        cities: [
          { name: 'New York' }, { name: 'Houston' }, { name: 'Dallas' },
          { name: 'Chicago' }, { name: 'Los Angeles' }, { name: 'Washington DC' },
          { name: 'Other (USA)' },
        ],
      },
    ],
  },
  {
    code: 'AU', name: 'Australia',
    provinces: [
      {
        name: 'Australia',
        cities: [
          { name: 'Sydney' }, { name: 'Melbourne' }, { name: 'Brisbane' },
          { name: 'Perth' }, { name: 'Adelaide' }, { name: 'Other (Australia)' },
        ],
      },
    ],
  },
  {
    code: 'QA', name: 'Qatar',
    provinces: [{ name: 'Qatar', cities: [{ name: 'Doha' }, { name: 'Other (Qatar)' }] }],
  },
  {
    code: 'KW', name: 'Kuwait',
    provinces: [{ name: 'Kuwait', cities: [{ name: 'Kuwait City' }, { name: 'Other (Kuwait)' }] }],
  },
  {
    code: 'BH', name: 'Bahrain',
    provinces: [{ name: 'Bahrain', cities: [{ name: 'Manama' }, { name: 'Other (Bahrain)' }] }],
  },
  {
    code: 'OM', name: 'Oman',
    provinces: [{ name: 'Oman', cities: [{ name: 'Muscat' }, { name: 'Salalah' }, { name: 'Other (Oman)' }] }],
  },
  {
    code: 'OTHER', name: 'Other Country',
    provinces: [{ name: 'Other', cities: [{ name: 'Other' }] }],
  },
];
