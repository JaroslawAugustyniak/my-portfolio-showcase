import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { currentLanguage, defaultLanguage } = useLanguage();

  const getPath = (path: string) => {
    if (currentLanguage?.slug === defaultLanguage?.slug) {
      return path;
    }
    return `/${currentLanguage?.slug}${path}`;
  };

  return (
  <footer className="border-t border-border py-8 mt-24">
    <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <nav className="flex items-center gap-6">
        <Link to={getPath("/")} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth">
          __home
        </Link>
        <Link to={getPath("/portfolio")} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth">
          __portfolio
        </Link>
        <Link to={getPath("/#contact")} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth">
          __contact
        </Link>
      </nav>
      <p className="text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} Augustyniak Development
      </p>
    </div>
  </footer>
  );
};

export default Footer;
