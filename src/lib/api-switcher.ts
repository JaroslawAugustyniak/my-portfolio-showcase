// Intelligently switch between WordPress API and local JSON cache
// - Development: use live API for fresh data
// - Production: use static JSON cache for performance

import * as remoteApi from './wordpress-api';
import * as localApi from './local-api';

const USE_LOCAL_API = import.meta.env.PROD; // true in production, false in development

export const api = USE_LOCAL_API ? localApi : remoteApi;

export async function getLanguages() {
  return api.getLanguages();
}

export async function getPages(lang?: string) {
  return api.getPages(lang);
}

export async function getPageBySlug(slug: string, lang?: string) {
  return api.getPageBySlug(slug, lang);
}

export async function getPosts(postType?: string, params?: any, lang?: string) {
  return api.getPosts(postType, params, lang);
}

export async function getPostBySlug(slug: string, postType?: string, lang?: string) {
  return api.getPostBySlug(slug, postType, lang);
}

export async function getPortfolioPosts(lang?: string) {
  return api.getPortfolioPosts(lang);
}

export async function getRecommendedPortfolioPosts(lang?: string) {
  return api.getRecommendedPortfolioPosts(lang);
}

export async function getPostsByCategory(categorySlugs: string[], lang?: string) {
  return api.getPostsByCategory(categorySlugs, lang);
}

export async function getMenuItems(menuSlug: string, lang?: string) {
  return api.getMenuItems(menuSlug, lang);
}

export async function getSiteSettings(postId?: number) {
  return api.getSiteSettings(postId);
}

export async function getDictionary(lang?: string) {
  return api.getDictionary(lang);
}
