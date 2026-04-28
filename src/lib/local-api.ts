// Read from static JSON files instead of WordPress API
// Used in production to avoid API calls

import type { WordPressPage, WordPressPost, Language, MenuItem } from './wordpress.types';

async function fetchLocalJson<T>(filename: string, lang?: string): Promise<T | null> {
  try {
    const finalLang = lang || 'pl';
    const url = `/api/${finalLang}/${filename}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Failed to load ${url}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading local JSON ${filename}:`, error);
    return null;
  }
}


export async function getLanguages(): Promise<Language[]> {
  try {
    const response = await fetch('/api/languages.json');
    if (!response.ok) {
      console.warn('Failed to load /api/languages.json');
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading languages.json:', error);
    return [];
  }
}

export async function getPages(lang?: string): Promise<WordPressPage[]> {
  const data = await fetchLocalJson<{ siteSettings?: any; data?: WordPressPage[] } | WordPressPage[]>('pages.json', lang);
  if (Array.isArray(data)) {
    return data;
  }
  return data?.data || [];
}

export async function getPageBySlug(slug: string, lang?: string): Promise<WordPressPage | null> {
  const pages = await getPages(lang);
  console.log(`Searching for page with slug "${slug}"`, pages);
  return pages.find(p => p.slug === slug) || null;
}

export async function getPosts(postType?: string, _params?: any, lang?: string): Promise<WordPressPost[]> {
  // Czytaj z odpowiedniego pliku na podstawie postType
   
  var filename;
  switch(postType){
    case 'section': filename = 'sections.json'; break;
    case 'posts': filename = 'posts.json'; break;
    default: filename = 'projects.json'; break;
  }

  const data = await fetchLocalJson<{ siteSettings?: any; data?: WordPressPost[] } | WordPressPost[]>(filename, lang);
  if (Array.isArray(data)) {
    return data;
  }
  return data?.data || [];
}

export async function getPostBySlug(slug: string, postType?: string, lang?: string): Promise<WordPressPost | null> {
  const posts = await getPosts(postType, undefined, lang);
  return posts.find(p => p.slug === slug) || null;
}

export async function getPortfolioPosts(lang?: string): Promise<WordPressPost[]> {
  // Wszystkie projekty z projects.json to już recommended category
  return getPosts('posts', undefined, lang);
}

export async function getRecommendedPortfolioPosts(lang?: string): Promise<WordPressPost[]> {
  // Wszystkie projekty z projects.json to już recommended category
  return getPosts(undefined, undefined, lang);
}

export async function getPostsByCategory(_categorySlugs: string[], lang?: string): Promise<WordPressPost[]> {
  // W local-api, projects.json zawiera już pre-filtered posty
  // Zwracamy wszystkie posty (są to już posty z kategorii recommended)
  // Filtrowanie po specific category slugs nie jest dostępne w static data
  return getPosts(undefined, undefined, lang);
}

export async function getMenuItems(_menuSlug?: string, lang?: string): Promise<MenuItem[]> {
  // menuSlug jest ignorowany w local-api (mamy tylko menu.json)
  const data = await fetchLocalJson<MenuItem[] | { items?: MenuItem[]; siteSettings?: any }>('menu.json', lang);
  if (Array.isArray(data)) {
    return data;
  }
  return data?.items || [];
}

export async function getSiteSettings(postId?: number, lang?: string): Promise<Record<string, any>> {
  // Jeśli postId jest podane, spróbuj znaleźć siteSettings z tego posta
  if (postId) {
    const projects = await fetchLocalJson<{ siteSettings?: any; data?: WordPressPost[] } | WordPressPost[]>('projects.json', lang);
    const projectsList = Array.isArray(projects) ? projects : projects?.data;
    if (projectsList) {
      const post = projectsList.find(p => p.id === postId);
      if (post?.siteSettings) return post.siteSettings;
    }

    const pages = await fetchLocalJson<{ siteSettings?: any; data?: WordPressPage[] } | WordPressPage[]>('pages.json', lang);
    const pagesList = Array.isArray(pages) ? pages : pages?.data;
    if (pagesList) {
      const page = pagesList.find(p => p.id === postId);
      if (page?.siteSettings) return page.siteSettings;
    }
  }

  // Zwróć ustawienia dla tego języka lub globalne
  const data = await fetchLocalJson<Record<string, any>>('siteSettings.json', lang);
  console.log(`Loaded site settings for lang "${lang}":`, data);
  return data || {};
}

export async function getDictionary(_lang?: string): Promise<Record<string, string>> {
  // Opcjonalnie: jeśli masz dictionary.json
  // Dla teraz zwróć pusty obiekt
  return {};
}
