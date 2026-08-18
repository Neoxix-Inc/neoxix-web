import {
  competencies,
  homelabLayers,
  profile,
  projects,
  roadmap,
  socialLinks,
  type Status,
} from "@/data/portfolio";
import { ArrowUpRight, CheckIcon, GithubIcon } from "./icons";

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`status status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}

function SocialLink() {
  return (
    <a className="social-link" href={socialLinks.github} target="_blank" rel="noreferrer">
      <GithubIcon />
      <span>GitHub</span>
      <ArrowUpRight className="link-arrow" />
    </a>
  );
}

export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />{profile.eyebrow}</p>
          <h1 id="hero-title">{profile.headline}</h1>
          <p className="hero-intro">{profile.introduction}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">Explore projects <ArrowUpRight /></a>
            <a className="button button-secondary" href="#contact">Get in touch</a>
          </div>
        </div>
        <aside className="profile-panel" aria-label="Profile summary">
          <div className="profile-topline"><span className="live-dot" /><span>PROFILE / 001</span></div>
          <div className="profile-monogram" aria-hidden="true">KA</div>
          <div className="profile-details">
            <p className="profile-name">{profile.name}</p>
            <p>Network & Systems Professional</p>
          </div>
          <div className="profile-meta">
            <p><span>Based in</span><strong>Canada</strong></p>
            <p><span>Focus</span><strong>Infrastructure</strong></p>
          </div>
        </aside>
      </div>
      <div className="container hero-footnote"><span className="availability-dot" />{profile.availability}</div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div><p className="eyebrow">01 / ABOUT</p><h2 id="about-title">A practical, evidence-led approach to technology.</h2></div>
        <div className="about-copy">
          <p className="lead">Neoxix is both my technical portfolio and a developing institutional platform for thoughtful infrastructure work.</p>
          <p>My work centres on learning by building: configuring systems, documenting decisions, testing expected behaviour, and diagnosing what does not work. Each project represents current hands-on experience or a clearly labelled learning objective.</p>
          <p>I am building toward junior roles where methodical troubleshooting, reliable documentation, and a strong foundation across networks and systems create immediate value.</p>
          <div className="principles">
            {[
              ["01", "Build deliberately"], ["02", "Document clearly"], ["03", "Validate with evidence"], ["04", "Improve continuously"],
            ].map(([number, text]) => <div key={number}><span>{number}</span><strong>{text}</strong></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompetenciesSection() {
  return (
    <section className="section section-tint" id="competencies" aria-labelledby="competencies-title">
      <div className="container">
        <SectionHeading eyebrow="02 / CORE COMPETENCIES" title="Foundations for dependable infrastructure." intro="Current experience developed through study, hands-on labs, and documented personal projects." />
        <div className="competency-grid">
          {competencies.map((item) => (
            <article className="competency-card" key={item.title}>
              <span className="card-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p>
              <ul>{item.skills.map((skill) => <li key={skill}><CheckIcon />{skill}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading eyebrow="03 / SELECTED PROJECTS" title="Learning made visible." intro="A selection of practical work, shown with transparent status and scope." />
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="project-body"><div className="project-title-row"><h3>{project.title}</h3><StatusBadge status={project.status} /></div><p>{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              <div className="project-outcome"><span>Learning outcome</span><p>{project.outcome}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomelabSection() {
  return (
    <section className="section homelab" id="homelab" aria-labelledby="homelab-title">
      <div className="container homelab-grid">
        <div>
          <p className="eyebrow eyebrow-light">04 / HOMELAB OVERVIEW</p><h2 id="homelab-title">A controlled environment for testing, breaking, and understanding.</h2>
          <p className="homelab-intro">The Neoxix Homelab supports practical exploration across the infrastructure stack. It is a personal learning environment—not a claim of production-scale operations.</p>
          <StatusBadge status="Deployed and improving" />
        </div>
        <ol className="lab-layers">
          {homelabLayers.map((layer, index) => <li key={layer.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{layer.label}</strong><p>{layer.detail}</p></div></li>)}
        </ol>
      </div>
    </section>
  );
}

export function RoadmapSection() {
  return (
    <section className="section section-tint" id="roadmap" aria-labelledby="roadmap-title">
      <div className="container">
        <SectionHeading eyebrow="05 / LEARNING ROADMAP" title="Progress with a clear next step." intro="Training and certification goals are reported as goals until they are completed and verified." />
        <div className="roadmap-list">
          {roadmap.map((item, index) => <article key={item.title}><div className="roadmap-marker"><span>{index + 1}</span></div><div className="roadmap-content"><p className="roadmap-phase">{item.phase}</p><div className="roadmap-title"><h3>{item.title}</h3><StatusBadge status={item.status} /></div><p>{item.description}</p></div></article>)}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div><p className="eyebrow eyebrow-light">06 / CONTACT</p><h2 id="contact-title">Let&apos;s build something reliable.</h2></div>
        <div><p className="contact-copy">I&apos;m open to conversations about junior network and systems roles, infrastructure projects, and thoughtful technical collaboration in Canada.</p><div className="socials"><SocialLink /></div></div>
      </div>
    </section>
  );
}
