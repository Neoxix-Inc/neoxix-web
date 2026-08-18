import { navigation } from "@/data/portfolio";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href="#top" aria-label="Neoxix, back to top">
          NEOXIX<span aria-hidden="true">.</span>
        </a>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="header-cta" href="#contact">Let&apos;s connect</a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <a className="wordmark footer-wordmark" href="#top">NEOXIX<span aria-hidden="true">.</span></a>
          <p>Technical portfolio of Kodjo Mathias Akah.</p>
        </div>
        <p>Built with care in Canada · © {new Date().getFullYear()} Neoxix Inc.</p>
      </div>
    </footer>
  );
}
