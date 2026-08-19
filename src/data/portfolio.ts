export const projectCategories = [
  "Networking", "Systems", "Cybersecurity", "Automation", "Cloud", "AI", "Web",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type TechnologyLevel = "Experience" | "Learning" | "Planned";
export type CertificationStatus = "Earned" | "In progress" | "Planned";
export type Status =
  | "Operational and validated"
  | "Deployed and improving"
  | "Under diagnosis"
  | "In progress"
  | "Planned";

export const technologyIds = [
  "cisco", "fortinet", "vmware", "linux", "ubuntu", "windows", "powershell",
  "terraform", "git", "github", "docker", "wazuh", "wireshark", "nextjs",
  "typescript", "react", "tailwind", "vercel", "python", "ansible",
  "netmiko", "paramiko",
] as const;

export type TechnologyId = (typeof technologyIds)[number];

export type EvidenceImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type TechnologyReference = { id: TechnologyId; level: TechnologyLevel };

export type Certification = {
  name: string;
  issuer: string;
  status: CertificationStatus;
  statement: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  skills: readonly string[];
  certificateImage?: EvidenceImage;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  status: Status;
  categories: readonly ProjectCategory[];
  technologies: readonly TechnologyReference[];
  objectives: readonly string[];
  topology: readonly string[];
  implementation: readonly string[];
  troubleshooting: readonly string[];
  results: readonly string[];
  demonstratedSkills: readonly string[];
  githubUrl?: string;
  documentationUrl?: string;
  gallery: readonly EvidenceImage[];
};

export type Competency = {
  number: string;
  title: string;
  description: string;
  skills: readonly string[];
  technologies: readonly TechnologyReference[];
  projectCategory: ProjectCategory;
};

export const siteConfig = {
  canonicalUrl: "https://neoxix.ca",
  githubUrl: "https://github.com/Neoxix-Inc",
  name: "Neoxix",
} as const;

export const navigation = [
  { label: "About", href: "/#about" },
  { label: "Competencies", href: "/#competencies" },
  { label: "Technologies", href: "/#technologies" },
  { label: "Projects", href: "/#projects" },
  { label: "Certifications", href: "/#certifications" },
  { label: "Homelab", href: "/#homelab" },
  { label: "Roadmap", href: "/#roadmap" },
] as const;

export const profile = {
  eyebrow: "NETWORK & SYSTEMS PORTFOLIO",
  name: "Kodjo Mathias Akah",
  headline: "Building practical infrastructure, one system at a time.",
  introduction: "I am a network and systems professional developing hands-on experience across infrastructure, security, automation, and homelab operations.",
  availability: "Open to junior infrastructure opportunities and technical collaboration in Canada.",
} as const;

export const competencies: readonly Competency[] = [
  {
    number: "01", title: "Networking",
    description: "Building and troubleshooting routed and switched lab environments with careful documentation and validation.",
    skills: ["TCP/IP", "VLANs", "Routing", "DNS & DHCP", "VPN fundamentals"],
    technologies: [{ id: "cisco", level: "Experience" }, { id: "fortinet", level: "Experience" }, { id: "wireshark", level: "Experience" }], projectCategory: "Networking",
  },
  {
    number: "02", title: "Systems",
    description: "Administering Windows and Linux systems in a controlled lab, with attention to reliable services and repeatable operations.",
    skills: ["Windows Server", "Linux", "Active Directory", "Virtualization", "Backup basics"],
    technologies: [{ id: "linux", level: "Experience" }, { id: "ubuntu", level: "Experience" }, { id: "windows", level: "Experience" }, { id: "vmware", level: "Experience" }], projectCategory: "Systems",
  },
  {
    number: "03", title: "Security",
    description: "Applying foundational hardening, segmentation, access-control, and diagnostic practices to lab infrastructure.",
    skills: ["Firewall policy", "Segmentation", "Access control", "Log review", "Hardening"],
    technologies: [{ id: "fortinet", level: "Experience" }, { id: "wazuh", level: "Learning" }, { id: "wireshark", level: "Experience" }], projectCategory: "Cybersecurity",
  },
  {
    number: "04", title: "Automation",
    description: "Learning to make infrastructure tasks more consistent through code, scripts, version control, and reusable examples.",
    skills: ["Terraform", "PowerShell", "Bash", "Git", "API fundamentals"],
    technologies: [{ id: "powershell", level: "Experience" }, { id: "terraform", level: "Learning" }, { id: "git", level: "Experience" }, { id: "github", level: "Experience" }], projectCategory: "Automation",
  },
] as const;

export const projects: readonly Project[] = [
  {
    slug: "neoxix-homelab", title: "Neoxix Homelab",
    summary: "A personal environment for testing network services, virtualization, system administration, and security controls without overstating production use.",
    status: "Deployed and improving", categories: ["Networking", "Systems", "Cybersecurity"],
    technologies: [{ id: "vmware", level: "Experience" }, { id: "linux", level: "Experience" }, { id: "ubuntu", level: "Experience" }, { id: "windows", level: "Experience" }, { id: "wazuh", level: "Learning" }],
    objectives: ["Create a repeatable platform for structured technical practice."],
    topology: ["Administrative clients, network controls, virtualized compute, and supporting services."],
    implementation: ["Built as a controlled personal learning environment across infrastructure layers."],
    troubleshooting: ["Testing and diagnosis are documented as individual labs mature."],
    results: ["A deployed, evolving environment for network and systems practice."],
    demonstratedSkills: ["Virtualization", "System administration", "Network segmentation", "Documentation"], gallery: [],
  },
  {
    slug: "fortigate-ikev2-vpn-lab", title: "FortiGate IKEv2 VPN laboratory",
    summary: "A focused remote-access VPN lab in which remote access from an iPad over a cellular connection to authorized internal resources has been validated.",
    status: "Operational and validated", categories: ["Networking", "Cybersecurity"],
    technologies: [{ id: "fortinet", level: "Experience" }, { id: "wireshark", level: "Experience" }],
    objectives: ["Validate remote access to authorized internal resources from an external network."],
    topology: ["iPad client over cellular connectivity, FortiGate VPN termination, and authorized internal resources."],
    implementation: ["Configured and tested an IKEv2/IPsec remote-access laboratory."],
    troubleshooting: ["Validated connectivity and expected access behavior without publishing sensitive configuration details."],
    results: ["Remote access from an iPad over cellular connectivity was operational and validated."],
    demonstratedSkills: ["IKEv2/IPsec", "Firewall policy", "Remote-access validation", "Troubleshooting"], gallery: [],
  },
  {
    slug: "terraform-homelab-examples", title: "Terraform homelab examples",
    summary: "Small, version-controlled infrastructure examples built to practise declarative configuration, reviewable changes, and reusable patterns.",
    status: "In progress", categories: ["Automation", "Cloud", "Systems"],
    technologies: [{ id: "terraform", level: "Learning" }, { id: "git", level: "Experience" }, { id: "github", level: "Experience" }],
    objectives: ["Develop reusable, reviewable infrastructure examples."], topology: ["Small isolated examples rather than a production environment."],
    implementation: ["Declarative configurations are version controlled as the learning collection grows."],
    troubleshooting: ["Validation notes will be expanded alongside each example."], results: ["A growing collection of documented learning examples."],
    demonstratedSkills: ["Infrastructure as code", "Version control", "Change review"], gallery: [],
  },
  {
    slug: "neoxix-sdk", title: "Neoxix SDK",
    summary: "A PowerShell automation module for PowerShell 5.1 and PowerShell 7+, with structured logging, Pester tests, PSScriptAnalyzer, build automation, and Windows/Linux CI.",
    status: "In progress", categories: ["Automation", "Systems"],
    technologies: [{ id: "powershell", level: "Experience" }, { id: "github", level: "Experience" }, { id: "windows", level: "Experience" }, { id: "linux", level: "Experience" }],
    objectives: ["Build a maintainable, testable PowerShell automation module."], topology: ["Cross-platform module development and CI validation on Windows and Linux."],
    implementation: ["Structured logging, Pester tests, PSScriptAnalyzer, and build automation are part of the module workflow."],
    troubleshooting: ["Module development and validation remain in progress."], results: ["Cross-platform module development and validation remain in progress."],
    demonstratedSkills: ["PowerShell", "Automated testing", "Static analysis", "Continuous integration"],
    githubUrl: "https://github.com/Neoxix-Inc/neoxix-sdk", gallery: [],
  },
  {
    slug: "neoxix-portfolio", title: "Neoxix portfolio",
    summary: "A responsive, accessible portfolio built with a typed content architecture and a deliberately small interactive client surface.",
    status: "Deployed and improving", categories: ["Web"],
    technologies: [{ id: "nextjs", level: "Experience" }, { id: "typescript", level: "Experience" }, { id: "react", level: "Experience" }, { id: "tailwind", level: "Experience" }, { id: "vercel", level: "Experience" }],
    objectives: ["Present practical work clearly and make future labs easy to add."], topology: ["Static App Router pages with focused client components for interaction."],
    implementation: ["Typed project data, reusable detail pages, accessible category navigation, and progressive reveal behavior."], troubleshooting: [],
    results: ["A scalable portfolio foundation with transparent project status and evidence handling."],
    demonstratedSkills: ["Next.js", "TypeScript", "Responsive design", "Accessibility"], gallery: [],
  },
] as const;

export const homelabLayers = [
  { label: "Access", detail: "Administrative workstations and test clients" },
  { label: "Network", detail: "Routing, switching, segmentation, and firewall labs" },
  { label: "Compute", detail: "Virtualized Windows and Linux workloads" },
  { label: "Services", detail: "Identity, name resolution, addressing, and monitoring practice" },
] as const;

export const roadmap = [
  { phase: "Current focus", title: "CCNA preparation", status: "In progress" as const, description: "Strengthening networking fundamentals through structured study, labs, and troubleshooting practice. No certification is claimed." },
  { phase: "Next step", title: "Fortinet training", status: "Planned" as const, description: "Planned after the current CCNA preparation phase to deepen firewall and network security knowledge." },
  { phase: "Continuous", title: "Systems & automation practice", status: "In progress" as const, description: "Continuing practical work with Windows, Linux, scripting, version control, and infrastructure as code." },
] as const;

export const portfolioTechnologies: readonly TechnologyReference[] = [
  { id: "cisco", level: "Experience" },
  { id: "docker", level: "Experience" },
  { id: "fortinet", level: "Experience" },
  { id: "git", level: "Experience" },
  { id: "github", level: "Experience" },
  { id: "linux", level: "Experience" },
  { id: "nextjs", level: "Experience" },
  { id: "powershell", level: "Experience" },
  { id: "react", level: "Experience" },
  { id: "tailwind", level: "Experience" },
  { id: "typescript", level: "Experience" },
  { id: "ubuntu", level: "Experience" },
  { id: "vercel", level: "Experience" },
  { id: "vmware", level: "Experience" },
  { id: "windows", level: "Experience" },
  { id: "wireshark", level: "Experience" },
  { id: "ansible", level: "Learning" },
  { id: "netmiko", level: "Learning" },
  { id: "paramiko", level: "Learning" },
  { id: "python", level: "Learning" },
  { id: "terraform", level: "Learning" },
  { id: "wazuh", level: "Learning" },
];

export const certifications: readonly Certification[] = [
  {
    name: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    status: "In progress",
    statement: "Preparation is in progress; no certification is currently claimed.",
    skills: ["Network fundamentals", "IP connectivity", "Security fundamentals"],
  },
  {
    name: "Fortinet training",
    issuer: "Fortinet",
    status: "Planned",
    statement: "Training is planned; no completed certification or credential is claimed.",
    skills: ["Firewall fundamentals", "Network security"],
  },
];

export const projectCategoryRoutes = projectCategories.map((name) => ({
  name,
  slug: name.toLowerCase(),
}));

export function getProjectCategory(slug: string) {
  return projectCategoryRoutes.find((category) => category.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getTechnologyLevel(id: TechnologyId) {
  return portfolioTechnologies.find((technology) => technology.id === id)?.level;
}
