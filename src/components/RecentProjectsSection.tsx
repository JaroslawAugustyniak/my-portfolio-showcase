import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getRecentProjects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

const RecentProjectsSection = () => {
  const projects = getRecentProjects(6);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setItemsPerView(1);
      else if (w < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, projects.length - itemsPerView);

  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  const prev = () => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <p className="text-meta">{"< Ostatnie projekty >"}</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth"
          >
            Wszystkie projekty <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-smooth"
              style={{
                transform: `translateX(calc(${-current} * (100% / ${itemsPerView} + 24px / ${itemsPerView} * ${itemsPerView - 1})))`,
              }}
            >
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className="flex-shrink-0"
                  style={{ width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})` }}
                >
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-card card-shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Poprzedni"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-card card-shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Następny"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-smooth ${
                i === current ? "bg-foreground w-4" : "bg-border"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentProjectsSection;
