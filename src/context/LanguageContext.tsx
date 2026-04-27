import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLanguages } from '@/lib/api-switcher';
import type { Language } from '@/lib/wordpress.types';

interface LanguageContextType {
  currentLanguage: Language | null;
  languages: Language[];
  defaultLanguage: Language | null;
  setLanguage: (slug: string) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [defaultLanguage, setDefaultLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getLanguages()
      .then((langs) => {
        if (!langs || langs.length === 0) {
          console.warn('No languages found from API, using fallback');
          const fallbackLang: Language = { slug: 'pl', name: 'Polish', locale: 'pl_PL', is_default: true };
          setLanguages([fallbackLang]);
          setDefaultLanguage(fallbackLang);
          setCurrentLanguage(fallbackLang);
          return;
        }

        setLanguages(langs);
        const def = langs.find((l) => l.is_default);
        const defaultLang = def || langs[0];
        setDefaultLanguage(defaultLang);

        const pathSegments = location.pathname.split('/').filter(Boolean);
        const pathLang = pathSegments[0];

        const current = langs.find((l) => l.slug === pathLang) || defaultLang;
        setCurrentLanguage(current);
      })
      .catch((err) => {
        console.error('Failed to fetch languages:', err);
        const fallbackLang: Language = { slug: 'pl', name: 'Polish', locale: 'pl_PL', is_default: true };
        setLanguages([fallbackLang]);
        setDefaultLanguage(fallbackLang);
        setCurrentLanguage(fallbackLang);
      })
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

  const setLanguage = (slug: string) => {
    const lang = languages.find((l) => l.slug === slug);
    if (!lang) return;

    setCurrentLanguage(lang);

    // Always navigate to homepage for the selected language
    const newPath = lang === defaultLanguage ? '/' : `/${slug}`;
    navigate(newPath, { replace: true });
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages,
        defaultLanguage,
        setLanguage,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
