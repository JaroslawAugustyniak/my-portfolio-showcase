import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

import { useState, useEffect } from "react";
import { getMenuItems, getSiteSettings } from '@/lib/api-switcher';
import { MenuItem } from "@/lib/wordpress.types";

const Footer = () => {
  const { currentLanguage, defaultLanguage } = useLanguage();
  const location = useLocation();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});

  
  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => setSettings({}));

    if (!currentLanguage) return;
    getMenuItems('menu', currentLanguage.slug)
      .then(setMenuItems)
      .catch(() => setMenuItems([]));
  }, [currentLanguage]);

  const getPath = (path: string) => {
    if (currentLanguage?.slug === defaultLanguage?.slug) {
      return path;
    }
    return `/${currentLanguage?.slug}${path}`;
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
  <footer className="border-t border-border py-8 mt-24">
    <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <nav className="flex items-center gap-6">
       
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
            <>

            </>
          )}
      </nav>
      <p className="text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} {settings?.name}.
      </p>
    </div>
  </footer>
  );
};

export default Footer;
