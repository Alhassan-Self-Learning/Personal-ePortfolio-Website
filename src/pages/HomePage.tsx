import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, SampleBadge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Monogram';
import { SmartImage } from '@/components/ui/SmartImage';
import { categoryMeta, categoryOrder, entryPath } from '@/data/categories';
import { site } from '@/data/site';
import { CategoryGlyph } from '@/features/achievements/EntryCard';
import { getUI } from '@/features/achievements/registry';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn, plural } from '@/lib/cn';
import { entryDateLabel, primaryDateKey, yearOf } from '@/lib/dates';
import { publicUrl } from '@/lib/paths';
import { repository } from '@/lib/repository';
import { entrySearchText, tokenize } from '@/lib/search';
import { getSocialLinks } from '@/lib/social';
import type { CategoryKey, Located } from '@/types/content';

const p = site.profile;
const hrefOf = (l: Located) => entryPath(l.category, l.entry.id);
const byNewest = (a: Located, b: Located) => primaryDateKey(b.entry).localeCompare(primaryDateKey(a.entry));

/* ------------------------------------------------------------------ hero */

/**
 * The portrait stands on the page; the olive band (the colour of the massar)
 * runs across the middle of the screen behind it and carries the name.
 */
/** A framed print of the portrait: a thin ink border, a paper mat, then the photograph. */
function FramedPortrait({ className }: { className?: string }) {
  if (!p.profileImage) return null;
  return (
    <figure className={cn('portrait-frame group relative', className)}>
      <div className="border-2 border-ink bg-bg p-2.5 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[-1deg] sm:p-3">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <img
            src={publicUrl(p.profileImage)}
            srcSet={`${publicUrl('/media/portrait-480.webp')} 410w, ${publicUrl(p.profileImage)} 819w`}
            sizes="(max-width: 1023px) 260px, 360px"
            alt={`Portrait of ${p.fullName}`}
            width={819}
            height={1306}
            className="hero-portrait absolute inset-x-0 top-[4%] w-full max-w-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </figure>
  );
}

/**
 * The olive band (the colour of the massar) runs the full width of the screen
 * behind the name; the framed portrait sits on it at the right.
 */
function Hero() {
  return (
    <section aria-labelledby="hero-name" className="relative overflow-hidden">
      <div className="container-page flex flex-col lg:grid lg:min-h-[min(calc(100svh-4rem),40rem)] lg:py-12 lg:grid-cols-12 lg:grid-rows-[1fr_auto_1fr] lg:gap-x-6">
        {/* The portrait: first on a phone, right-hand column on desktop, centred on the band. */}
        <div className="relative z-10 flex justify-center pb-8 pt-8 lg:col-span-3 lg:col-start-10 lg:row-span-3 lg:row-start-1 lg:items-center lg:justify-end lg:p-0">
          <FramedPortrait className="w-[min(60vw,260px)] lg:w-full lg:max-w-[340px]" />
        </div>

        <div className="hero-rail-text relative -mx-[var(--margin)] bg-field px-[var(--margin)] py-5 lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:bg-transparent lg:px-0 lg:py-8 lg:before:absolute lg:before:inset-y-0 lg:before:-left-[100vw] lg:before:-right-[100vw] lg:before:-z-10 lg:before:bg-field lg:before:content-['']">
          <h1
            id="hero-name"
            className="text-[clamp(2rem,9vw,2.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.025em] text-field-ink lg:text-[clamp(3.5rem,6.2vw,6.5rem)]"
          >
            {p.fullName}
          </h1>
        </div>

        <div className="pb-8 pt-8 lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:pt-10">
          <div className="animate-rise [animation-delay:450ms]">
            <p className="max-w-[40ch] text-xl text-ink">
              Cybersecurity student at GUtech in Oman, training for the security operations centre.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <LinkButton to="/achievements" variant="primary" className="w-full sm:w-auto">
                See my achievements
              </LinkButton>
              {p.cvPath ? (
                <LinkButton to={p.cvPath} variant="ghost" download="">
                  <Download size={17} aria-hidden="true" /> Download CV
                </LinkButton>
              ) : (
                <LinkButton to="/projects" variant="ghost">
                  View projects
                </LinkButton>
              )}
            </div>
          </div>
          <div className="mt-12">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-3 lg:gap-x-10">
              <div>
                <dt className="text-muted">Studying</dt>
                <dd className="text-base">{p.academicStatus}</dd>
              </div>
              <div>
                <dt className="text-muted">Based in</dt>
                <dd className="text-base">{p.location ?? 'Oman'}</dd>
              </div>
              <div>
                <dt className="text-muted">Heading for</dt>
                <dd className="text-base">SOC, then DFIR</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- intro */

/** Two close-ups of the massar, crossfading slowly like light moving across cloth. */
function ClothDetail() {
  const images = p.detailImages;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % images.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [images.length]);
  return (
    <figure>
      <div className="relative aspect-[16/9] overflow-hidden bg-sunken">
        {images.map((img, n) => (
          <img
            key={img.src}
            src={publicUrl(img.src)}
            alt={n === 0 ? img.alt : ''}
            aria-hidden={n === 0 ? undefined : true}
            loading="lazy"
            width={1000}
            height={562}
            className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out', n === i ? 'opacity-100' : 'opacity-0', 'cloth-drift')}
          />
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-muted">The embroidery on my massar, from the portrait above.</figcaption>
    </figure>
  );
}

function Intro() {
  const [first, ...rest] = p.longBio;
  return (
    <section aria-labelledby="intro-heading" className="mt-32 bg-surface py-24 lg:mt-48 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="reveal lg:col-span-5 lg:col-start-3">
          <h2 id="intro-heading" className="text-display-md">
            About me
          </h2>
          <p className="mt-8 text-xl font-medium">{first}</p>
          {rest.map((t) => (
            <p key={t} className="mt-5 text-base">
              {t}
            </p>
          ))}
          <p className="mt-6">
            <Link to="/about" className="link text-base">
              More about my background
            </Link>
          </p>
        </div>
        <div className="reveal lg:col-span-5 lg:col-start-8 lg:pt-16">
          <ClothDetail />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ work */

function Preview({ item }: { item: Located }) {
  const ui = getUI(item.category);
  const status = ui.status(item.entry as never);
  const image = item.entry.media?.find((m) => m.kind !== 'document' && !/\.pdf$/i.test(m.src));
  const skills = (item.entry.skills ?? []).map((id) => repository.getSkill(id)?.name).filter(Boolean).slice(0, 4);
  const date = entryDateLabel(item.entry);
  return (
    <Link to={hrefOf(item)} className="group block bg-surface p-7 transition-colors hover:bg-sunken" tabIndex={-1} aria-hidden="true">
      <span className="flex items-center gap-2 text-sm">
        <CategoryGlyph category={item.category} />
        {categoryMeta[item.category].singular}, {ui.byline(item.entry as never)}
      </span>
      {image ? (
        <div className="mt-5 aspect-[16/10] overflow-hidden bg-bg">
          <SmartImage src={image.src} alt="" fit="contain" className="h-full w-full p-3" />
        </div>
      ) : null}
      <span className="mt-5 block text-display-md">{item.entry.title}</span>
      <p className="mt-4 text-base">{item.entry.summary}</p>
      {skills.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {skills.map((n) => (
            <li key={n} className="bg-bg px-2 py-1 text-sm">
              {n}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {status && <Badge tone={status.tone}>{status.label}</Badge>}
        {date && <span className="tabular-nums text-muted">{date}</span>}
        {item.entry.sample && <SampleBadge />}
        <span className="text-ink underline underline-offset-4 group-hover:text-accent">Open the entry</span>
      </div>
    </Link>
  );
}

function SelectedWork() {
  const items = useMemo(() => {
    const featured = repository.getFeatured();
    const seen = new Set(featured.map((l) => `${l.category}/${l.entry.id}`));
    const more = [...repository.getCollection('projects').map((entry) => ({ category: 'projects', entry }) as Located), ...repository.getCollection('experience').map((entry) => ({ category: 'experience', entry }) as Located)]
      .filter((l) => !seen.has(`${l.category}/${l.entry.id}`))
      .sort(byNewest);
    return [...featured, ...more].slice(0, 8);
  }, []);
  const [active, setActive] = useState(0);
  if (!items.length) return null;

  return (
    <section aria-labelledby="work-heading" className="container-page mt-32 grid gap-12 lg:mt-48 lg:grid-cols-12 lg:gap-x-6">
      <div className="reveal lg:col-span-6 lg:col-start-3">
        <h2 id="work-heading" className="text-display-md">
          Selected work
        </h2>
        <p className="mt-4 max-w-[48ch] text-base">Projects and labs worth opening first.</p>
        <ul className="mt-8">
          {items.map((l, i) => {
            const year = yearOf(primaryDateKey(l.entry));
            return (
              <li key={`${l.category}/${l.entry.id}`}>
                <Link
                  to={hrefOf(l)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-3 text-ink sm:grid-cols-[minmax(0,1fr)_11rem_4rem]"
                >
                  <span
                    aria-hidden="true"
                    className={cn('absolute -left-5 top-[1.15rem] hidden h-2 w-2 rounded-full bg-field transition-transform duration-200 lg:block', active === i ? 'scale-100' : 'scale-0')}
                  />
                  <span className="text-base font-medium group-hover:text-accent">
                    {l.entry.title}
                    {l.entry.sample && <SampleBadge className="ml-2 align-middle" />}
                  </span>
                  <span className="col-start-1 row-start-2 text-sm text-muted sm:col-start-2 sm:row-start-1">
                    {categoryMeta[l.category].singular}
                    {'type' in l.entry && typeof l.entry.type === 'string' && l.category === 'projects' ? `, ${l.entry.type}` : ''}
                  </span>
                  <span className="text-right text-sm tabular-nums text-muted">{year || 'Undated'}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="sticky top-24 pt-24" aria-live="polite">
          <Preview item={items[active]} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- the record */

const examples = ['Linux', 'SOC', 'Web', 'Cryptography', 'Windows'];

/** The live thing: query everything on record, the way an analyst queries logs. */
function Record() {
  const all = useMemo(() => repository.getAll(), []);
  const counts = repository.getCounts();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CategoryKey | ''>('');

  const results = useMemo(() => {
    const tokens = tokenize(q);
    return all
      .filter((l) => (!cat || l.category === cat) && (!tokens.length || tokens.every((t) => entrySearchText(l).includes(t))))
      .sort((a, b) => byNewest(a, b) || a.entry.title.localeCompare(b.entry.title));
  }, [all, q, cat]);
  const shown = results.slice(0, 10);
  const filtering = !!q.trim() || !!cat;

  return (
    <section aria-labelledby="record-heading" className="container-page mt-32 grid gap-12 lg:mt-48 lg:grid-cols-12 lg:gap-x-6">
      <div className="reveal lg:col-span-5 lg:col-start-3">
        <h2 id="record-heading" className="text-display-md">
          Search the record
        </h2>
        <p className="mt-4 max-w-[46ch] text-base">
          {plural(all.length, 'entry', 'entries')} across {categoryOrder.length} categories. Type a skill, tool or platform to see what backs it up.
        </p>
        <div className="mt-8">
          <label htmlFor="record-query" className="sr-only">
            Search the record
          </label>
          <input
            id="record-query"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try Linux, SOC or TryHackMe"
            autoComplete="off"
            className="field h-14 text-xl"
          />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example searches">
            {examples.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setQ(x)}
                aria-pressed={q.toLowerCase() === x.toLowerCase()}
                className={cn('h-9 px-3 text-sm transition-colors duration-200 active:scale-95', q.toLowerCase() === x.toLowerCase() ? 'animate-pop bg-ink text-bg' : 'bg-surface hover:bg-sunken')}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-8 text-sm text-muted" aria-live="polite">
          {filtering ? `${plural(results.length, 'entry', 'entries')} match` : 'Latest entries'}
          {filtering && (
            <button
              type="button"
              className="link ml-4"
              onClick={() => {
                setQ('');
                setCat('');
              }}
            >
              Clear
            </button>
          )}
        </p>
        {shown.length ? (
          <ul key={`${q.trim().toLowerCase()}|${cat}`} className="mt-2">
            {shown.map((l, i) => (
              <li key={`${l.category}/${l.entry.id}`} className="item-in" style={{ animationDelay: `${i * 35}ms` }}>
                <Link to={hrefOf(l)} className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 py-2.5">
                  <CategoryGlyph category={l.category} className="translate-y-[-1px]" />
                  <span className="text-base group-hover:text-accent">{l.entry.title}</span>
                  <span className="text-sm tabular-nums text-muted">{entryDateLabel(l.entry) || categoryMeta[l.category].singular}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 bg-surface p-5 text-base">Nothing on record matches “{q}”. Try a broader word, such as a platform or a topic.</p>
        )}
        {results.length > shown.length && (
          <p className="mt-4">
            <Link to={q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/achievements'} className="link text-base">
              See all {results.length}
            </Link>
          </p>
        )}
      </div>

      <div className="reveal lg:col-span-3 lg:col-start-9 lg:pt-[7.5rem]">
        <h3 className="text-xl font-medium">By category</h3>
        <ul className="mt-4" aria-label="Filter by category">
          {categoryOrder.map((k) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => setCat(cat === k ? '' : k)}
                aria-pressed={cat === k}
                disabled={!counts[k]}
                className={cn(
                  'grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-3 px-2 py-2 text-left text-base transition-[background-color,color,padding] duration-200 active:scale-[0.99] disabled:cursor-default disabled:text-muted',
                  cat === k ? 'bg-surface pl-3 font-medium text-ink' : 'text-ink hover:bg-surface hover:text-accent',
                )}
              >
                <CategoryGlyph category={k} className={cn('translate-y-[-1px] transition-transform duration-200', cat === k && 'animate-pop scale-125 ring-2 ring-ink ring-offset-2 ring-offset-surface')} />
                <span>{categoryMeta[k].label}</span>
                <span className="text-sm tabular-nums text-muted">{counts[k]}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link to="/achievements" className="link text-base">
            Open the achievements hub
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- letter */

function Letter() {
  return (
    <section aria-labelledby="letter-heading" className="mt-32 bg-field py-24 text-field-ink lg:mt-48 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-x-6">
      <div className="reveal lg:col-span-5 lg:col-start-3">
        <div className="flex items-center gap-4">
          {p.profileImageSquare ? (
            <img src={publicUrl(p.profileImageSquare)} alt="" width={48} height={48} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <Monogram size={48} />
          )}
          <h2 id="letter-heading" className="text-display-md">
            Where I’m heading
          </h2>
        </div>
        <p className="mt-8 text-base">
          I’m in my final year of a cybersecurity degree at GUtech. The modules that pulled me in most were the ones closest to real incidents: SOC operations, ethical hacking, applied cryptography and network security.
        </p>
        <p className="mt-5 text-base">
          My first goal is a SOC analyst role. It’s where you learn what normal looks like, how alerts are triaged, and how a small signal becomes an investigation.
        </p>
        <p className="mt-5 text-base">
          From there I want to move into digital forensics and incident response, where the job is to <mark className="bg-bg px-1 text-ink">work out what actually happened</mark> and show the evidence for it.
        </p>
        <p className="mt-5 text-base">That is also why this site works the way it does: every entry is a record you can open and check.</p>
        <p className="mt-8 text-xl font-medium italic">{p.fullName}</p>
        <p className="text-sm">
          {p.academicStatus}, {p.university}
        </p>
      </div>
      <ol className="reveal grid gap-3 sm:grid-cols-3 lg:col-span-3 lg:col-start-9 lg:grid-cols-1 lg:pt-20" aria-label="The path">
        {site.path.map((step, i) => (
          <li key={step.title} className={cn('flex min-h-[9rem] flex-col justify-between p-6', i === 0 ? 'bg-ink text-bg' : 'bg-bg text-ink')}>
            <span className="text-sm">{step.label}</span>
            <span>
              <span className="block text-xl font-medium leading-snug">{step.title}</span>
              <span className="mt-1 block text-sm">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

function Contact() {
  const social = getSocialLinks().filter((s) => s.platform !== 'email');
  return (
    <section aria-labelledby="contact-heading" className="container-page mt-32 grid gap-10 lg:mt-48 lg:grid-cols-12 lg:gap-x-6">
      <div className="reveal lg:col-span-5 lg:col-start-3">
        <h2 id="contact-heading" className="text-display-md">
          Get in touch
        </h2>
        <p className="mt-6 max-w-[30ch] text-xl lg:text-display-md lg:font-normal">
          I’m looking for SOC analyst internships and graduate roles.
        </p>
        <p className="mt-4 max-w-[46ch] text-base">I’m also always happy to compare notes on a lab, a CTF or a write-up.</p>
      </div>
      <div className="reveal flex gap-6 lg:col-span-4 lg:col-start-9 lg:pt-3">
        {p.profileImageSquare && (
          <img src={publicUrl(p.profileImageSquare)} alt={`${p.fullName}, small portrait`} width={160} height={160} loading="lazy" className="h-24 w-24 shrink-0 object-cover sm:h-40 sm:w-40" />
        )}
        <div>
          <p className="text-xl font-medium">Hiring for a SOC team?</p>
          <ul className="mt-4 space-y-2 text-base">
            {p.email && (
              <li>
                <a href={`mailto:${p.email}`} className="link">
                  {p.email}
                </a>
              </li>
            )}
            {social.slice(0, 2).map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer me" className="link">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/contact" className="link">
                All the ways to reach me
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted">Based in {p.location ?? 'Oman'}. I reply within a few days.</p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  usePageMeta(undefined);
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <Record />
      <Letter />
      <Contact />
    </>
  );
}
