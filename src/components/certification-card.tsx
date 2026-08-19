import Image from "next/image";
import type { Certification } from "@/data/portfolio";

function OptionalField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

export function CertificationCard({ certification }: { certification: Certification }) {
  const { certificateImage } = certification;
  return (
    <article className="certification-card">
      <div className="certification-content">
        <div className="certification-title-row">
          <div><p className="certification-issuer">{certification.issuer}</p><h3>{certification.name}</h3></div>
          <span className={`status status-${certification.status.toLowerCase().replaceAll(" ", "-")}`}>{certification.status}</span>
        </div>
        <p>{certification.statement}</p>
        <dl className="certification-meta">
          <OptionalField label="Issue date" value={certification.issueDate} />
          <OptionalField label="Expiration date" value={certification.expirationDate} />
          <OptionalField label="Credential ID" value={certification.credentialId} />
        </dl>
        <ul className="certification-skills" aria-label={`Skills associated with ${certification.name}`}>{certification.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        {certification.verificationUrl && <a className="verification-link" href={certification.verificationUrl} target="_blank" rel="noopener noreferrer">Verify credential <span aria-hidden="true">↗</span></a>}
      </div>
      <div className="certificate-evidence">
        {certificateImage ? (
          <figure><Image src={certificateImage.src} alt={certificateImage.alt} width={certificateImage.width} height={certificateImage.height} /><figcaption>{certificateImage.caption}</figcaption></figure>
        ) : (
          <div className="certificate-empty"><p>No certificate image available</p><span>No badge, certificate, or verification evidence is being represented.</span></div>
        )}
      </div>
    </article>
  );
}
