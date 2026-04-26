---
name: Project Architecture
description: React frontend consuming WordPress API with Yoast SEO meta tags
type: project
---

The portfolio is a React frontend pulling all data from a WordPress backend via API.

**Site Structure:**
- 2 pages: mainpage and portfolio
- Projects: WordPress posts in the "Portfolio" category
- Meta tags: Managed via Yoast SEO plugin

**Key Requirements:**
- React frontend must handle SEO via meta tags from WordPress
- All page and project data comes from WordPress API (not hardcoded)
- Yoast SEO meta tags need to be read and applied to React pages

**How to apply:** When adding pages or integrating API data, ensure meta tag handling for SEO. When working with WordPress data, fetch from API endpoints providing Yoast meta information.
