import type { WordPressPost } from '@/lib/wordpress.types';
import { getPostBySlug } from '@/lib/api-switcher';


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
  const tags = post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) ||
               (Array.isArray(post.tags) && typeof post.tags[0] === 'string' ? post.tags : []);

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
  console.log(`Fetching project with slug: ${slug}, postType: ${postType}, lang: ${lang}`);
  return getPostBySlug(slug, postType, lang);
}

export async function getPaginatedProjects(
  page: number = 1,
  perPage: number = 9,
  lang?: string
): Promise<PaginatedProjects> {
  try {
    // Import dynamically to avoid circular dependency
    const { getPortfolioPosts } = await import('@/lib/api-switcher');

    const allPosts = await getPortfolioPosts(lang);
    if (!allPosts) {
      return {
        projects: [],
        totalPages: 0,
        currentPage: page,
        totalItems: 0,
      };
    }

    const totalItems = allPosts.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const startIdx = (page - 1) * perPage;
    const endIdx = startIdx + perPage;

    const paginatedPosts = allPosts.slice(startIdx, endIdx);
    const projects = paginatedPosts.map(transformWordPressPostToProject);

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
