import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, languages, setLanguage, isLoading } = useLanguage();

  if (isLoading || !currentLanguage || languages.length <= 1) {
    return null;
  }
  return (
    <div className="flex items-center gap-1 md:gap-2">
      {languages.map((lang) => (
        <button
          key={lang.slug}
          onClick={() => setLanguage(lang.slug)}
          className={`text-xs md:text-sm font-mono transition-colors px-1.5 md:px-2 py-1 rounded ${
            currentLanguage.slug === lang.slug
              ? 'text-foreground bg-foreground/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
          }`}
          aria-label={`Switch to ${lang.name}`}
          title={lang.name}
        >
          {lang.slug.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
