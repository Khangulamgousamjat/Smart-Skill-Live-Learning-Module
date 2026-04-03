import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext();

const LANGUAGES = [
  { code: 'en', name: 'English',  flag: 'ðŸ‡¬ðŸ‡§', native: 'English' },
  { code: 'hi', name: 'Hindi',    flag: 'ðŸ‡®ðŸ‡³', native: 'à¤¹à¤¿à¤‚à¤¦à¥€' },
  { code: 'mr', name: 'Marathi',  flag: 'ðŸ‡®ðŸ‡³', native: 'à¤®à¤°à¤¾à¤ à¥€' },
  { code: 'fr', name: 'French',   flag: 'ðŸ‡«ðŸ‡·', native: 'FranÃ§ais' },
  { code: 'ru', name: 'Russian',  flag: 'ðŸ‡·ðŸ‡º', native: 'Ð ÑƒÑÑÐºÐ¸Ð¹' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('ssllm_language') || 'en'
  );

  const t = useCallback((key) => {
    return translations[language]?.[key]
      || translations['en']?.[key]
      || key;
  }, [language]);

  const changeLanguage = useCallback((langCode) => {
    setLanguage(langCode);
    localStorage.setItem('ssllm_language', langCode);
  }, []);

  return (
    <LanguageContext.Provider value={{
      language, changeLanguage, t, LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
};

export { LANGUAGES };

