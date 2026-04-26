import type { WordPressPage, WordPressPost, WordPressCategory, Language, MenuItem } from './wordpress.types';

const API_URL = import.meta.env.VITE_WORDPRESS_API_URL;

const headers = {
  'Content-Type': 'application/json',
};

export async function fetchFromWordPress<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getLanguages(): Promise<Language[]> {
  const baseUrl = API_URL.replace('/wp/v2', '');
  const url = new URL(`${baseUrl}/pll/v1/languages`);

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Polylang API returns an object with languages array or direct array
  const langs = Array.isArray(data) ? data : data.languages || [];

  return langs.map((lang: any) => ({
    slug: lang.slug,
    name: lang.name,
    locale: lang.locale || lang.slug,
    is_default: lang.is_default || false,
    flag_url: lang.flag_url,
  }));
}

export async function getPages(lang?: string): Promise<WordPressPage[]> {
  return fetchFromWordPress<WordPressPage[]>('/pages', {
    per_page: 100,
    _embed: 'wp:term,wp:featuredmedia',
    ...(lang && { lang }),
  });
}

export async function getPageBySlug(slug: string, lang?: string): Promise<WordPressPage | null> {
  const pages = await fetchFromWordPress<any[]>('/pages', {
    slug,
    _embed: 'wp:term,wp:featuredmedia',
    acf: true,
  });

  if (!pages || pages.length === 0) {
    return null;
  }

  const defaultPage = pages[0];


  // If no language specified or page has no translations, return default page
  if (!lang || !defaultPage.translations) {
    return defaultPage;
  }

  // Get the ID of the translated page from translations object
  const translatedPageId = defaultPage.translations[lang].id;
  if (!translatedPageId) {
    return null;
  }
  
  // Fetch the translated page by ID
  const translatedPages = await fetchFromWordPress<WordPressPage[]>('/pages', {
    include: translatedPageId,
    _embed: 'wp:term,wp:featuredmedia',
    acf: true,
  });

  return translatedPages && translatedPages.length > 0 ? translatedPages[0] : null;
}

export async function getPosts(postType: string = 'posts', params?: Record<string, string | number>, lang?: string): Promise<WordPressPost[]> {
  return fetchFromWordPress<WordPressPost[]>(`/${postType}`, {
    per_page: 100,
    _embed: 'wp:term,wp:featuredmedia',
    ...params,
    ...(lang && { lang }),
  });
}

export async function getPostBySlug(slug: string, postType: string = 'posts', lang?: string): Promise<WordPressPost | null> {
  const posts = await fetchFromWordPress<any[]>(`/${postType}`, {
    slug,
    _embed: 'wp:term,wp:featuredmedia',
    acf: true,
  });

  if (!posts || posts.length === 0) {
    return null;
  }

  const defaultPost = posts[0];

  // If no language specified or post has no translations, return default post
  if (!lang || !defaultPost.translations) {
    return defaultPost;
  }

  // Get the ID of the translated post from translations object
  const translatedPostId = defaultPost.translations[lang].id;
  if (!translatedPostId) {
    return null;
  }

  // Fetch the translated post by ID
  const translatedPosts = await fetchFromWordPress<WordPressPost[]>(`/${postType}`, {
    include: translatedPostId,
    _embed: 'wp:term,wp:featuredmedia',
    acf: true,
  });

  return translatedPosts && translatedPosts.length > 0 ? translatedPosts[0] : null;
}

export async function getPortfolioPosts(lang?: string): Promise<WordPressPost[]> {
  const categories = await fetchFromWordPress<WordPressCategory[]>('/categories', {
    slug: 'portfolio',
    ...(lang && { lang }),
  });

  if (categories.length === 0) {
    throw new Error('Portfolio category not found');
  }

  const categoryId = categories[0].id;
  return getPosts('posts', {
    categories: categoryId,
    orderby: 'date',
    order: 'desc',
  }, lang);
}

export async function getPostsByCategory(categorySlugs: string[], lang?: string): Promise<WordPressPost[]> {
  const allPosts: WordPressPost[] = [];
  const seenIds = new Set<number>();

  for (const slug of categorySlugs) {
    const categories = await fetchFromWordPress<WordPressCategory[]>('/categories', {
      slug,
      ...(lang && { lang }),
      acf: true,
    });

    if (categories.length === 0) {
      continue;
    }

    const categoryId = categories[0].id;
    const posts = await getPosts('posts', {
      categories: categoryId,
    }, lang);

    for (const post of posts) {
      if (!seenIds.has(post.id)) {
        allPosts.push(post);
        seenIds.add(post.id);
      }
    }
  }

  return allPosts;
}

export async function getMenuItems(menuSlug: string, lang?: string): Promise<MenuItem[]> {
  const baseUrl = API_URL.replace('/wp/v2', '');
  const url = new URL(`${baseUrl}/moje-api/v1/menu/${menuSlug}`);

  if (lang) {
    url.searchParams.append('lang', lang);
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch menu: ${response.statusText}`);
  }

  const data = await response.json();

  return data || [];
}

export async function getSiteSettings(postId?: number): Promise<Record<string, any>> {
  try {
    const baseUrl = API_URL.replace('/wp/v2', '');
    const url = new URL(`${baseUrl}/moje-api/v1/info`);

    if (postId) {
      url.searchParams.append('id', String(postId));
    }

    const response = await fetch(url.toString(), { headers });
    const settings = await response.json();

    return settings;
  } catch (err) {
    console.error('Failed to fetch site settings:', err);
    return {};
  }
}

export async function getDictionary(lang?: string): Promise<Record<string, string>> {
  try {
    const posts = await getPosts('dictionary', {}, lang);
    if (!posts || posts.length === 0) {
      return {};
    }

    const dictPost = posts[0];
    return dictPost.acf || {};
  } catch (err) {
    console.error('Failed to fetch dictionary:', err);
    return {};
  }
}
