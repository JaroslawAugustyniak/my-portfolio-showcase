import { useState, useEffect } from 'react';
import type { Project } from '@/data/projects';
import { getPortfolioPosts } from '@/lib/api-switcher';
import type { WordPressPost } from '@/lib/wordpress.types';

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
    description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
    featuredImage: featuredImageUrl,
    liveUrl: post.meta?.live_url || '',
    status: post.acf?.status || 'progress',
    date: post.date,
    tags: tags,
    gallery: gallery,
  };
}

export function usePortfolioProjects(lang?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const posts = await getPortfolioPosts(lang);
        const transformedProjects = posts.map(transformWordPressPostToProject);
        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [lang]);

  return { projects, loading, error };
}
