import React from 'react';
import { useTranslation } from 'react-i18next';
// import { Select } from 'antd';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: "en", label: "English", emoji: "🇬🇧" },
  { code: "hi", label: "हिंदी", emoji: "🇮🇳" },
  { code: "fr", label: "Français", emoji: "🇫🇷" },
  { code: "es", label: "Español", emoji: "🇪🇸" },
  { code: "de", label: "Deutsch", emoji: "🇩🇪" },
  { code: "ar", label: "العربية", emoji: "🇸🇦" },
  { code: "zh", label: "中文", emoji: "🇨🇳" },
  { code: "ru", label: "Русский", emoji: "🇷🇺" },
  { code: "ja", label: "日本語", emoji: "🇯🇵" },
  { code: "pt", label: "Português", emoji: "🇵🇹" },
  { code: "it", label: "Italiano", emoji: "🇮🇹" },
  { code: "tr", label: "Türkçe", emoji: "🇹🇷" },
  { code: "ko", label: "한국어", emoji: "🇰🇷" },
  { code: "bn", label: "বাংলা", emoji: "🇧🇩" },
  { code: "ur", label: "اردو", emoji: "🇵🇰" },
  { code: "fa", label: "فارسی", emoji: "🇮🇷" },
  { code: "th", label: "ไทย", emoji: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", emoji: "🇻🇳" },
  { code: "ms", label: "Bahasa Melayu", emoji: "🇲🇾" },
  { code: "id", label: "Bahasa Indonesia", emoji: "🇮🇩" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={changeLanguage}
      className={styles.languageSelect}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.emoji} {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher; 