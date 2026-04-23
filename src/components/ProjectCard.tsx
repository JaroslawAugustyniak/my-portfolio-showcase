import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Link
    to={`/projekt/${project.slug}`}
    className="group block rounded-xl card-shadow overflow-hidden bg-card transition-smooth hover:card-shadow-hover hover:-translate-y-1"
  >
    <div className="aspect-video overflow-hidden">
      <img
        src={project.featuredImage}
        alt={project.title}
        className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg font-semibold text-foreground tracking-tight">
          {project.title}
        </h3>
        {project.isLive ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))]" />
            Live
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-muted text-muted-foreground">
            Archiwum
          </span>
        )}
      </div>
      <p className="text-meta text-[10px]">
        {new Date(project.date).toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
        })}
      </p>
    </div>
  </Link>
);

export default ProjectCard;
