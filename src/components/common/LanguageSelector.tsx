import { useLanguage } from "../../hooks/useContext";
import type { Language } from "../../types/ContextTypes";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
    { code: "ur" as Language, name: "اردو", flag: "🇵🇰" },
    { code: "tr" as Language, name: "Türkçe", flag: "🇹🇷" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <select
      value={language}
      onChange={(e) => {
        setLanguage(e.target.value as Language);
        localStorage.setItem("language", e.target.value);
      }}
      style={{
        padding: "4px 8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
