import { ClipboardList, X } from 'lucide-react';
import { useState } from 'react';
import { site } from '@/data/site';
import { getSocialLinks } from '@/lib/social';

/** Development-only reminder of configuration that's still missing. Never shown in production builds. */
export function SetupChecklist() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const p = site.profile;
  const todo = [
    p.fullName === 'Your Full Name' && 'Set profile.fullName in src/data/site.ts',
    !p.email && 'Add a public email (profile.email)',
    !p.cvPath && 'Add your CV to /public and set profile.cvPath',
    !site.url && 'Set site.url once deployed (enables sitemap.xml and canonical URLs)',
    getSocialLinks().length < 2 && 'Fill in your social profiles in src/data/social.ts',
    site.content.showSampleData && 'Replace sample entries, then set content.showSampleData to false',
  ].filter(Boolean) as string[];
  if (hidden || !todo.length) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)] text-sm">
      {open ? (
        <div className="w-80 max-w-full bg-surface p-4 shadow-xl" /* taste-skill-ignore: floating dev-only panel */>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">Setup checklist (dev only)</p>
            <button type="button" aria-label="Close checklist" onClick={() => setOpen(false)} className="text-muted hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-muted">
            {todo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <button type="button" onClick={() => setHidden(true)} className="link mt-3 text-xs">
            Hide until reload
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-ink px-3 py-2 text-bg">
          <ClipboardList size={15} aria-hidden="true" /> Setup: {todo.length} to do
        </button>
      )}
    </div>
  );
}
