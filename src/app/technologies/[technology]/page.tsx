import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/site-shell";
import { ArrowUpRight } from "@/components/icons";
import {
  competencies,
  getTechnologyLevel,
  projects,
  technologyIds,
  type TechnologyId,
} from "@/data/portfolio";
import { technologyCatalog } from "@/data/technologies";

export const dynamicParams = false;

export function generateStaticParams() {
  return technologyIds.map((technology) => ({ technology }));
}

function getTechnology(id: string) {
  return technologyIds.includes(id as TechnologyId)
    ? technologyCatalog[id as TechnologyId]
    : undefined;
}

export async function generateMetadata({ params }: PageProps<"/technologies/[technology]">): Promise<Metadata> {
  const technology = getTechnology((await params).technology);
  if (!technology) return {};
  const title = `${technology.label} | Technologies | Neoxix`;
  return {
    title,
    description: technology.description,
    alternates: { canonical: `/technologies/${technology.id}` },
    openGraph: { title, description: technology.description, url: `/technologies/${technology.id}` },
  };
}

export default async function TechnologyPage({ params }: PageProps<"/technologies/[technology]">) {
  const technology = getTechnology((await params).technology);
  if (!technology) notFound();

  const level = getTechnologyLevel(technology.id);
  if (!level) notFound();
  const relatedCompetencies = competencies.filter((competency) =>
    competency.technologies.some(({ id }) => id === technology.id),
  );
  const relatedProjects = projects.filter((project) =>
    project.technologies.some(({ id }) => id === technology.id),
  );
  const Icon = technology.Icon;

  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Header />
    <main id="main-content" className="technology-detail">
      <header className="technology-detail-hero"><div className="container">
        <Link className="back-link" href="/#technologies">← All technologies</Link>
        <div className="technology-detail-heading">
          <Icon aria-hidden="true" focusable="false" />
          <div><p className="eyebrow eyebrow-light">TECHNOLOGY / {level}</p><h1>{technology.label}</h1></div>
        </div>
        <p className="detail-summary">{technology.description}</p>
        <p className="technology-level-note"><strong>{level}</strong> describes current portfolio exposure only, not professional mastery or production-scale use.</p>
      </div></header>
      <div className="container technology-detail-layout">
        <section aria-labelledby="competencies-heading">
          <h2 id="competencies-heading">Related competencies</h2>
          {relatedCompetencies.length ? <div className="related-competencies">{relatedCompetencies.map((competency) => (
            <article key={competency.title}>
              <h3><Link href={`/projects/category/${competency.projectCategory.toLowerCase()}`}>{competency.title} <span aria-hidden="true">→</span></Link></h3>
              <p>{competency.description}</p>
              <ul>{competency.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </article>
          ))}</div> : <p className="related-empty">No competency assignment is currently published for this technology.</p>}
        </section>
        <section aria-labelledby="related-projects-heading">
          <h2 id="related-projects-heading">Related published projects and labs</h2>
          {relatedProjects.length ? <div className="technology-projects">{relatedProjects.map((project) => (
            <article key={project.slug}>
              <p className="eyebrow">{project.categories.join(" · ")}</p>
              <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
              <p>{project.summary}</p>
              <Link className="project-link" href={`/projects/${project.slug}`}>View project <ArrowUpRight /></Link>
            </article>
          ))}</div> : <div className="related-empty"><h3>No related project published yet.</h3><p>Evidence will appear here when a project or lab using {technology.label} is published and assigned in the centralized portfolio data.</p></div>}
        </section>
      </div>
    </main>
    <Footer />
  </>;
}
