import { useParams, Link } from "react-router-dom";
import { getProjectBySlug } from "@/data/projects";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) return <NotFound />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-20">
        <div className="container max-w-5xl">
          {/* Back link */}
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Powrót do portfolio
          </Link>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h1 className="text-display text-3xl md:text-5xl">{project.title}</h1>
            {project.isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-muted text-muted-foreground">
                Archiwum
              </span>
            )}
          </div>

          <p className="text-meta mb-8">
            {new Date(project.date).toLocaleDateString("pl-PL", {
              year: "numeric",
              month: "long",
            })}
          </p>

          {/* Featured image */}
          <div className="rounded-xl overflow-hidden card-shadow mb-10">
            <img
              src={project.featuredImage}
              alt={project.title}
              className="w-full max-h-[70vh] object-cover"
            />
          </div>

          {/* Description */}
          <p className="text-body text-lg leading-relaxed mb-8 max-w-3xl">
            {project.description}
          </p>

          {/* Tags */}
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

          {/* Live URL */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background font-mono text-sm transition-smooth hover:opacity-90 active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4" /> Odwiedź stronę
            </a>
          )}

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <div className="mt-16">
              <p className="text-meta mb-6">{"{ Galeria }"}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden card-shadow">
                    <img
                      src={img}
                      alt={`${project.title} - ${i + 1}`}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
