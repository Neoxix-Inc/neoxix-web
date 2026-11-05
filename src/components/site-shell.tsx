import { navigation } from "@/data/portfolio";
import { MobileNavigation } from "./mobile-navigation";
import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/portfolio" aria-label="Neoxix home">
          NEOXIX<span aria-hidden="true">.</span>
        </Link>
        <nav className="desktop-navigation" aria-label="Primary navigation">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="header-cta" href="/portfolio#contact">Let&apos;s connect</Link>
        <MobileNavigation />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link className="wordmark footer-wordmark" href="/portfolio">NEOXIX<span aria-hidden="true">.</span></Link>
          <p>Technical portfolio of Kodjo Mathias Akah.</p>
        </div>
        <p>Built with care in Canada · © {new Date().getFullYear()} Neoxix Inc.</p>
      </div>
    </footer>
  );
}
