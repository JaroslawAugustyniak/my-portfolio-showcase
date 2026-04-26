import { useEffect } from 'react';
import type { WordPressPage } from '@/lib/wordpress.types';

interface SEOData {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_url?: string;
  og_type?: string;
}

export function useSEO(page: WordPressPage | null) {
  useEffect(() => {
    if (!page) return;

    const seoData = page.yoast_head_json || {};
    const seoTitle = seoData.title || page.title.rendered;
    const seoDescription = seoData.description || page.excerpt.rendered.replace(/<[^>]*>/g, '');
    const seoImage = seoData.og_image?.[0]?.url || '';

    // Update meta tags
    updateMetaTag('title', seoTitle);
    updateMetaTag('description', seoDescription);
    updateMetaTag('og:title', seoData.og_title || seoTitle);
    updateMetaTag('og:description', seoData.og_description || seoDescription);
    updateMetaTag('og:url', seoData.og_url || window.location.href);
    updateMetaTag('og:type', seoData.og_type || 'website');

    if (seoImage) {
      updateMetaTag('og:image', seoImage);
    }
  }, [page]);
}

function updateMetaTag(name: string, content: string) {
  if (name === 'title') {
    document.title = content;
    return;
  }

  const isProperty = name.startsWith('og:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const attribute = isProperty ? 'property' : 'name';

  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }

  meta.content = content;
}
