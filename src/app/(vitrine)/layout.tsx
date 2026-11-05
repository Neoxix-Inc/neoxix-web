import type { Metadata, Viewport } from "next";
import { classesPolices } from "../fonts/polices";
import { GabaritVitrine } from "@/components/vitrine/gabarit";
import "./vitrine.css";

export const metadata: Metadata = {
  title: {
    default: "NEOXIX · Services numériques pour PME (prévisualisation)",
    template: "%s · NEOXIX (prévisualisation)",
  },
  description:
    "NEOXIX conçoit, sécurise et automatise les systèmes numériques des PME au Canada et en Côte d'Ivoire. Prévisualisation non publiée.",
  // Prévisualisation : ne jamais indexer.
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
