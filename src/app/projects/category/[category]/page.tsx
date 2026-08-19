import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectList } from "@/components/project-filter";
import { Footer, Header } from "@/components/site-shell";
import { getProjectCategory, projectCategoryRoutes, projects } from "@/data/portfolio";

export function generateStaticParams() {
  return projectCategoryRoutes.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/category/[category]">): Promise<Metadata> {
  const category = getProjectCategory((await params).category);
  if (!category) return {};
  const title = `${category.name} projects | Neoxix`;
  const description = `Published ${category.name.toLowerCase()} labs and projects from the Neoxix technical portfolio.`;
  return { title, description, alternates: { canonical: `/projects/category/${category.slug}` }, openGraph: { title, description, url: `/projects/category/${category.slug}` } };
}

export default async function CategoryPage({ params }: PageProps<"/projects/category/[category]">) {
  const category = getProjectCategory((await params).category);
  if (!category) notFound();
  const categoryProjects = projects.filter((project) => project.categories.includes(category.name));

  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Header />
    <main id="main-content" className="category-page">
      <header className="category-hero"><div className="container">
        <Link className="back-link" href="/#projects">← All projects</Link>
        <p className="eyebrow eyebrow-light">PROJECT CATEGORY</p>
        <h1>{category.name}</h1>
        <p>Labs and projects assigned to {category.name}. This page is generated from the centralized project data.</p>
      </div></header>
      <section className="section" aria-label={`${category.name} projects`}><div className="container"><ProjectList projects={categoryProjects} emptyCategory={category.name.toLowerCase()} /></div></section>
    </main>
    <Footer />
  </>;
}
