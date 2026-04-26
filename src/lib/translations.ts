export const translations = {
  pl: {
    projectStatusOnline: 'Live',
    projectStatusProgress: 'W trakcie',
    projectStatusArchive: 'Archiwum',
    allProjects: 'Wszystkie projekty',
    contactName: 'Imię i nazwisko',
    contactLinks: 'Linki',
    contactEmail: 'E-mail',
    loading: 'Ładowanie...',
    backToProjects: 'Powrót do portfolio',
    visitPage: 'Odwiedź stronę',
    galleryLabel: '{ Galeria }',
  },
  en: {
    projectStatusOnline: 'Live',
    projectStatusProgress: 'In Progress',
    projectStatusArchive: 'Archive',
    allProjects: 'All Projects',
    contactName: 'Name',
    contactLinks: 'Links',
    contactEmail: 'E-mail',
  },
} as const;

export type TranslationKey = keyof typeof translations.pl;

export function getTranslation(lang: string, key: TranslationKey): string {
  const langKey = lang as keyof typeof translations;
  return translations[langKey]?.[key] || translations.pl[key];
}
