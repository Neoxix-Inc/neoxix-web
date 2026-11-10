import type { Metadata, Viewport } from "next";
import { contenu } from "@/content";
import { classesPolices } from "../fonts/polices";
import { GabaritVitrine } from "@/components/vitrine/gabarit";
import "./vitrine.css";

export const metadata: Metadata = {
  title: { default: contenu.site.titre, template: `%s · NEOXIX` },
  description: contenu.site.description,
  // Prévisualisation : ne jamais indexer. À lever seulement à la mise en ligne autorisée par le propriétaire.
  robots: { index: false, follow: false, nocache: true },
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
