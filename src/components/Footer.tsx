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
      
      <p className="text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} {settings?.name}.
      </p>
    </div>
  </footer>
  );
};

export default Footer;
