import type { Metadata, Viewport } from "next";
import { contenu } from "@/content";
import { classesPolices } from "../fonts/polices";
import { GabaritVitrine } from "@/components/vitrine/gabarit";
import { SITE_URL, indexable } from "@/lib/publication";
import "./vitrine.css";

export const metadata: Metadata = {
  title: { default: contenu.site.titre, template: `%s · NEOXIX` },
  description: contenu.site.description,
  metadataBase: new URL(SITE_URL),
  // Indexable uniquement en production (neoxix.ca) ; prévisualisations et local : noindex.
  robots: indexable() ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#10171A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function LayoutVitrine({ children }: LayoutProps<"/">) {
  return <GabaritVitrine classes={classesPolices}>{children}</GabaritVitrine>;
}
