import type { IconType } from "react-icons";
import { FaWindows } from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import {
  SiDocker,
  SiAnsible,
  SiCisco,
  SiFortinet,
  SiGit,
  SiGithub,
  SiLinux,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
  SiUbuntu,
  SiVercel,
  SiVmware,
  SiWireshark,
} from "react-icons/si";
import { TbBrandPowershell } from "react-icons/tb";
import { TbNetwork, TbTerminal2 } from "react-icons/tb";
import type { TechnologyId, TechnologyLevel, TechnologyReference } from "./portfolio";
import Link from "next/link";

export type Technology = {
  id: TechnologyId;
  label: string;
  Icon: IconType;
  description: string;
};

export const technologyCatalog = {
  cisco: { id: "cisco", label: "Cisco", Icon: SiCisco, description: "Used for routed and switched networking study and lab practice." },
  fortinet: { id: "fortinet", label: "Fortinet", Icon: SiFortinet, description: "Used in firewall, segmentation, and remote-access security labs." },
  vmware: { id: "vmware", label: "VMware", Icon: SiVmware, description: "Used to host virtualized systems in the personal homelab." },
  linux: { id: "linux", label: "Linux", Icon: SiLinux, description: "Used for systems administration, homelab services, and cross-platform development practice." },
  ubuntu: { id: "ubuntu", label: "Ubuntu", Icon: SiUbuntu, description: "Used as a Linux environment in the personal homelab." },
  windows: { id: "windows", label: "Windows", Icon: FaWindows, description: "Used for systems administration and cross-platform automation practice." },
  powershell: { id: "powershell", label: "PowerShell", Icon: TbBrandPowershell, description: "Used to develop and test maintainable systems automation." },
  terraform: { id: "terraform", label: "Terraform", Icon: SiTerraform, description: "Being learned through small, version-controlled infrastructure examples." },
  git: { id: "git", label: "Git", Icon: SiGit, description: "Used to keep portfolio and infrastructure changes reviewable and version controlled." },
  github: { id: "github", label: "GitHub", Icon: SiGithub, description: "Used to publish selected code and support version-control and CI workflows." },
  docker: { id: "docker", label: "Docker", Icon: SiDocker, description: "Used as part of current container practice; no production-scale use is claimed." },
  wazuh: { id: "wazuh", label: "Wazuh", Icon: FaShieldHalved, description: "Being learned for monitoring and security visibility in the homelab." },
  wireshark: { id: "wireshark", label: "Wireshark", Icon: SiWireshark, description: "Used for packet inspection and network troubleshooting in labs." },
  nextjs: { id: "nextjs", label: "Next.js", Icon: SiNextdotjs, description: "Used to build this statically generated portfolio and its project pages." },
  typescript: { id: "typescript", label: "TypeScript", Icon: SiTypescript, description: "Used to enforce a typed content model and safer portfolio components." },
  react: { id: "react", label: "React", Icon: SiReact, description: "Used for the portfolio interface and its focused interactive components." },
  tailwind: { id: "tailwind", label: "Tailwind CSS", Icon: SiTailwindcss, description: "Referenced by the published portfolio project; no broader production claim is made." },
  vercel: { id: "vercel", label: "Vercel", Icon: SiVercel, description: "Referenced as part of the portfolio's web delivery tooling." },
  python: { id: "python", label: "Python", Icon: SiPython, description: "Being learned for scripting and infrastructure automation." },
  ansible: { id: "ansible", label: "Ansible", Icon: SiAnsible, description: "Being learned for repeatable infrastructure configuration." },
  netmiko: { id: "netmiko", label: "Netmiko", Icon: TbNetwork, description: "Being learned for Python-based network automation." },
  paramiko: { id: "paramiko", label: "Paramiko", Icon: TbTerminal2, description: "Being learned for SSH-based automation workflows." },
} satisfies Record<TechnologyId, Technology>;

export function TechnologyList({ technologies, compact = false, label = "Technologies" }: { technologies: readonly TechnologyReference[]; compact?: boolean; label?: string }) {
  return (
    <ul className={`technology-list${compact ? " technology-list-compact" : ""}`} aria-label={label}>
      {technologies.map(({ id, level }) => {
        const { Icon, label } = technologyCatalog[id];
        return <li key={id}><Link href={`/technologies/${id}`} title={`${label} — ${level}`} aria-label={`${label}: ${level}. View technology details.`}><Icon aria-hidden="true" focusable="false" /><span>{label}</span><small>{level}</small></Link></li>;
      })}
    </ul>
  );
}

export const technologyLevels: readonly TechnologyLevel[] = ["Experience", "Learning", "Planned"];
