import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border py-8 mt-24">
    <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <nav className="flex items-center gap-6">
        <Link to="/" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth">
          __home
        </Link>
        <Link to="/portfolio" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth">
          __portfolio
        </Link>
        <Link to="/#contact" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth">
          __contact
        </Link>
      </nav>
      <p className="text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} Augustyniak Development
      </p>
    </div>
  </footer>
);

export default Footer;
