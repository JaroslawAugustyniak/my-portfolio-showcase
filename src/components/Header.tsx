import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { getMenuItems, getSiteSettings } from '@/lib/api-switcher';
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
        // Fetch settings
        const settings = await getSiteSettings(undefined, currentLanguage?.slug);

        if (settings.logo) {
          setLogoUrl(settings.logo);
        }
        if (settings.favicon) {
          const favicon = document.querySelector("link[rel='icon']");
          if (favicon) {
            favicon.setAttribute('href', settings.favicon);
          }
        }

        // Extract slug from current path
        let pageSlug: string | null = 'strona-glowna';
        let pathWithoutLang = location.pathname;

        // Remove language prefix if present
        if (currentLanguage?.slug && pathWithoutLang.startsWith(`/${currentLanguage.slug}/`)) {
          pathWithoutLang = pathWithoutLang.replace(`/${currentLanguage.slug}`, '');
        } else if (currentLanguage?.slug && pathWithoutLang.startsWith(`/${currentLanguage.slug}`)) {
          pathWithoutLang = pathWithoutLang.replace(`/${currentLanguage.slug}`, '');
        }

        // Remove leading slash
        pathWithoutLang = pathWithoutLang.replace(/^\//, '');

        //remove ending slash
        pathWithoutLang = pathWithoutLang.replace(/\/$/, '');

        // Extract slug
        if (pathWithoutLang.startsWith('projekt/')) {
          pageSlug = pathWithoutLang.replace(/^projekt\//, '');
        } else if (pathWithoutLang === 'portfolio') {
          pageSlug = 'portfolio';
        } else if (pathWithoutLang === '') {
          pageSlug = 'strona-glowna';
        } else {
          pageSlug = pathWithoutLang;
        }


        console.log('Header debug:', { pathname: location.pathname, pathWithoutLang, pageSlug, currentLang: currentLanguage?.slug, defaultLang: defaultLanguage?.slug });

        // Find page or post settings by slug
        let pageSettings = null;
        if (settings.pages) {
          pageSettings = settings.pages.find((p: any) => p.slug === pageSlug);
        }
        if (!pageSettings && settings.posts) {
          pageSettings = settings.posts.find((p: any) => p.slug === pageSlug);
        }

        console.log(pageSettings);

        // Use page-specific settings or fallback to global settings
        const title = pageSettings?.title || settings.title;
        const description = pageSettings?.description || settings.description;
        const image = pageSettings?.image || settings.image;

        if (title) {
          document.title = title;
          const og_title = document.querySelector("meta[property='og:title']");
          if (og_title) {
            og_title.setAttribute('content', title);
          }
        }

        if (image) {
          const og_image = document.querySelector("meta[property='og:image']");
          const tw_image = document.querySelector("meta[name='twitter:image']");
          if (og_image) {
            og_image.setAttribute('content', image);
          }
          if (tw_image) {
            tw_image.setAttribute('content', image);
          }
        }

        if (description) {
          const metaDescription = document.querySelector("meta[name='description']");
          if (metaDescription) {
            metaDescription.setAttribute('content', description);
          }
          const og_description = document.querySelector("meta[property='og:description']");
          if (og_description) {
            og_description.setAttribute('content', description);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();
  }, [location.pathname, currentLanguage, defaultLanguage]);

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

  const handleClick = (path: string, e?: React.MouseEvent) => {
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
        // Element exists on current page, scroll to it without changing URL
        e?.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // If element doesn't exist, allow normal link navigation
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link to={getPath("/")} className="font-display text-xl font-bold text-foreground tracking-tighter flex-shrink-0">
          {logoUrl ? (
            <div className="rounded flex align-middle justify-center">
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
                  onClick={(e) => handleClick(itemPath, e as any)}
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
                    onClick={(e) => {
                      handleClick(itemPath, e as any);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.title}
                  </Link>
                );
              })
            ) : (
              [
                <Link key="home" to={getPath("/")} className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>,
                <Link key="portfolio" to={getPath("/portfolio")} className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</Link>,
                <Link key="contact" to={getPath("/#contact")} className="block text-sm font-mono text-muted-foreground hover:text-foreground py-2" onClick={(e) => { handleClick(getPath("/#contact"), e as any); setIsMobileMenuOpen(false); }}>Contact</Link>,
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
