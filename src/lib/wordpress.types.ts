export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  yoast_head?: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: Array<{ url: string }>;
  };
  acf?: {
    [key: string]: any;
  };
  _embedded?: {
    [key: string]: any;
  };
  siteSettings?: {
    [key: string]: any;
  };
  translations?: {
    [lang: string]: {
      id: number;
      slug: string;
    };
  };
}

export interface WordPressPost extends WordPressPage {
  featured_media?: number;
  featured_image?: {
    source_url: string;
    alt_text: string;
  };
  featured_image_url?: string; // Local cached image URL
  og_image_urls?: string[]; // Local cached OG images
  gallery_urls?: string[]; // Local cached gallery images
  tags?: number[];
  categories?: number[];
  meta?: {
    gallery?: string[];
    live_url?: string;
    [key: string]: unknown;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: {
    rendered: string;
  };
}

export interface Language {
  slug: string;
  name: string;
  locale: string;
  is_default?: boolean;
  flag_url?: string;
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target?: string;
  classes?: string[];
  description?: string;
  parent?: number;
  type?: string;
  type_label?: string;
  attr_title?: string;
}
