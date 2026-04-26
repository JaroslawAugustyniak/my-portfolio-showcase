---
name: WordPress Integration Setup
description: API service and hooks for fetching content and SEO data from WordPress
type: reference
---

**Created Files:**
- `.env.local` - WordPress API endpoint configuration
- `src/lib/wordpress.types.ts` - TypeScript types for WordPress responses
- `src/lib/wordpress-api.ts` - API client for fetching pages, posts, and portfolio items
- `src/hooks/usePortfolioProjects.ts` - Hook that fetches portfolio posts and transforms to Project interface
- `src/hooks/useSEO.ts` - Hook that applies Yoast SEO meta tags to page

**API Functions Available:**
- `getPages()` - Fetch all pages
- `getPageBySlug(slug)` - Fetch single page by slug
- `getPosts(params)` - Fetch posts with optional filters
- `getPostBySlug(slug)` - Fetch single post by slug
- `getPortfolioPosts()` - Fetch posts from Portfolio category
- `getPostsByCategory(slug)` - Fetch posts by category slug

**Next Steps:**
- Test API connection
- Update components to use hooks instead of hardcoded data
- Configure custom fields in WordPress (gallery, live_url) if not already set up
