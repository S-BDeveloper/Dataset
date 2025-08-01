import { useState } from "react";
import type { ReactNode } from "react";
import { LanguageContext, type Language } from "../types/ContextTypes";

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.favorites": "Favorites",
    "nav.submit": "Submit Data",
    "nav.admin": "Admin Review",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Logout",

    // Homepage
    "home.title": "Authentic Islamic Knowledge",
    "home.subtitle":
    "Discover the miraculous signs of Allah through Quranic verses, Sahih Bukhari's hadith collection, and scientific discoveries. Explore cross-references between different Islamic sources to deepen your understanding.",
    "home.stats.total": "Authentic Islamic Data",
    "home.stats.categories": "Categories",
    "home.stats.saved": "Saved",
    "home.stats.fulfilled": "Fulfilled",

    // Tabs
    "tabs.all": "Authentic Islamic Data",
    "tabs.search": "Advanced Search",
    "tabs.charts": "Charts & Graphs",
    "tabs.stats": "Statistics",
    "tabs.quran": "Quran",
    "tabs.hadith": "Hadith",

    // Quran
    "quran.title": "The Holy Quran",
    "quran.search.placeholder": "Search by surah name or Arabic text...",
    "quran.filter.surah": "Filter by Surah",
    "quran.filter.place": "Filter by Place of Revelation",
    "quran.sort.by": "Sort by",
    "quran.sort.surah": "Surah Number",
    "quran.sort.name": "Surah Name",
    "quran.sort.place": "Place of Revelation",
    "quran.translation": "English Translation",
    "quran.arabic": "Arabic Text",
    "quran.roman": "Romanized Name",

    // Hadith
    "hadith.title": "Sahih Bukhari",
    "hadith.search.placeholder": "Search hadith content...",
    "hadith.sort.by": "Sort by",
    "hadith.sort.original": "Original Order",
    "hadith.sort.length": "Content Length",
    "hadith.translation": "English Translation",
    "hadith.arabic": "Arabic Text",

    // Common
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.clear": "Clear",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.export": "Export",
    "common.pagination": "Pagination",
    "common.previous": "Previous",
    "common.next": "Next",
    "common.first": "First",
    "common.last": "Last",
    "common.goToPage": "Go to page",
    "common.go": "Go",

    // Language names
    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
  ar: {
    // Arabic translations (simplified for now)
    "nav.home": "الرئيسية",
    "nav.favorites": "المفضلة",
    "nav.submit": "إرسال اكتشاف",
    "nav.admin": "مراجعة الإدارة",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",

    "home.title": "الآيات الإلهية والإرشاد",
    "home.subtitle":
      "اكتشف الآيات المعجزة لله من خلال الوحي القرآني والتوجيه النبوي والحكمة الإلهية.",
    "home.stats.total": "إجمالي الآيات",
    "home.stats.categories": "الفئات",
    "home.stats.saved": "المحفوظ",
    "home.stats.fulfilled": "المتحقق",

    "tabs.all": "جميع الآيات",
    "tabs.search": "البحث المتقدم",
    "tabs.charts": "الرسوم البيانية",
    "tabs.stats": "الإحصائيات",
    "tabs.quran": "القرآن",
    "tabs.hadith": "الحديث",

    "quran.title": "القرآن الكريم",
    "quran.search.placeholder": "البحث باسم السورة أو النص العربي...",
    "quran.filter.surah": "تصفية حسب السورة",
    "quran.filter.place": "تصفية حسب مكان النزول",
    "quran.sort.by": "ترتيب حسب",
    "quran.sort.surah": "رقم السورة",
    "quran.sort.name": "اسم السورة",
    "quran.sort.place": "مكان النزول",
    "quran.translation": "الترجمة الإنجليزية",
    "quran.arabic": "النص العربي",
    "quran.roman": "الاسم الروماني",

    "hadith.title": "صحيح البخاري",
    "hadith.search.placeholder": "البحث في محتوى الحديث...",
    "hadith.sort.by": "ترتيب حسب",
    "hadith.sort.original": "الترتيب الأصلي",
    "hadith.sort.length": "طول المحتوى",
    "hadith.translation": "الترجمة الإنجليزية",
    "hadith.arabic": "النص العربي",

    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.clear": "مسح",
    "common.loading": "جاري التحميل...",
    "common.noResults": "لم يتم العثور على نتائج",
    "common.export": "تصدير",
    "common.pagination": "ترقيم الصفحات",
    "common.previous": "السابق",
    "common.next": "التالي",
    "common.first": "الأول",
    "common.last": "الأخير",
    "common.goToPage": "اذهب إلى الصفحة",
    "common.go": "اذهب",

    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
  ur: {
    // Urdu translations (simplified)
    "nav.home": "ہوم",
    "nav.favorites": "پسندیدہ",
    "nav.submit": "دریافت جمع کریں",
    "nav.admin": "ایڈمن جائزہ",
    "nav.login": "لاگ ان",
    "nav.signup": "سائن اپ",
    "nav.logout": "لاگ آؤٹ",

    "home.title": "اسلامی نشانیاں اور رہنمائی",
    "home.subtitle":
      "قرآنی وحی، نبوی رہنمائی اور الہی حکمت کے ذریعے اللہ کی معجزاتی نشانیاں دریافت کریں۔",
    "home.stats.total": "کل نشانیاں",
    "home.stats.categories": "زمرے",
    "home.stats.saved": "محفوظ شدہ",
    "home.stats.fulfilled": "پورا ہوا",

    "tabs.all": "تمام نشانیاں",
    "tabs.search": "اعلی درجے کی تلاش",
    "tabs.charts": "چارٹس اور گراف",
    "tabs.stats": "اعداد و شمار",
    "tabs.quran": "قرآن",
    "tabs.hadith": "حدیث",

    "quran.title": "قرآن مجید",
    "quran.search.placeholder": "سورہ کے نام یا عربی متن سے تلاش کریں...",
    "quran.filter.surah": "سورہ کے مطابق فلٹر",
    "quran.filter.place": "نزول کی جگہ کے مطابق فلٹر",
    "quran.sort.by": "ترتیب دیں",
    "quran.sort.surah": "سورہ نمبر",
    "quran.sort.name": "سورہ کا نام",
    "quran.sort.place": "نزول کی جگہ",
    "quran.translation": "انگریزی ترجمہ",
    "quran.arabic": "عربی متن",
    "quran.roman": "رومن نام",

    "hadith.title": "صحیح بخاری",
    "hadith.search.placeholder": "حدیث کے مواد میں تلاش کریں...",
    "hadith.sort.by": "ترتیب دیں",
    "hadith.sort.original": "اصل ترتیب",
    "hadith.sort.length": "مواد کی لمبائی",
    "hadith.translation": "انگریزی ترجمہ",
    "hadith.arabic": "عربی متن",

    "common.search": "تلاش",
    "common.filter": "فلٹر",
    "common.sort": "ترتیب",
    "common.clear": "صاف کریں",
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.noResults": "کوئی نتیجہ نہیں ملا",
    "common.export": "برآمد کریں",
    "common.pagination": "صفحہ نمبر",
    "common.previous": "پچھلا",
    "common.next": "اگلا",
    "common.first": "پہلا",
    "common.last": "آخری",
    "common.goToPage": "صفحہ پر جائیں",
    "common.go": "جائیں",

    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
  tr: {
    // Turkish translations (simplified)
    "nav.home": "Ana Sayfa",
    "nav.favorites": "Favoriler",
    "nav.submit": "Keşif Gönder",
    "nav.admin": "Admin İnceleme",
    "nav.login": "Giriş Yap",
    "nav.signup": "Kayıt Ol",
    "nav.logout": "Çıkış Yap",

    "home.title": "İslami İşaretler ve Rehberlik",
    "home.subtitle":
      "Kur'an vahyi, peygamber rehberliği ve ilahi hikmet aracılığıyla Allah'ın mucizevi işaretlerini keşfedin.",
    "home.stats.total": "Toplam İşaret",
    "home.stats.categories": "Kategoriler",
    "home.stats.saved": "Kaydedilen",
    "home.stats.fulfilled": "Gerçekleşen",

    "tabs.all": "Tüm İşaretler",
    "tabs.search": "Gelişmiş Arama",
    "tabs.charts": "Grafikler ve Çizelgeler",
    "tabs.stats": "İstatistikler",
    "tabs.quran": "Kur'an",
    "tabs.hadith": "Hadis",

    "quran.title": "Kutsal Kur'an",
    "quran.search.placeholder": "Sure adı veya Arapça metin ile ara...",
    "quran.filter.surah": "Sureye Göre Filtrele",
    "quran.filter.place": "İndirilme Yerine Göre Filtrele",
    "quran.sort.by": "Sırala",
    "quran.sort.surah": "Sure Numarası",
    "quran.sort.name": "Sure Adı",
    "quran.sort.place": "İndirilme Yeri",
    "quran.translation": "İngilizce Çeviri",
    "quran.arabic": "Arapça Metin",
    "quran.roman": "Romen Adı",

    "hadith.title": "Sahih Buhari",
    "hadith.search.placeholder": "Hadis içeriğinde ara...",
    "hadith.sort.by": "Sırala",
    "hadith.sort.original": "Orijinal Sıra",
    "hadith.sort.length": "İçerik Uzunluğu",
    "hadith.translation": "İngilizce Çeviri",
    "hadith.arabic": "Arapça Metin",

    "common.search": "Ara",
    "common.filter": "Filtrele",
    "common.sort": "Sırala",
    "common.clear": "Temizle",
    "common.loading": "Yükleniyor...",
    "common.noResults": "Sonuç bulunamadı",
    "common.export": "Dışa Aktar",
    "common.pagination": "Sayfalama",
    "common.previous": "Önceki",
    "common.next": "Sonraki",
    "common.first": "İlk",
    "common.last": "Son",
    "common.goToPage": "Sayfaya git",
    "common.go": "Git",

    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
  fr: {
    // French translations (simplified)
    "nav.home": "Accueil",
    "nav.favorites": "Favoris",
    "nav.submit": "Soumettre une Découverte",
    "nav.admin": "Révision Admin",
    "nav.login": "Connexion",
    "nav.signup": "Inscription",
    "nav.logout": "Déconnexion",

    "home.title": "Signes Islamiques et Guidance",
    "home.subtitle":
      "Découvrez les signes miraculeux d'Allah à travers les révélations coraniques, la guidance prophétique et la sagesse divine.",
    "home.stats.total": "Total des Signes",
    "home.stats.categories": "Catégories",
    "home.stats.saved": "Sauvegardés",
    "home.stats.fulfilled": "Accomplis",

    "tabs.all": "Tous les Signes",
    "tabs.search": "Recherche Avancée",
    "tabs.charts": "Graphiques et Tableaux",
    "tabs.stats": "Statistiques",
    "tabs.quran": "Coran",
    "tabs.hadith": "Hadith",

    "quran.title": "Le Saint Coran",
    "quran.search.placeholder":
      "Rechercher par nom de sourate ou texte arabe...",
    "quran.filter.surah": "Filtrer par Sourate",
    "quran.filter.place": "Filtrer par Lieu de Révélation",
    "quran.sort.by": "Trier par",
    "quran.sort.surah": "Numéro de Sourate",
    "quran.sort.name": "Nom de Sourate",
    "quran.sort.place": "Lieu de Révélation",
    "quran.translation": "Traduction Anglaise",
    "quran.arabic": "Texte Arabe",
    "quran.roman": "Nom Romanisé",

    "hadith.title": "Sahih Bukhari",
    "hadith.search.placeholder": "Rechercher dans le contenu du hadith...",
    "hadith.sort.by": "Trier par",
    "hadith.sort.original": "Ordre Original",
    "hadith.sort.length": "Longueur du Contenu",
    "hadith.translation": "Traduction Anglaise",
    "hadith.arabic": "Texte Arabe",

    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.clear": "Effacer",
    "common.loading": "Chargement...",
    "common.noResults": "Aucun résultat trouvé",
    "common.export": "Exporter",
    "common.pagination": "Pagination",
    "common.previous": "Précédent",
    "common.next": "Suivant",
    "common.first": "Premier",
    "common.last": "Dernier",
    "common.goToPage": "Aller à la page",
    "common.go": "Aller",

    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
  es: {
    // Spanish translations (simplified)
    "nav.home": "Inicio",
    "nav.favorites": "Favoritos",
    "nav.submit": "Enviar Descubrimiento",
    "nav.admin": "Revisión Admin",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "nav.logout": "Cerrar Sesión",

    "home.title": "Señales Islámicas y Guía",
    "home.subtitle":
      "Descubre las señales milagrosas de Allah a través de las revelaciones coránicas, la guía profética y la sabiduría divina.",
    "home.stats.total": "Total de Señales",
    "home.stats.categories": "Categorías",
    "home.stats.saved": "Guardados",
    "home.stats.fulfilled": "Cumplidos",

    "tabs.all": "Todas las Señales",
    "tabs.search": "Búsqueda Avanzada",
    "tabs.charts": "Gráficos y Tablas",
    "tabs.stats": "Estadísticas",
    "tabs.quran": "Corán",
    "tabs.hadith": "Hadiz",

    "quran.title": "El Sagrado Corán",
    "quran.search.placeholder": "Buscar por nombre de sura o texto árabe...",
    "quran.filter.surah": "Filtrar por Sura",
    "quran.filter.place": "Filtrar por Lugar de Revelación",
    "quran.sort.by": "Ordenar por",
    "quran.sort.surah": "Número de Sura",
    "quran.sort.name": "Nombre de Sura",
    "quran.sort.place": "Lugar de Revelación",
    "quran.translation": "Traducción Inglesa",
    "quran.arabic": "Texto Árabe",
    "quran.roman": "Nombre Romanizado",

    "hadith.title": "Sahih Bukhari",
    "hadith.search.placeholder": "Buscar en el contenido del hadiz...",
    "hadith.sort.by": "Ordenar por",
    "hadith.sort.original": "Orden Original",
    "hadith.sort.length": "Longitud del Contenido",
    "hadith.translation": "Traducción Inglesa",
    "hadith.arabic": "Texto Árabe",

    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.clear": "Limpiar",
    "common.loading": "Cargando...",
    "common.noResults": "No se encontraron resultados",
    "common.export": "Exportar",
    "common.pagination": "Paginación",
    "common.previous": "Anterior",
    "common.next": "Siguiente",
    "common.first": "Primero",
    "common.last": "Último",
    "common.goToPage": "Ir a la página",
    "common.go": "Ir",

    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
  de: {
    // German translations (simplified)
    "nav.home": "Startseite",
    "nav.favorites": "Favoriten",
    "nav.submit": "Entdeckung Einreichen",
    "nav.admin": "Admin Überprüfung",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    "nav.logout": "Abmelden",

    "home.title": "Islamische Zeichen und Führung",
    "home.subtitle":
      "Entdecken Sie die wundersamen Zeichen Allahs durch koranische Offenbarungen, prophetische Führung und göttliche Weisheit.",
    "home.stats.total": "Gesamte Zeichen",
    "home.stats.categories": "Kategorien",
    "home.stats.saved": "Gespeichert",
    "home.stats.fulfilled": "Erfüllt",

    "tabs.all": "Alle Zeichen",
    "tabs.search": "Erweiterte Suche",
    "tabs.charts": "Diagramme und Grafiken",
    "tabs.stats": "Statistiken",
    "tabs.quran": "Koran",
    "tabs.hadith": "Hadith",

    "quran.title": "Der Heilige Koran",
    "quran.search.placeholder": "Nach Sure-Name oder arabischem Text suchen...",
    "quran.filter.surah": "Nach Sure filtern",
    "quran.filter.place": "Nach Offenbarungsort filtern",
    "quran.sort.by": "Sortieren nach",
    "quran.sort.surah": "Sure-Nummer",
    "quran.sort.name": "Sure-Name",
    "quran.sort.place": "Offenbarungsort",
    "quran.translation": "Englische Übersetzung",
    "quran.arabic": "Arabischer Text",
    "quran.roman": "Romanisierter Name",

    "hadith.title": "Sahih Bukhari",
    "hadith.search.placeholder": "Im Hadith-Inhalt suchen...",
    "hadith.sort.by": "Sortieren nach",
    "hadith.sort.original": "Ursprüngliche Reihenfolge",
    "hadith.sort.length": "Inhaltslänge",
    "hadith.translation": "Englische Übersetzung",
    "hadith.arabic": "Arabischer Text",

    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.sort": "Sortieren",
    "common.clear": "Löschen",
    "common.loading": "Lädt...",
    "common.noResults": "Keine Ergebnisse gefunden",
    "common.export": "Exportieren",
    "common.pagination": "Seitennummerierung",
    "common.previous": "Vorherige",
    "common.next": "Nächste",
    "common.first": "Erste",
    "common.last": "Letzte",
    "common.goToPage": "Zur Seite gehen",
    "common.go": "Gehen",

    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.ur": "اردو",
    "lang.tr": "Türkçe",
    "lang.fr": "Français",
    "lang.es": "Español",
    "lang.de": "Deutsch",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage && Object.keys(translations).includes(savedLanguage)
      ? savedLanguage
      : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
