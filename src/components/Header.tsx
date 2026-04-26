import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { getMenuItems, getSiteSettings, getPostBySlug } from "@/lib/wordpress-api";
import type { MenuItem } from "@/lib/wordpress.types";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();
  const { currentLanguage, defaultLanguage } = useLanguage();

  useEffect(() => {
    if (!currentLanguage) return;
    getMenuItems('menu', currentLanguage.slug)
      .then(setMenuItems)
      .catch(() => setMenuItems([]));
  }, [currentLanguage]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Check if we're on a project detail page
        const projektMatch = location.pathname.match(/\/projekt\/([^/]+)/);
        let postId: number | undefined;

        if (projektMatch) {
          const slug = projektMatch[1];
          const post = await getPostBySlug(slug, 'posts', currentLanguage?.slug);
          if (post) {
            postId = post.id;
          }
        }

        // Fetch settings with or without post ID
        const settings = await getSiteSettings(postId);
        console.log(settings); // Debugging line

        if (settings.logo) {
          setLogoUrl(settings.logo);
        }
        if (settings.favicon) {
          const favicon = document.querySelector("link[rel='icon']");
          if (favicon) {
            favicon.setAttribute('href', settings.favicon);
          }
        }

        if (settings.name) {
          document.title = settings.name;

          const og_title = document.querySelector("meta[property='og:title']");
          if (og_title) {
            og_title.setAttribute('content', settings.name);
          }
        }

        if (settings.seo.og_image) {
          const og_image = document.querySelector("meta[property='og:image']");
          const tw_image = document.querySelector("meta[name='twitter:image']");
          if (og_image) {
            og_image.setAttribute('content', settings.seo.og_image[0].url);
          }
          if (tw_image) {
            tw_image.setAttribute('content', settings.seo.og_image[0].url);
          }
        }

 

        const og_description = document.querySelector("meta[property='og:description']");
        if (og_description) {
          og_description.setAttribute('content', settings.description);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();
  }, [location.pathname, currentLanguage]);

  const getPath = (url: string) => {
    // Handle anchor links and regular paths
    if (url.startsWith('#')) {
      if (currentLanguage?.slug === defaultLanguage?.slug) {
        return `/${url}`;
      }
      return `/${currentLanguage?.slug}/${url}`;
    }

    // Extract path from full URLs and use current host
    if (url.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        url = urlObj.pathname + urlObj.search + urlObj.hash;
      } catch {
        // If URL parsing fails, use as-is
        return url;
      }
    }

    // Handle relative paths
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    if (currentLanguage?.slug === defaultLanguage?.slug) {
      return normalizedPath;
    }
    return `/${currentLanguage?.slug}${normalizedPath}`;
  };

  const handleClick = (path: string) => {
    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <div className="w-10 h-10 bg-white/40 flex align-middle justify-center rounded-sm">
        <Link to={getPath("/")} className="font-display text-xl font-bold text-foreground tracking-tighter">
          
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-10 max-w-[200px] object-contain"
            />
          ) : (
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-foreground text-background font-bold text-lg">
              A
            </span>
          )}
        </Link>
        </div>
        <nav className="flex items-center gap-8">
          {menuItems.length > 0 ? (
            menuItems.map((item) => {
              const itemPath = getPath(item.url);
              const isActive =
                itemPath === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(itemPath.replace("/#", "/"));

              if (item.url.startsWith('http')) {
                return (
                  <a
                    key={item.id}
                    href={itemPath}
                    target={item.target || "_self"}
                    className="text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground"
                  >
                    {item.title}
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={itemPath}
                  onClick={() => handleClick(itemPath)}
                  className={`text-sm font-mono transition-smooth relative ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })
          ) : (
            // Fallback to default menu if API fails
            <>
              <Link to={getPath("/")} className="text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to={getPath("/portfolio")} className="text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground">
                Portfolio
              </Link>
              <Link to={getPath("/#contact")} className="text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </>
          )}
          <div className="flex items-center gap-4 pl-4 border-l border-border">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
