import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EvidenceGallery } from "@/components/evidence-gallery";
import { Footer, Header } from "@/components/site-shell";
import { ArrowUpRight } from "@/components/icons";
import { getProject, projects } from "@/data/portfolio";
import { TechnologyList } from "@/data/technologies";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const title = `${project.title} | Neoxix`;
  return { title, description: project.summary, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title, description: project.summary, url: `/projects/${project.slug}`, type: "article" } };
}

function DetailList({ title, items }: { title: string; items: readonly string[] }) {
  if (!items.length) return null;
  return <section className="detail-block"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a><Header />
    <main id="main-content" className="project-detail">
      <header className="project-detail-hero"><div className="container">
        <Link className="back-link" href="/#projects">← All projects</Link>
        <p className="eyebrow eyebrow-light">PROJECT / {project.categories.join(" · ")}</p>
        <h1>{project.title}</h1><p className="detail-summary">{project.summary}</p>
        <div className="detail-meta"><span className={`status status-${project.status.toLowerCase().replaceAll(" ", "-")}`}>{project.status}</span><TechnologyList technologies={project.technologies} /></div>
      </div></header>
      <div className="container detail-layout"><div>
        <DetailList title="Objectives" items={project.objectives} /><DetailList title="Topology" items={project.topology} />
        <DetailList title="Implementation" items={project.implementation} /><DetailList title="Troubleshooting" items={project.troubleshooting} />
        <DetailList title="Results" items={project.results} /><DetailList title="Demonstrated skills" items={project.demonstratedSkills} />
        <section className="detail-block"><h2>Evidence gallery</h2><EvidenceGallery images={project.gallery} /></section>
      </div><aside className="detail-sidebar" aria-label="Project resources"><h2>Project links</h2>
        {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight /></a> : <p>GitHub link not published.</p>}
        {project.documentationUrl ? <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer">Documentation <ArrowUpRight /></a> : <p>Documentation link not published.</p>}
        <small>Links are shown only when a verified public resource exists.</small>
      </aside></div>
    </main><Footer />
  </>;
}
