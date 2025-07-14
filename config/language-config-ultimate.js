/**
 * 🌍 SYSTÈME DE CONFIGURATION LINGUISTIQUE ULTIME
 * Configuration complète pour toutes les optimisations linguistiques possibles
 */

// === CONFIGURATION GLOBALE DES LANGUES ===

// Métadonnées complètes des langues
export const LANGUAGE_METADATA = {
  // LANGUES PRINCIPALES MONDIALES
  'en': {
    name: 'English',
    native_name: 'English',
    family: 'Germanic',
    speakers: 1500000000,
    regions: ['US', 'UK', 'CA', 'AU', 'IN', 'ZA', 'IE', 'NZ'],
    variants: ['en-US', 'en-GB', 'en-CA', 'en-AU', 'en-IN', 'en-ZA'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'maximum'
  },
  
  'fr': {
    name: 'French',
    native_name: 'Français',
    family: 'Romance',
    speakers: 280000000,
    regions: ['FR', 'CA', 'BE', 'CH', 'SN', 'CI', 'DZ', 'MA'],
    variants: ['fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr-AF'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  },
  
  'es': {
    name: 'Spanish',
    native_name: 'Español',
    family: 'Romance',
    speakers: 500000000,
    regions: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU'],
    variants: ['es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE', 'es-CL'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  },
  
  'pt': {
    name: 'Portuguese',
    native_name: 'Português',
    family: 'Romance',
    speakers: 260000000,
    regions: ['BR', 'PT', 'AO', 'MZ', 'GW', 'ST', 'TL'],
    variants: ['pt-BR', 'pt-PT', 'pt-AO', 'pt-MZ'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'maximum'
  },
  
  'ru': {
    name: 'Russian',
    native_name: 'Русский',
    family: 'Slavic',
    speakers: 258000000,
    regions: ['RU', 'BY', 'KZ', 'KG', 'UA'],
    variants: ['ru-RU', 'ru-BY', 'ru-KZ'],
    writing_system: 'Cyrillic',
    rtl: false,
    has_cases: true,
    has_genders: true,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  },
  
  'ar': {
    name: 'Arabic',
    native_name: 'العربية',
    family: 'Semitic',
    speakers: 422000000,
    regions: ['SA', 'EG', 'DZ', 'SD', 'IQ', 'MA', 'YE', 'SY', 'TN', 'JO', 'AE', 'LB'],
    variants: ['ar-SA', 'ar-EG', 'ar-MA', 'ar-LV', 'ar-GU'],
    writing_system: 'Arabic',
    rtl: true,
    has_cases: true,
    has_genders: true,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  },
  
  'zh': {
    name: 'Chinese',
    native_name: '中文',
    family: 'Sino-Tibetan',
    speakers: 918000000,
    regions: ['CN', 'TW', 'HK', 'SG', 'MO'],
    variants: ['zh-CN', 'zh-TW', 'zh-HK', 'zh-SG'],
    writing_system: 'Chinese',
    rtl: false,
    has_cases: false,
    has_genders: false,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'maximum'
  },
  
  'hi': {
    name: 'Hindi',
    native_name: 'हिन्दी',
    family: 'Indo-European',
    speakers: 600000000,
    regions: ['IN'],
    variants: ['hi-IN'],
    writing_system: 'Devanagari',
    rtl: false,
    has_cases: true,
    has_genders: true,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  },
  
  'id': {
    name: 'Indonesian',
    native_name: 'Bahasa Indonesia',
    family: 'Austronesian',
    speakers: 270000000,
    regions: ['ID'],
    variants: ['id-ID'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    deepl_supported: true,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  },
  
  // LANGUES IMPORTANTES SUPPLÉMENTAIRES
  'ur': {
    name: 'Urdu',
    native_name: 'اردو',
    family: 'Indo-European',
    speakers: 170000000,
    regions: ['PK', 'IN'],
    variants: ['ur-PK', 'ur-IN'],
    writing_system: 'Arabic',
    rtl: true,
    has_cases: true,
    has_genders: true,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'sw': {
    name: 'Swahili',
    native_name: 'Kiswahili',
    family: 'Niger-Congo',
    speakers: 150000000,
    regions: ['KE', 'TZ', 'UG', 'RW', 'BI', 'CD'],
    variants: ['sw-KE', 'sw-TZ'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'vi': {
    name: 'Vietnamese',
    native_name: 'Tiếng Việt',
    family: 'Austroasiatic',
    speakers: 85000000,
    regions: ['VN'],
    variants: ['vi-VN'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'th': {
    name: 'Thai',
    native_name: 'ไทย',
    family: 'Tai-Kadai',
    speakers: 60000000,
    regions: ['TH'],
    variants: ['th-TH'],
    writing_system: 'Thai',
    rtl: false,
    has_cases: false,
    has_genders: false,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'tl': {
    name: 'Tagalog',
    native_name: 'Tagalog',
    family: 'Austronesian',
    speakers: 45000000,
    regions: ['PH'],
    variants: ['tl-PH'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'he': {
    name: 'Hebrew',
    native_name: 'עברית',
    family: 'Semitic',
    speakers: 9000000,
    regions: ['IL'],
    variants: ['he-IL'],
    writing_system: 'Hebrew',
    rtl: true,
    has_cases: false,
    has_genders: true,
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'medium',
    economic_importance: 'high'
  },
  
  // LANGUES RÉGIONALES EUROPÉENNES
  'ca': {
    name: 'Catalan',
    native_name: 'Català',
    family: 'Romance',
    speakers: 10000000,
    regions: ['ES-CT', 'AD', 'FR-66', 'IT-SS'],
    variants: ['ca-ES', 'ca-AD', 'ca-FR'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    national_language: 'es',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'medium',
    economic_importance: 'medium'
  },
  
  'eu': {
    name: 'Basque',
    native_name: 'Euskera',
    family: 'Isolate',
    speakers: 750000,
    regions: ['ES-PV', 'ES-NA', 'FR-64'],
    variants: ['eu-ES', 'eu-FR'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: true,
    has_genders: false,
    national_language: 'es',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'medium',
    economic_importance: 'low'
  },
  
  'br': {
    name: 'Breton',
    native_name: 'Brezhoneg',
    family: 'Celtic',
    speakers: 200000,
    regions: ['FR-BZH'],
    variants: ['br-FR'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    national_language: 'fr',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'medium',
    economic_importance: 'low'
  },
  
  'gl': {
    name: 'Galician',
    native_name: 'Galego',
    family: 'Romance',
    speakers: 2400000,
    regions: ['ES-GA'],
    variants: ['gl-ES'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    national_language: 'es',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'medium',
    economic_importance: 'low'
  },
  
  'oc': {
    name: 'Occitan',
    native_name: 'Occitan',
    family: 'Romance',
    speakers: 800000,
    regions: ['FR-OC', 'ES-CT', 'IT-PIE'],
    variants: ['oc-FR', 'oc-ES'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: true,
    national_language: 'fr',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'medium',
    economic_importance: 'low'
  },
  
  // LANGUES INDIGÈNES AMÉRICAINES
  'yua': {
    name: 'Yucatec Maya',
    native_name: 'Maya T\'aan',
    family: 'Mayan',
    speakers: 800000,
    regions: ['MX-YUC', 'MX-CAM', 'MX-QRO', 'BZ', 'GT'],
    variants: ['yua-MX'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    national_language: 'es',
    deepl_supported: false,
    google_supported: false,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'cultural',
    cultural_importance: 'maximum'
  },
  
  'qu': {
    name: 'Quechua',
    native_name: 'Runa Simi',
    family: 'Quechuan',
    speakers: 8000000,
    regions: ['PE', 'BO', 'EC', 'AR', 'CL', 'CO'],
    variants: ['qu-PE', 'qu-BO', 'qu-EC'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: true,
    has_genders: false,
    national_language: 'es',
    deepl_supported: false,
    google_supported: false,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'cultural',
    cultural_importance: 'maximum'
  },
  
  'gn': {
    name: 'Guarani',
    native_name: 'Avañe\'ẽ',
    family: 'Tupian',
    speakers: 6500000,
    regions: ['PY', 'AR', 'BO', 'BR'],
    variants: ['gn-PY', 'gn-AR'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    national_language: 'es',
    deepl_supported: false,
    google_supported: false,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'cultural',
    cultural_importance: 'maximum'
  },
  
  'nah': {
    name: 'Nahuatl',
    native_name: 'Nāhuatl',
    family: 'Uto-Aztecan',
    speakers: 1700000,
    regions: ['MX'],
    variants: ['nah-MX'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    national_language: 'es',
    deepl_supported: false,
    google_supported: false,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'cultural',
    cultural_importance: 'maximum'
  },
  
  // LANGUES ASIATIQUES RÉGIONALES
  'yue': {
    name: 'Cantonese',
    native_name: '粵語',
    family: 'Sino-Tibetan',
    speakers: 85000000,
    regions: ['HK', 'MO', 'CN-GD'],
    variants: ['yue-HK', 'yue-CN'],
    writing_system: 'Chinese',
    rtl: false,
    has_cases: false,
    has_genders: false,
    national_language: 'zh',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'high'
  },
  
  'jv': {
    name: 'Javanese',
    native_name: 'Basa Jawa',
    family: 'Austronesian',
    speakers: 85000000,
    regions: ['ID-JI', 'ID-JT', 'ID-JB'],
    variants: ['jv-ID'],
    writing_system: 'Latin',
    rtl: false,
    has_cases: false,
    has_genders: false,
    national_language: 'id',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'mr': {
    name: 'Marathi',
    native_name: 'मराठी',
    family: 'Indo-European',
    speakers: 83000000,
    regions: ['IN-MH'],
    variants: ['mr-IN'],
    writing_system: 'Devanagari',
    rtl: false,
    has_cases: true,
    has_genders: true,
    national_language: 'hi',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'te': {
    name: 'Telugu',
    native_name: 'తెలుగు',
    family: 'Dravidian',
    speakers: 81000000,
    regions: ['IN-AP', 'IN-TG'],
    variants: ['te-IN'],
    writing_system: 'Telugu',
    rtl: false,
    has_cases: true,
    has_genders: true,
    national_language: 'hi',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'ta': {
    name: 'Tamil',
    native_name: 'தமிழ்',
    family: 'Dravidian',
    speakers: 75000000,
    regions: ['IN-TN', 'LK', 'SG', 'MY'],
    variants: ['ta-IN', 'ta-LK', 'ta-SG'],
    writing_system: 'Tamil',
    rtl: false,
    has_cases: true,
    has_genders: false,
    national_language: 'hi',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'high',
    economic_importance: 'medium'
  },
  
  'bn': {
    name: 'Bengali',
    native_name: 'বাংলা',
    family: 'Indo-European',
    speakers: 230000000,
    regions: ['BD', 'IN-WB'],
    variants: ['bn-BD', 'bn-IN'],
    writing_system: 'Bengali',
    rtl: false,
    has_cases: false,
    has_genders: false,
    national_language: 'hi',
    deepl_supported: false,
    google_supported: true,
    openai_supported: true,
    priority: 'critical',
    economic_importance: 'high'
  }
};

// Configuration des variantes régionales
export const REGIONAL_VARIANTS = {
  // PORTUGAIS
  'pt-BR': {
    base: 'pt',
    name: 'Brazilian Portuguese',
    native_name: 'Português Brasileiro',
    region: 'BR',
    speakers: 215000000,
    differences: ['phonetics', 'vocabulary', 'grammar'],
    examples: {
      'train': 'trem',
      'ice cream': 'sorvete',
      'pineapple': 'abacaxi'
    }
  },
  'pt-PT': {
    base: 'pt',
    name: 'European Portuguese',
    native_name: 'Português Europeu',
    region: 'PT',
    speakers: 10000000,
    differences: ['phonetics', 'vocabulary', 'formal_address'],
    examples: {
      'train': 'comboio',
      'ice cream': 'gelado',
      'pineapple': 'ananás'
    }
  },
  
  // FRANÇAIS
  'fr-CA': {
    base: 'fr',
    name: 'Canadian French',
    native_name: 'Français canadien',
    region: 'CA',
    speakers: 7000000,
    differences: ['phonetics', 'vocabulary', 'anglicisms'],
    examples: {
      'parking': 'stationnement',
      'email': 'courriel',
      'weekend': 'fin de semaine'
    }
  },
  'fr-BE': {
    base: 'fr',
    name: 'Belgian French',
    native_name: 'Français belge',
    region: 'BE',
    speakers: 4000000,
    differences: ['vocabulary', 'numbers'],
    examples: {
      'seventy': 'septante',
      'ninety': 'nonante',
      'lunch': 'dîner'
    }
  },
  'fr-CH': {
    base: 'fr',
    name: 'Swiss French',
    native_name: 'Français suisse',
    region: 'CH',
    speakers: 2000000,
    differences: ['vocabulary', 'germanisms'],
    examples: {
      'seventy': 'septante',
      'ninety': 'nonante',
      'parking': 'place de parc'
    }
  },
  
  // ESPAGNOL
  'es-MX': {
    base: 'es',
    name: 'Mexican Spanish',
    native_name: 'Español mexicano',
    region: 'MX',
    speakers: 125000000,
    differences: ['vocabulary', 'nahuatlisms', 'diminutives'],
    examples: {
      'computer': 'computadora',
      'car': 'carro',
      'peanut': 'cacahuate'
    }
  },
  'es-AR': {
    base: 'es',
    name: 'Argentinian Spanish',
    native_name: 'Español argentino',
    region: 'AR',
    speakers: 45000000,
    differences: ['voseo', 'vocabulary', 'italianisms'],
    examples: {
      'computer': 'computadora',
      'car': 'auto',
      'you are': 'vos sos'
    }
  },
  'es-ES': {
    base: 'es',
    name: 'Peninsular Spanish',
    native_name: 'Español peninsular',
    region: 'ES',
    speakers: 47000000,
    differences: ['ceceo', 'vocabulary', 'vosotros'],
    examples: {
      'computer': 'ordenador',
      'car': 'coche',
      'you all': 'vosotros'
    }
  },
  
  // ANGLAIS
  'en-US': {
    base: 'en',
    name: 'American English',
    native_name: 'American English',
    region: 'US',
    speakers: 230000000,
    differences: ['vocabulary', 'spelling', 'pronunciation'],
    examples: {
      'elevator': 'elevator',
      'color': 'color',
      'truck': 'truck'
    }
  },
  'en-GB': {
    base: 'en',
    name: 'British English',
    native_name: 'British English',
    region: 'GB',
    speakers: 60000000,
    differences: ['vocabulary', 'spelling', 'pronunciation'],
    examples: {
      'elevator': 'lift',
      'color': 'colour',
      'truck': 'lorry'
    }
  },
  'en-AU': {
    base: 'en',
    name: 'Australian English',
    native_name: 'Australian English',
    region: 'AU',
    speakers: 17000000,
    differences: ['vocabulary', 'slang', 'pronunciation'],
    examples: {
      'elevator': 'lift',
      'trunk': 'boot',
      'flip-flops': 'thongs'
    }
  },
  'en-CA': {
    base: 'en',
    name: 'Canadian English',
    native_name: 'Canadian English',
    region: 'CA',
    speakers: 25000000,
    differences: ['vocabulary', 'spelling', 'pronunciation'],
    examples: {
      'about': 'aboot',
      'washroom': 'washroom',
      'toque': 'beanie'
    }
  },
  'en-IN': {
    base: 'en',
    name: 'Indian English',
    native_name: 'Indian English',
    region: 'IN',
    speakers: 125000000,
    differences: ['vocabulary', 'grammar', 'indianisms'],
    examples: {
      'prepone': 'schedule earlier',
      'good name': 'what is your name',
      'out of station': 'out of town'
    }
  },
  
  // ARABE
  'ar-EG': {
    base: 'ar',
    name: 'Egyptian Arabic',
    native_name: 'العربية المصرية',
    region: 'EG',
    speakers: 65000000,
    differences: ['vocabulary', 'grammar', 'pronunciation'],
    examples: {
      'how': 'ازاي',
      'what': 'ايه',
      'good': 'كويس'
    }
  },
  'ar-LV': {
    base: 'ar',
    name: 'Levantine Arabic',
    native_name: 'العربية الشامية',
    region: 'SY-LB-JO-PS',
    speakers: 35000000,
    differences: ['vocabulary', 'grammar', 'pronunciation'],
    examples: {
      'how': 'كيف',
      'what': 'شو',
      'good': 'منيح'
    }
  },
  'ar-GU': {
    base: 'ar',
    name: 'Gulf Arabic',
    native_name: 'العربية الخليجية',
    region: 'AE-SA-KW-QA-BH-OM',
    speakers: 10000000,
    differences: ['vocabulary', 'pronunciation', 'persian_influence'],
    examples: {
      'how': 'شلون',
      'what': 'شنو',
      'good': 'زين'
    }
  },
  'ar-MA': {
    base: 'ar',
    name: 'Maghrebi Arabic',
    native_name: 'العربية المغاربية',
    region: 'MA-DZ-TN',
    speakers: 70000000,
    differences: ['vocabulary', 'berber_influence', 'french_influence'],
    examples: {
      'how': 'كيفاش',
      'what': 'آش',
      'good': 'مزيان'
    }
  },
  
  // CHINOIS
  'zh-CN': {
    base: 'zh',
    name: 'Simplified Chinese',
    native_name: '简体中文',
    region: 'CN',
    speakers: 900000000,
    differences: ['writing_system', 'vocabulary'],
    examples: {
      'traditional': '传统',
      'computer': '电脑'
    }
  },
  'zh-TW': {
    base: 'zh',
    name: 'Traditional Chinese',
    native_name: '繁體中文',
    region: 'TW',
    speakers: 23000000,
    differences: ['writing_system', 'vocabulary'],
    examples: {
      'traditional': '傳統',
      'computer': '電腦'
    }
  },
  'zh-HK': {
    base: 'zh',
    name: 'Hong Kong Chinese',
    native_name: '香港中文',
    region: 'HK',
    speakers: 7000000,
    differences: ['writing_system', 'cantonese_influence', 'english_loanwords'],
    examples: {
      'bus': '巴士',
      'taxi': '的士'
    }
  }
};

// Configuration des familles linguistiques
export const LANGUAGE_FAMILIES = {
  'Indo-European': {
    branches: ['Germanic', 'Romance', 'Slavic', 'Celtic', 'Indo-Iranian'],
    languages: ['en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'hi', 'ur', 'mr', 'te', 'ta', 'bn', 'br']
  },
  'Sino-Tibetan': {
    branches: ['Sinitic', 'Tibeto-Burman'],
    languages: ['zh', 'yue']
  },
  'Afroasiatic': {
    branches: ['Semitic'],
    languages: ['ar', 'he']
  },
  'Niger-Congo': {
    branches: ['Bantu'],
    languages: ['sw']
  },
  'Austronesian': {
    branches: ['Malayo-Polynesian'],
    languages: ['id', 'jv', 'tl']
  },
  'Mayan': {
    branches: ['Yucatecan'],
    languages: ['yua']
  },
  'Quechuan': {
    branches: ['Central Quechua'],
    languages: ['qu']
  },
  'Tupian': {
    branches: ['Tupi-Guarani'],
    languages: ['gn']
  },
  'Uto-Aztecan': {
    branches: ['Nahuatl'],
    languages: ['nah']
  }
};

// Configuration des priorités et stratégies API
export const API_STRATEGIES = {
  'critical_languages': {
    languages: ['en', 'fr', 'es', 'pt', 'ru', 'zh', 'hi', 'ar', 'id'],
    apis: ['deepl', 'dictionary', 'google', 'openai'],
    fallback_order: ['deepl', 'dictionary', 'google', 'openai']
  },
  'major_languages': {
    languages: ['de', 'it', 'ja', 'ko', 'tr', 'nl', 'ur', 'sw', 'vi', 'th', 'tl', 'he', 'bn'],
    apis: ['dictionary', 'google', 'openai'],
    fallback_order: ['dictionary', 'google', 'openai']
  },
  'regional_languages': {
    languages: ['ca', 'eu', 'br', 'gl', 'oc', 'yue', 'jv', 'mr', 'te', 'ta'],
    apis: ['dictionary', 'openai'],
    fallback_order: ['dictionary', 'openai']
  },
  'indigenous_languages': {
    languages: ['yua', 'qu', 'gn', 'nah'],
    apis: ['dictionary', 'openai'],
    fallback_order: ['dictionary', 'openai'],
    cultural_context: true
  }
};

// Configuration des scripts d'écriture
export const WRITING_SYSTEMS = {
  'Latin': {
    languages: ['en', 'fr', 'es', 'pt', 'de', 'it', 'id', 'sw', 'vi', 'tl', 'ca', 'eu', 'br', 'gl', 'oc', 'yua', 'qu', 'gn', 'nah', 'jv'],
    direction: 'ltr',
    complex_shaping: false
  },
  'Cyrillic': {
    languages: ['ru'],
    direction: 'ltr',
    complex_shaping: false
  },
  'Arabic': {
    languages: ['ar', 'ur'],
    direction: 'rtl',
    complex_shaping: true
  },
  'Chinese': {
    languages: ['zh', 'yue'],
    direction: 'ltr',
    complex_shaping: false,
    variants: ['simplified', 'traditional']
  },
  'Devanagari': {
    languages: ['hi', 'mr'],
    direction: 'ltr',
    complex_shaping: true
  },
  'Hebrew': {
    languages: ['he'],
    direction: 'rtl',
    complex_shaping: true
  },
  'Thai': {
    languages: ['th'],
    direction: 'ltr',
    complex_shaping: true
  },
  'Telugu': {
    languages: ['te'],
    direction: 'ltr',
    complex_shaping: true
  },
  'Tamil': {
    languages: ['ta'],
    direction: 'ltr',
    complex_shaping: true
  },
  'Bengali': {
    languages: ['bn'],
    direction: 'ltr',
    complex_shaping: true
  }
};

// Utilité pour obtenir toutes les langues supportées
export function getAllSupportedLanguages() {
  return Object.keys(LANGUAGE_METADATA);
}

// Utilité pour obtenir toutes les variantes
export function getAllVariants() {
  return Object.keys(REGIONAL_VARIANTS);
}

// Utilité pour obtenir la stratégie API d'une langue
export function getLanguageAPIStrategy(language) {
  for (const [strategy, config] of Object.entries(API_STRATEGIES)) {
    if (config.languages.includes(language)) {
      return config;
    }
  }
  return API_STRATEGIES.major_languages; // fallback
}

// Utilité pour vérifier si une langue a des variantes
export function hasVariants(language) {
  return Object.values(REGIONAL_VARIANTS).some(variant => variant.base === language);
}

// Utilité pour obtenir les métadonnées d'une langue
export function getLanguageMetadata(language) {
  return LANGUAGE_METADATA[language] || null;
}

export default {
  LANGUAGE_METADATA,
  REGIONAL_VARIANTS,
  LANGUAGE_FAMILIES,
  API_STRATEGIES,
  WRITING_SYSTEMS,
  getAllSupportedLanguages,
  getAllVariants,
  getLanguageAPIStrategy,
  hasVariants,
  getLanguageMetadata
};
