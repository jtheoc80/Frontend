// @ts-nocheck
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translations inline to avoid JSON import issues
const enTranslations = {
  navigation: {
    about: "About",
    signIn: "Sign In",
    getStarted: "Get Started",
    gettingStarted: "Getting Started",
    manufacturer: "Manufacturer",
    distributor: "Distributor",
    plant: "Plant",
    repair: "Repair",
    valveInventory: "Valve Inventory",
    history: "History"
  },
  dashboard: {
    title: "ValveChain Dashboard",
    manufacturerDashboard: "Manufacturer Dashboard",
    distributorDashboard: "Distributor Dashboard",
    plantDashboard: "Plant Dashboard",
    repairDashboard: "Repair Dashboard"
  },
  stats: {
    totalValves: "Total Valves",
    pendingTokenization: "Pending Tokenization",
    inService: "In Service",
    pendingOrders: "Pending Orders",
    activeContracts: "Active Contracts",
    completedJobs: "Completed Jobs",
    revenue: "Revenue"
  },
  landing: {
    title: "ValveChain",
    hero: {
      title: "Blockchain-Powered Valve Supply Chain Management",
      subtitle: "Streamline your valve operations with secure, transparent, and efficient blockchain technology. Track, manage, and optimize your supply chain from manufacturer to end user.",
      getStarted: "Get Started Today",
      learnMore: "Learn More"
    }
  },
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    comingSoon: "Coming Soon",
    language: "Language"
  }
};

const arTranslations = {
  navigation: {
    about: "حول",
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    gettingStarted: "البدء",
    manufacturer: "المصنع",
    distributor: "الموزع",
    plant: "المحطة",
    repair: "الإصلاح",
    valveInventory: "مخزون الصمامات",
    history: "التاريخ"
  },
  dashboard: {
    title: "لوحة تحكم سلسلة الصمامات",
    manufacturerDashboard: "لوحة تحكم المصنع",
    distributorDashboard: "لوحة تحكم الموزع",
    plantDashboard: "لوحة تحكم المحطة",
    repairDashboard: "لوحة تحكم الإصلاح"
  },
  stats: {
    totalValves: "إجمالي الصمامات",
    pendingTokenization: "في انتظار الترقيم",
    inService: "في الخدمة",
    pendingOrders: "الطلبات المعلقة",
    activeContracts: "العقود النشطة",
    completedJobs: "الوظائف المكتملة",
    revenue: "الإيرادات"
  },
  landing: {
    title: "سلسلة الصمامات",
    hero: {
      title: "إدارة سلسلة توريد الصمامات بتقنية البلوك تشين",
      subtitle: "قم بتبسيط عمليات الصمامات الخاصة بك مع تقنية البلوك تشين الآمنة والشفافة والفعالة. تتبع وإدارة وتحسين سلسلة التوريد من المصنع إلى المستخدم النهائي.",
      getStarted: "ابدأ اليوم",
      learnMore: "اعرف المزيد"
    }
  },
  common: {
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    comingSoon: "قريباً",
    language: "اللغة"
  }
};

const resources = {
  en: {
    common: enTranslations,
  },
  ar: {
    common: arTranslations,
  },
};

// RTL languages list
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    // Default namespace
    defaultNS: 'common',
    ns: ['common'],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Configuration for language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Function to check if current language is RTL
export const isRTL = () => {
  return RTL_LANGUAGES.includes(i18n.language);
};

// Function to get text direction
export const getTextDirection = () => {
  return isRTL() ? 'rtl' : 'ltr';
};

export default i18n;