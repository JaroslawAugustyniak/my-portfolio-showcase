import type { WordPressPost } from '@/lib/wordpress.types';
import { fetchFromWordPress } from '@/lib/wordpress-api';


export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  featuredImage: string;
  liveUrl: string;
  status: "progress" | "online" | "archive";
  date: string;
  acf?: {
    [key: string]: any;
  };
  tags: string[];
  gallery: string[];
}

export interface PaginatedProjects {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

function transformWordPressPostToProject(post: WordPressPost): Project {
  const featuredImageUrl =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post.featured_image?.source_url ||
    '';

  const gallery = post.meta?.gallery || [];
  const tags = post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [];

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    description: post.content.rendered.replace(/<[^>]*>/g, ''),
    featuredImage: featuredImageUrl,
    liveUrl: post.meta?.live_url || '',
    status: post.acf?.status || 'progress',
    date: post.date,
    acf: post.acf || {},
    tags: tags,
    gallery: gallery,
  };
}

export async function getProjectBySlug(slug: string, postType: string = 'posts', lang?: string): Promise<WordPressPost | null> {
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

export async function getPaginatedProjects(
  page: number = 1,
  perPage: number = 9,
  lang?: string
): Promise<PaginatedProjects> {
  try {
    const baseUrl = import.meta.env.VITE_WORDPRESS_API_URL;
    const url = new URL(`${baseUrl}/categories`);

    url.searchParams.append('slug', 'portfolio');
    if (lang) {
      url.searchParams.append('lang', lang);
    }

    const categoryResponse = await fetch(url.toString());
    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch portfolio category');
    }

    const categories = await categoryResponse.json();
    if (!categories || categories.length === 0) {
      throw new Error('Portfolio category not found');
    }

    const categoryId = categories[0].id;

    // Fetch paginated posts
    const postsUrl = new URL(`${baseUrl}/posts`);
    postsUrl.searchParams.append('categories', String(categoryId));
    postsUrl.searchParams.append('page', String(page));
    postsUrl.searchParams.append('per_page', String(perPage));
    postsUrl.searchParams.append('orderby', 'date');
    postsUrl.searchParams.append('order', 'desc');
    postsUrl.searchParams.append('_embed', 'wp:term,wp:featuredmedia');
    postsUrl.searchParams.append('acf', 'true');
    if (lang) {
      postsUrl.searchParams.append('lang', lang);
    }

    const postsResponse = await fetch(postsUrl.toString());
    if (!postsResponse.ok) {
      throw new Error('Failed to fetch projects');
    }

    const posts = await postsResponse.json();
    const totalItems = parseInt(postsResponse.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(postsResponse.headers.get('X-WP-TotalPages') || '1', 10);

    const projects = posts.map(transformWordPressPostToProject);

    return {
      projects,
      totalPages,
      currentPage: page,
      totalItems,
    };
  } catch (err) {
    console.error('Failed to fetch paginated projects:', err);
    return {
      projects: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
    };
  }
}
