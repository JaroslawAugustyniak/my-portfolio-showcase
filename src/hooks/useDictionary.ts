import { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/wordpress-api';
import { useLanguage } from '@/context/LanguageContext';

export function useDictionary() {
  const { currentLanguage } = useLanguage();
  const [dictionary, setDictionary] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentLanguage) return;

    getDictionary(currentLanguage.slug)
      .then(setDictionary)
      .catch(() => setDictionary({}));
  }, [currentLanguage]);

  return dictionary;
}
