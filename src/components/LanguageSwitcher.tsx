import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, languages, setLanguage, isLoading } = useLanguage();

  if (isLoading || !currentLanguage || languages.length <= 1) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.slug}
          onClick={() => setLanguage(lang.slug)}
          className={`text-sm font-mono transition-colors ${
            currentLanguage.slug === lang.slug
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label={`Switch to ${lang.name}`}
        >
          {lang.slug.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
