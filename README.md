# Neoxix Web Portfolio

The second iteration of the Neoxix professional portfolio. It presents Kodjo Mathias Akah’s current network and systems experience, practical projects, homelab, and learning roadmap with transparent status and evidence handling.

## Local development

Requirements: Node.js 20.9 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Before handing off a change, run:

```bash
pnpm lint
pnpm build
git diff --check
```

## Content architecture

- `src/data/portfolio.ts` is the typed source for site configuration, navigation, competencies, technologies, certifications, projects, categories, statuses, and roadmap content.
- `src/data/technologies.tsx` is the technology catalog and icon presentation layer. Technology references carry an explicit `Experience`, `Learning`, or `Planned` level.
- `src/components/technology-tabs.tsx` is the client-side accessibility boundary for the homepage technology tabs; the surrounding section remains server rendered.
- `src/components/project-filter.tsx` renders reusable project lists and accessible links to the statically generated category pages.
- `src/components/certification-card.tsx` renders all supported certification fields and an honest empty evidence state.
- `src/app/projects/[slug]/page.tsx` turns every project record into a reusable, statically generated detail page.
- `src/app/projects/category/[category]/page.tsx` statically generates every supported project category from centralized data.
- `src/app/technologies/[technology]/page.tsx` statically generates a detail page for every catalog technology, including its honest exposure level and data-derived competency and project relationships.
- `src/components/evidence-gallery.tsx` renders reviewed screenshots or a deliberate empty state.
- `src/app/globals.css` contains the provisional brand tokens, responsive layout, focus states, and reduced-motion behavior.

The site has no database, CMS, authentication, analytics, or contact backend. Most of it remains server rendered; JavaScript is limited to mobile navigation, viewport reveal enhancement, and the homepage technology tabs.

## Add a project

Add one object to `projects` in `src/data/portfolio.ts`. TypeScript requires the complete detail-page model:

1. Choose a unique URL-safe `slug`.
2. Add an accurate `summary`, current `status`, and one or more supported `categories`.
3. Reference catalog technology IDs and give each an honest level.
4. Fill in objectives, topology, implementation, troubleshooting, results, and demonstrated skills. Empty arrays are acceptable when facts are not ready to publish.
5. Add GitHub or documentation URLs only when they are verified and public.
6. Leave `gallery` empty until reviewed evidence exists.

The project automatically appears in the homepage list, at `/projects/<slug>`, and on every applicable category page.

## Add a lab or category assignment

Labs use the same `Project` model as other projects. Add the lab to `projects` and assign one or more values from `projectCategories` to its `categories` array. Category pages filter the centralized array at build time, so no route or component update is required when an existing category is assigned.

To introduce a new category, add its display name to `projectCategories`. Its lower-case route is derived in `projectCategoryRoutes`; then assign that category to the relevant projects or labs. A category with no matching published entry renders an intentional empty state.

## Add a technology

Update the typed catalog pieces:

1. Add its ID to `technologyIds` in `src/data/portfolio.ts`.
2. Add its accessible name, conservative portfolio-role description, and an individually imported icon in `src/data/technologies.tsx`.
3. Add it to `portfolioTechnologies` with the honest homepage-wide `Experience`, `Learning`, or `Planned` level.
4. Reference that ID from a competency or project where relevant. Project-specific lists remain independent and should describe that project accurately.

Only add technologies supported by current portfolio content. Keep icon rendering server-safe and do not turn static cards into Client Components solely for an icon.

Cisco uses the recognizable `SiCisco` brand icon included in the installed `react-icons` Simple Icons set; it is not represented by a generic network symbol. Netmiko and Paramiko have no matching exports in the installed brand icon set: Netmiko deliberately uses the neutral Tabler network symbol `TbNetwork`, and Paramiko uses the neutral terminal symbol `TbTerminal2`. These are technology symbols, not claimed official logos. Wazuh similarly uses the neutral `FaShieldHalved`. Windows uses the recognizable Font Awesome mark, and PowerShell uses Tabler's brand mark because this Simple Icons version has no PowerShell export. Other catalog entries use matching brand exports where available.

Technology levels describe portfolio exposure only. Do not use them to claim professional mastery or production use.

Technology detail pages derive related projects and labs from each project's `technologies` array. To assign a project to a technology page, add an honest technology reference to that published project; do not maintain a separate relationship list. Competency relationships are derived in the same way from each competency's `technologies` array. A technology with no assigned project renders an intentional evidence-pending empty state.

## Add a certification

Add a typed record to `certifications` in `src/data/portfolio.ts`:

1. Provide the accurate certification or training name, issuer, current status (`Earned`, `In progress`, or `Planned`), an explicit status statement, and supported skills.
2. Add issue date, expiration date, credential ID, and verification URL only when each value is verified and appropriate to publish.
3. Add `certificateImage` only after the image has been sanitized and reviewed. When it is omitted, the card intentionally states that no certificate image or evidence is available.
4. Never infer completion from study activity, and never invent a badge, certificate, date, ID, or verification URL.

## Add a sanitized certificate image

1. Remove or obscure credential secrets, private identifiers, addresses, account details, QR codes that disclose unintended data, and any other information that should not be public.
2. Review the pixels in the exported image; CSS cropping is not sanitization.
3. Place the optimized image under `public/certifications/`.
4. Add the `certificateImage` record with public `src`, intrinsic `width` and `height`, accurate replacement `alt` text, and a concise `caption`.
5. Confirm that the accompanying dates, credential ID, and verification URL match the source before publishing.

## Add a sanitized screenshot

1. Remove or obscure credentials, tokens, private or internal addresses, endpoints, usernames, certificates, serial numbers, customer data, and other identifying information.
2. Review the final image itself—cropping or CSS must not be the only protection.
3. Place the optimized image under `public/evidence/<project-slug>/`.
4. Add a gallery record with the public `src`, intrinsic `width` and `height`, concise replacement `alt` text, and a professional `caption`.
5. Run the production build and inspect the detail page at mobile and desktop widths.

Do not create illustrative “evidence” or use placeholder screenshots. An empty gallery is intentional and renders a clear publication-status message.

## Before publishing

Review professional claims, learning levels, links, project statuses, and all screenshot pixels. The favicon and metadata use provisional Neoxix styling; replace them only when final approved brand assets exist. The canonical origin is centralized in `siteConfig.canonicalUrl`.
