# Neoxix Web Portfolio

The first static MVP of the Neoxix web portfolio. It presents Kodjo Mathias Akah's current network and systems experience, practical projects, homelab, and learning roadmap for employers, recruiters, technical hiring managers, and collaborators in Canada.

## Local development

Requirements: Node.js 20.9 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Useful checks:

```bash
pnpm lint
pnpm build
```

To run the production build locally:

```bash
pnpm start
```

## Architecture

- `src/app/` contains the App Router entry point, global styles, fonts, and metadata.
- `src/components/` contains reusable page sections, the site shell, and small inline icons.
- `src/data/portfolio.ts` is the typed content source and central location for the GitHub URL.
- The MVP is a static Server Component page. It has no database, CMS, authentication, analytics, or contact backend.
- Design values in `globals.css` use `--provisional-*` tokens so final Neoxix brand values can replace them later.

## Before publishing

Review all professional claims and project statuses so they remain current.
