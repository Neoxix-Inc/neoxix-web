import { Footer, Header } from "@/components/site-shell";
import {
  AboutSection,
  CompetenciesSection,
  ContactSection,
  HeroSection,
  HomelabSection,
  ProjectsSection,
  RoadmapSection,
} from "@/components/portfolio-sections";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <CompetenciesSection />
        <ProjectsSection />
        <HomelabSection />
        <RoadmapSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
