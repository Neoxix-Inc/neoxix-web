"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navigation } from "@/data/portfolio";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="mobile-navigation">
      <button ref={buttonRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
        <span className="sr-only">{open ? "Close" : "Open"} navigation</span>
        <span aria-hidden="true" className={open ? "menu-icon is-open" : "menu-icon"}><i /><i /></span>
      </button>
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile navigation">
          <ul>{navigation.map((item) => <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)}>{item.label}</Link></li>)}</ul>
          <Link className="mobile-cta" href="/portfolio#contact" onClick={() => setOpen(false)}>Let&apos;s connect</Link>
        </nav>
      </div>
    </div>
  );
}
