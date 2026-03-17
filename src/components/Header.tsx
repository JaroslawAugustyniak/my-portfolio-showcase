import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "__home", path: "/" },
  { label: "__portfolio", path: "/portfolio" },
  { label: "__contact", path: "/#contact" },
];

const Header = () => {
  const location = useLocation();

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
        <Link to="/" className="font-display text-xl font-bold text-foreground tracking-tighter">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-foreground text-background font-bold text-lg">
            A
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path.replace("/#", "/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleClick(item.path)}
                className={`text-sm font-mono transition-smooth relative ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
