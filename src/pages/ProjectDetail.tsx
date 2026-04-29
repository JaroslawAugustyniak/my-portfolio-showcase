import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getProjectBySlug } from "@/data/projects";
import type { Project } from "@/data/projects";
import type { WordPressPost } from "@/lib/wordpress.types";
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";
import NotFound from "./NotFound";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import ContactSection from "@/components/ContactSection";

const transformWordPressPostToProject = (post: WordPressPost): Project => {
  const featuredImageUrl =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post.featured_image?.source_url ||
    '';

  const gallery = post.meta?.gallery || [];
  const tags = post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) ||
               (Array.isArray(post.tags) && typeof post.tags[0] === 'string' ? post.tags : []);

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    description: post.content.rendered,
    featuredImage: featuredImageUrl,
    liveUrl: post.meta?.live_url || '',
    status: post.acf?.status || 'progress',
    date: post.date,
    acf: post.acf || {},
    tags: tags,
    gallery: gallery,
  };
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!slug || !currentLanguage) {
      setProject(null);
      return;
    }
    getProjectBySlug(slug, 'posts', currentLanguage.slug)
      .then((result) => {
        if (result) {
          const transformed = transformWordPressPostToProject(result);
          setProject(transformed);
        } else {
          setProject(null);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch project:', err);
        setProject(null);
      });
  }, [slug, currentLanguage]);

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => {
    if (!project) return;
    setLightboxIdx((i) => (i === null ? null : (i - 1 + project?.acf?.galeria.length) % project?.acf?.galeria.length));
  }, [project]);
  const next = useCallback(() => {
    if (!project) return;
    setLightboxIdx((i) => (i === null ? null : (i + 1) % project?.acf?.galeria.length));
  }, [project]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, close, prev, next]);

  // Still loading
  if (project === undefined) {
    return (
      <div className="min-h-screen relative">
        <GeometricBackground />
        <Header />
        <main className="py-12 md:py-20 flex items-center justify-center">
          <p className="text-muted-foreground">{getTranslation(currentLanguage?.slug || 'pl', 'loading')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Project not found
  if (!slug || project === null) return <NotFound />;
  
  return (
    <div className="min-h-screen relative">
      <GeometricBackground />
      <Header />
      <main className="py-12 md:py-20">
        <div className="container max-w-5xl">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {getTranslation(currentLanguage?.slug || 'pl', 'backToProjects')}
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h1 className="text-display text-3xl md:text-5xl">{project.title}</h1>
            {project.status === "online" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
                {getTranslation(currentLanguage?.slug || 'pl', 'projectStatusOnline')}
              </span>
            ) : project.status === "progress" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[hsl(var(--highlight)/0.15)] text-[hsl(var(--highlight))] border border-[hsl(var(--highlight)/0.3)]">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--highlight))]" />
                {getTranslation(currentLanguage?.slug || 'pl', 'projectStatusProgress')}
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-muted text-muted-foreground">
                {getTranslation(currentLanguage?.slug || 'pl', 'projectStatusArchive')}
              </span>
            )}
          </div>

          <p className="text-meta mb-8">
            {new Date(project.date).toLocaleDateString("pl-PL", {
              year: "numeric",
              month: "long",
            })}
          </p>

          <div className="rounded-xl overflow-hidden card-shadow mb-10">
            <img
              src={project.featuredImage}
              alt={project.title}
              className="w-full max-h-[70vh] object-cover"
            />
          </div>

          <div className="text-body text-lg leading-relaxed mb-8 max-w-3xl content" dangerouslySetInnerHTML={{ __html: project?.description || '' }} />

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-muted text-muted-foreground font-mono text-[11px] rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background font-mono text-sm transition-smooth hover:opacity-90 active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4" /> {getTranslation(currentLanguage?.slug || 'pl', 'visitPage')}
            </a>
          )}

          {/* Masonry Gallery (3 columns) */}
          {project?.acf?.galeria && project?.acf?.galeria.length > 0 && (
            <div className="mt-16">
              <p className="text-meta mb-6">{getTranslation(currentLanguage?.slug || 'pl', 'galleryLabel')}</p>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
                {project.acf?.galeria.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    className="group block w-full mb-4 break-inside-avoid rounded-xl overflow-hidden card-shadow transition-smooth hover:card-shadow-hover focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      src={img.url}
                      alt={`${project.title} - ${i + 1}`}
                      className="w-full h-auto object-cover transition-smooth group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <ContactSection />
      <Footer />

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition-smooth"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition-smooth"
            aria-label="Poprzedni"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition-smooth"
            aria-label="Następny"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <img
            src={project?.acf?.galeria[lightboxIdx]?.url}
            alt={`${project.title} - ${lightboxIdx + 1}`}
            className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-card/80 border border-border font-mono text-xs text-muted-foreground">
            {lightboxIdx + 1} / {project?.acf?.galeria.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
