type IconProps = { className?: string };

const defaults = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowUpRight({ className }: IconProps) {
  return <svg {...defaults} className={className}><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

export function GithubIcon({ className }: IconProps) {
  return <svg {...defaults} className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-6 0C5.8.1 4.7.5 4.7.5A5 5 0 0 0 4.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 9 18v4" /><path d="M9 19c-3 .9-3-1.5-4-2" /></svg>;
}

export function LinkedinIcon({ className }: IconProps) {
  return <svg {...defaults} className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>;
}

export function CheckIcon({ className }: IconProps) {
  return <svg {...defaults} className={className}><path d="m5 12 4 4L19 6" /></svg>;
}
