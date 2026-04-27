import { useEffect, useState } from "react";
import { getPaginatedProjects } from "@/data/projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import GeometricBackground from "@/components/GeometricBackground";
import { useLanguage } from "@/context/LanguageContext";
import { getPageBySlug } from '@/lib/api-switcher';
import { WordPressPage } from "@/lib/wordpress.types";

const Portfolio = () => {

  const { currentLanguage, defaultLanguage } = useLanguage();
  const [page, setPage] = useState(1);
  const [ppage, setPPage] = useState<WordPressPage | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);

   useEffect(() => {
      if (!currentLanguage) return;
      getPageBySlug('portfolio', currentLanguage.slug).then(setPPage);
  }, [currentLanguage]);

  useEffect(() => {
    if (!currentLanguage) return;
    getPaginatedProjects(page, 9, currentLanguage.slug).then((result) => {
      setProjects(result.projects);
      setTotalPages(result.totalPages);
    });
  }, [page, currentLanguage]);

  console.log(projects);

  return (
    <div className="min-h-screen relative">
      <GeometricBackground />
      <Header />
      <main className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-display text-4xl md:text-6xl text-center mb-16">
            {ppage?.title.rendered}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 rounded-lg font-mono text-sm transition-smooth ${
                    page === i + 1
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
