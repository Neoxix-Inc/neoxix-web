import Link from "next/link";
import { projectCategoryRoutes, type Project } from "@/data/portfolio";
import { TechnologyList } from "@/data/technologies";
import { ArrowUpRight } from "./icons";

export function ProjectList({ projects, emptyCategory }: { projects: readonly Project[]; emptyCategory?: string }) {
  if (!projects.length) {
    return (
      <div className="project-empty" role="status">
        <h2>No published {emptyCategory} projects yet.</h2>
        <p>This category is ready for future labs. A project will appear here automatically when it is published with this category in the centralized portfolio data.</p>
        <Link href="/portfolio#projects">View all projects</Link>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <article className="project-card" key={project.slug}>
          <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
          <div className="project-body">
            <div className="project-title-row"><h3><Link className="card-primary-link" href={`/projects/${project.slug}`}>{project.title}</Link></h3><span className={`status status-${project.status.toLowerCase().replaceAll(" ", "-")}`}>{project.status}</span></div>
            <p>{project.summary}</p>
            <div className="tag-list">{project.categories.map((category) => <Link key={category} href={`/projects/category/${category.toLowerCase()}`}>{category}</Link>)}</div>
            <TechnologyList technologies={project.technologies} compact />
          </div>
          <Link className="project-link" href={`/projects/${project.slug}`} aria-label={`View details for ${project.title}`}>View project <ArrowUpRight /></Link>
        </article>
      ))}
    </div>
  );
}

export function ProjectFilter({ projects }: { projects: readonly Project[] }) {
  return (
    <div>
      <nav className="project-filters" aria-label="Browse projects by category">
        <Link className="is-active" href="/portfolio#projects" aria-current="page">All projects</Link>
        {projectCategoryRoutes.map(({ name, slug }) => <Link key={slug} href={`/projects/category/${slug}`}>{name}</Link>)}
      </nav>
      <p className="filter-result">Showing all {projects.length} {projects.length === 1 ? "project" : "projects"}</p>
      <ProjectList projects={projects} />
    </div>
  );
}
