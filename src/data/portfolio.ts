export type Status =
  | "Operational and validated"
  | "Deployed and improving"
  | "Under diagnosis"
  | "In progress"
  | "Planned";

export type Project = {
  title: string;
  description: string;
  status: Status;
  tags: readonly string[];
  outcome: string;
};

export type Competency = {
  number: string;
  title: string;
  description: string;
  skills: readonly string[];
};

export const socialLinks = {
  github: "https://github.com/Neoxix-Inc",
} as const;

export const navigation = [
  { label: "About", href: "#about" },
  { label: "Competencies", href: "#competencies" },
  { label: "Projects", href: "#projects" },
  { label: "Homelab", href: "#homelab" },
  { label: "Roadmap", href: "#roadmap" },
] as const;

export const profile = {
  eyebrow: "NETWORK & SYSTEMS PORTFOLIO",
  name: "Kodjo Mathias Akah",
  headline: "Building practical infrastructure, one system at a time.",
  introduction:
    "I am a network and systems professional developing hands-on experience across infrastructure, security, automation, and homelab operations.",
  availability:
    "Open to junior infrastructure opportunities and technical collaboration in Canada.",
} as const;

export const competencies: readonly Competency[] = [
  {
    number: "01",
    title: "Networking",
    description:
      "Building and troubleshooting routed and switched lab environments with careful documentation and validation.",
    skills: ["TCP/IP", "VLANs", "Routing", "DNS & DHCP", "VPN fundamentals"],
  },
  {
    number: "02",
    title: "Systems",
    description:
      "Administering Windows and Linux systems in a controlled lab, with attention to reliable services and repeatable operations.",
    skills: ["Windows Server", "Linux", "Active Directory", "Virtualization", "Backup basics"],
  },
  {
    number: "03",
    title: "Security",
    description:
      "Applying foundational hardening, segmentation, access-control, and diagnostic practices to lab infrastructure.",
    skills: ["Firewall policy", "Segmentation", "Access control", "Log review", "Hardening"],
  },
  {
    number: "04",
    title: "Automation",
    description:
      "Learning to make infrastructure tasks more consistent through code, scripts, version control, and reusable examples.",
    skills: ["Terraform", "PowerShell", "Bash", "Git", "API fundamentals"],
  },
] as const;

export const projects: readonly Project[] = [
  {
    title: "Neoxix Homelab",
    description:
      "A personal environment for testing network services, virtualization, system administration, and security controls without overstating production use.",
    status: "Deployed and improving",
    tags: ["Networking", "Virtualization", "Linux", "Windows"],
    outcome: "Repeatable platform for structured technical practice",
  },
  {
    title: "FortiGate IKEv2 VPN laboratory",
    description:
      "A focused remote-access VPN lab in which remote access from an iPad over a cellular connection to authorized internal resources has been validated.",
    status: "Operational and validated",
    tags: ["FortiGate", "IKEv2", "IPsec", "Troubleshooting"],
    outcome: "Validated remote access to authorized internal resources",
  },
  {
    title: "Terraform homelab examples",
    description:
      "Small, version-controlled infrastructure examples built to practise declarative configuration, reviewable changes, and reusable patterns.",
    status: "In progress",
    tags: ["Terraform", "Infrastructure as code", "Git"],
    outcome: "Growing collection of documented learning examples",
  },
  {
    title: "Neoxix SDK",
    description:
      "A PowerShell automation module for PowerShell 5.1 and PowerShell 7+, with structured logging, Pester tests, PSScriptAnalyzer, build automation, and Windows/Linux CI.",
    status: "In progress",
    tags: ["PowerShell", "Pester", "CI"],
    outcome: "Module development and validation remain in progress",
  },
] as const;

export const homelabLayers = [
  { label: "Access", detail: "Administrative workstations and test clients" },
  { label: "Network", detail: "Routing, switching, segmentation, and firewall labs" },
  { label: "Compute", detail: "Virtualized Windows and Linux workloads" },
  { label: "Services", detail: "Identity, name resolution, addressing, and monitoring practice" },
] as const;

export const roadmap = [
  {
    phase: "Current focus",
    title: "CCNA preparation",
    status: "In progress" as const,
    description:
      "Strengthening networking fundamentals through structured study, labs, and troubleshooting practice. No certification is claimed.",
  },
  {
    phase: "Next step",
    title: "Fortinet training",
    status: "Planned" as const,
    description:
      "Planned after the current CCNA preparation phase to deepen firewall and network security knowledge.",
  },
  {
    phase: "Continuous",
    title: "Systems & automation practice",
    status: "In progress" as const,
    description:
      "Continuing practical work with Windows, Linux, scripting, version control, and infrastructure as code.",
  },
] as const;
