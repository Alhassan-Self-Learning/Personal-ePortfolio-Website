# Personal ePortfolio

A frontend-only portfolio for a Cybersecurity student. Every achievement is a typed data record; the homepage graph, statistics, timeline, search, featured section and "related" links are all derived from those records, so nothing is written twice.

Built with React 18, TypeScript, Vite, Tailwind CSS, React Router and Lucide icons. No backend, database, authentication or paid services.

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                       |
| `npm run build`     | Type-check, then build to `dist/`                        |
| `npm run preview`   | Serve the production build locally                       |
| `npm run lint`      | ESLint                                                   |
| `npm run typecheck` | TypeScript only                                          |
| `npm test`          | Data-integrity, search, sorting, date and social tests   |

In development a **Setup checklist** button (bottom-left) lists anything still unconfigured. It never appears in production builds.

## Make it yours

### 1. Personal details — `src/data/site.ts`

Name, headline, university, bios, interests, profile image, CV path, email, location, the "Where I'm heading" path, featured entries, and the `showSampleData` switch.

Anything set to `null` is treated as not configured, and the related button or link is hidden rather than shown broken:

- **CV**: put `cv.pdf` in `public/` and set `cvPath: '/cv.pdf'`.
- **Profile photo**: put it in `public/media/` and set `profileImage: '/media/profile.jpg'`. Without one, the monogram is used.
- **Email**: set `email`. Used by the Contact page and the email social link.
- **site.url**: set once deployed — enables `sitemap.xml`, canonical URLs and `og:url`.

### 2. Social profiles — `src/data/social.ts`

Fill in a URL and set `visible: true`. A profile only shows when it is visible **and** has a valid destination. `featured: true` also shows it on the homepage. WhatsApp takes an international number (`phone`) and links via `wa.me`; the number itself stays hidden unless `showPhone: true`. Add anything else with `platform: 'custom'`.

### 3. Achievements — `src/data/achievements/*.ts`

One file per category, each with its own model (see `src/types/content.ts`):

| Category                    | File               | URL                          |
| --------------------------- | ------------------ | ---------------------------- |
| Completed Courses           | `courses.ts`       | `/achievements/courses`      |
| Certifications              | `certifications.ts`| `/achievements/certifications` |
| Projects                    | `projects.ts`      | `/projects`                  |
| Experience                  | `experience.ts`    | `/experience`                |
| Competitions & Tournaments  | `competitions.ts`  | `/achievements/competitions` |
| Workshops                   | `workshops.ts`     | `/achievements/workshops`    |
| Bootcamps & Programs        | `programs.ts`      | `/achievements/programs`     |
| Books                       | `books.ts`         | `/achievements/books`        |
| Volunteering                | `volunteering.ts`  | `/achievements/volunteering` |
| Events, Exhibitions & Forums| `events.ts`        | `/achievements/events`       |
| Labs                        | `labs.ts`          | `/achievements/labs`         |

Every entry gets a shareable page at `<category URL>/<id>`. Shared fields:

```ts
{
  id: 'thm-corridor',            // stable, lowercase-with-dashes; used in the URL
  title: 'Corridor',
  summary: 'One or two sentences.',
  description: 'Optional longer text.\n\nBlank line = new paragraph.',
  date: '2026-05',               // 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'; leave out if unknown
  startDate, endDate, current,   // for ranges / ongoing work
  skills: ['idor'],              // ids from src/data/skills.ts
  related: [{ category: 'courses', id: 'web-security-course' }],
  media: [{ src: '/media/cert.pdf', alt: '…', kind: 'certificate' }],
  links: [{ label: 'Verify', url: 'https://…', kind: 'verification' }],
  tags: ['Web'],
  milestone: true,               // keep on the timeline in "Milestones only"
  sample: true,                  // demonstration content
}
```

Notes:

- **Related links work both ways.** If a project lists a lab as related, the lab's page lists the project too. Entries sharing skills fill the rest.
- **Skills page evidence is automatic.** Add a skill id to an entry's `skills` and it appears as evidence for that skill.
- **Dates are optional.** Undated entries sort last and appear under "Not yet dated" on the Journey page.
- **Certifications vs course certificates.** Put industry certifications in `certifications.ts`; a course's completion certificate goes in that course's `media` with `kind: 'certificate'` and `hasCertificate: true`.
- **Competitions.** Leave `result` out unless there is an official placement — the page then says "Participated".
- **Events.** `role` (attendee, speaker, presenter, exhibitor, volunteer, organiser) is shown prominently so attending is never confused with presenting.
- **Labs.** `kind: 'platform'` vs `'independent'` separates platform labs from your own experiments. Only link write-ups the platform allows to be public, and never publish flags, credentials or restricted solutions.
- **Files** (images, PDFs) go in `public/` and are referenced from the site root, e.g. `/media/aws-cert.pdf`. Missing images fall back to a placeholder.

### 4. Featured entries

Edit `site.featured` — an ordered list of `{ category, id }`. Featured entries appear on the homepage, carry a star on cards, and come first with the "Featured first" sort.

### 5. Sample data

Entries marked `sample: true` are demonstration content and carry a visible "Sample" badge. Replace them with your own, or set `content.showSampleData: false` in `site.ts` to hide all of them at once.

The real entries already included are your TryHackMe rooms (without dates — add them from your history) and the CSY 3103 group assessment (add its details).

### 6. Look and feel

- Colours, both themes: CSS variables at the top of `src/styles/index.css`. One accent colour plus one colour per category.
- Fonts: Bricolage Grotesque (headings), IBM Plex Sans (text), IBM Plex Mono (credential IDs). Self-hosted via Fontsource — no external requests.
- Monogram letters: `profile.monogram`. Also update `public/favicon.svg` if you change them.
- Navigation: `src/data/navigation.ts`.

## Project structure

```
src/
  components/   layout (header, footer, search palette) and shared UI
  data/         site config, skills, social links, categories, achievements/*
  features/     achievements (registry, list, detail, per-category layouts), home (graph)
  hooks/        theme, page metadata, shortcuts, stored preferences
  lib/          repository (data access), search, sorting, dates, social links
  pages/        Home, About, Skills, Achievements, Journey, Contact, Search, 404
  styles/       design tokens and global styles
  types/        content models
tests/          vitest suite
```

`src/features/achievements/registry.tsx` defines, per category: icon, status, card facts, filters, detail facts and the detail layout. Adding a filter is one line there.

### Moving to a backend later

Pages read data only through `src/lib/repository.ts`, which implements a `ContentRepository` interface. To use an API or database, implement that interface with fetch calls and swap the `repository` export. If the API is asynchronous, wrap the calls in hooks with loading states; the presentation components don't change.

The local data files are content, not an admin system: editing them and redeploying is how you update the site. Private administration (logins, editing in the browser) would need the backend described above.

## Deploying

`npm run build` produces a static site in `dist/`. Because it uses clean URLs, the host must serve `index.html` for unknown paths:

- **Netlify**: works out of the box (`public/_redirects` is included).
- **Vercel**: works out of the box (`vercel.json` is included).
- **Cloudflare Pages**: works out of the box (uses `_redirects`).
- **GitHub Pages**: copy `dist/index.html` to `dist/404.html` after building, and if the site lives under `/<repo>/`, set `base: '/<repo>/'` in `vite.config.ts`.

After deploying, set `site.url` and rebuild to generate `sitemap.xml`. `robots.txt` is always generated. Replace `public/og-image.png` with your own social preview image (1200×630).

## Keyboard and accessibility

- `Ctrl K` / `⌘ K` or `/` opens global search; arrow keys and Enter choose a result.
- Skip link, visible focus rings, labelled icon buttons, native modal dialogs with focus handling, `prefers-reduced-motion` respected, theme saved per visitor.
