import { Download, Mail, MapPin } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { site } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getSocialLinks } from '@/lib/social';

export default function ContactPage() {
  usePageMeta('Contact', `Get in touch with ${site.profile.fullName}.`);
  const p = site.profile;
  const hasSocial = getSocialLinks().length > 0;

  return (
    <div className="container-page pb-20">
      <PageHeader
        title="Let's talk"
        lead="I'm happy to hear about internships, graduate roles, research collaborations and CTF teams — or just to compare notes on a lab."
      />
      <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        <section aria-labelledby="direct-heading" className="space-y-6">
          <h2 id="direct-heading" className="font-display text-display-md">
            Get in touch
          </h2>
          {p.availability && <p className="text-lg">{p.availability}</p>}
          {p.email ? (
            <div>
              <LinkButton to={`mailto:${p.email}`} variant="primary">
                <Mail size={16} aria-hidden="true" /> Email {p.email}
              </LinkButton>
              <p className="mt-3 text-sm text-muted">Opens your email app. I usually reply within a few days.</p>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">
              A public email address hasn't been added yet. In the meantime, reach out through any of the profiles listed here.
            </p>
          )}
          <dl className="space-y-3 text-sm">
            {p.location && (
              <div className="flex items-center gap-3">
                <MapPin size={16} aria-hidden="true" className="text-accent" />
                <dt className="sr-only">Location</dt>
                <dd>Based in {p.location}</dd>
              </div>
            )}
          </dl>
          {p.cvPath && (
            <LinkButton to={p.cvPath} download="">
              <Download size={16} aria-hidden="true" /> Download CV
            </LinkButton>
          )}
        </section>
        <section aria-labelledby="profiles-heading">
          <h2 id="profiles-heading" className="mb-6 font-display text-display-md">
            Profiles
          </h2>
          {hasSocial ? (
            <SocialLinks variant="list" />
          ) : (
            <p className="text-sm text-muted">Profiles will appear here once they're added.</p>
          )}
        </section>
      </div>
    </div>
  );
}
