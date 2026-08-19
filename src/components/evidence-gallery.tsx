import Image from "next/image";
import type { EvidenceImage } from "@/data/portfolio";

export function EvidenceGallery({ images }: { images: readonly EvidenceImage[] }) {
  if (!images.length) return <div className="gallery-empty"><p>No sanitized screenshots are published for this project yet.</p><span>Evidence will appear here only after sensitive details have been removed and the image has been reviewed.</span></div>;
  return <div className="evidence-grid">{images.map((image) => <figure key={image.src}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 720px) 100vw, 50vw" /><figcaption>{image.caption}</figcaption></figure>)}</div>;
}
