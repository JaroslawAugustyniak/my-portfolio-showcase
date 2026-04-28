import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { getMenuItems, getSiteSettings, getPostBySlug } from '@/lib/api-switcher';
import type { MenuItem } from "@/lib/wordpress.types";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

        if (settings?.seo?.og_image) {
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
    // Handle anchor links - check if element exists on current page
    let anchorId: string | null = null;

    if (path.startsWith("/#")) {
      anchorId = path.replace("/#", "");
    } else if (path.startsWith(`/${currentLanguage?.slug}/#`)) {
      anchorId = path.replace(`/${currentLanguage?.slug}/#`, "");
    }

    if (anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        // Element exists on current page, scroll to it
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Element doesn't exist on current page, navigate to root with anchor
        const basePath = currentLanguage?.slug === defaultLanguage?.slug ? "/" : `/${currentLanguage?.slug}`;
        window.location.href = `${basePath}#${anchorId}`;
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link to={getPath("/")} className="font-display text-xl font-bold text-foreground tracking-tighter flex-shrink-0">
          {logoUrl ? (
            <div className="rounded bg-white/35 flex align-middle justify-center">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-10 max-w-[200px] object-contain"
            />
            </div>
          ) : ( '' )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-end ml-8">
          {menuItems.length > 0 ? (
            menuItems.map((item) => {
              const itemPath = getPath(item.url);
              const isActive = false;
                // itemPath === "/"
                //   ? location.pathname === "/"
                //   : location.pathname.startsWith(itemPath.replace("/#", "/"));

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
            [
              <Link key="home" to={getPath("/")} className="hidden md:inline text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground">
                Home
              </Link>,
              <Link key="portfolio" to={getPath("/portfolio")} className="hidden md:inline text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground">
                Portfolio
              </Link>,
              <Link key="contact" to={getPath("/#contact")} className="hidden md:inline text-sm font-mono transition-smooth text-muted-foreground hover:text-foreground">
                Contact
              </Link>,
            ]
          )}
          <div className="flex items-center gap-4 pl-4 border-l border-border">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:bg-foreground/10 rounded"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <nav className="container py-4 space-y-3">
            {menuItems.length > 0 ? (
              menuItems.map((item) => {
                const itemPath = getPath(item.url);
                if (item.url.startsWith('http')) {
                  return (
                    <a
                      key={item.id}
                      href={itemPath}
                      target={item.target || "_self"}
                      className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2 transition-smooth"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.title}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    to={itemPath}
                    className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2 transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                );
              })
            ) : (
              [
                <Link key="home" to={getPath("/")} className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>,
                <Link key="portfolio" to={getPath("/portfolio")} className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</Link>,
                <Link key="contact" to={getPath("/#contact")} className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>,
              ]
            )}
          </nav>
        </div>
      )}

      {/* Fix scrollbar shift - prevent layout shift when scrollbar appears/disappears */}
      <style>{`
        html {
          overflow-y: scroll;
          scrollbar-gutter: stable;
        }
      `}</style>
    </header>
  );
};

export default Header;
