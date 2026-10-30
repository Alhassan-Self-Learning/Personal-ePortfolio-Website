import { Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { site } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { publicUrl } from '@/lib/paths';
import { getSocialLinks } from '@/lib/social';

export default function ContactPage() {
  usePageMeta('Contact', `Get in touch with ${site.profile.fullName}.`);
  const p = site.profile;
  const hasSocial = getSocialLinks().length > 0;

  return (
    <div className="container-page">
      <PageHeader title="Let’s talk" lead="Internships, graduate roles, research collaborations and CTF teams are all welcome, and so is comparing notes on a lab." />
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="reveal space-y-12 lg:col-span-6">
          <section aria-labelledby="direct-heading">
            <h2 id="direct-heading" className="text-display-md">
              Get in touch
            </h2>
            {p.availability && <p className="mt-5 text-xl">{p.availability}</p>}
            {p.email ? (
              <div className="mt-6">
                <LinkButton to={`mailto:${p.email}`} variant="primary">
                  <Mail size={17} aria-hidden="true" /> Email {p.email}
                </LinkButton>
                <p className="mt-3 text-base">Opens your email app. I usually reply within a few days.</p>
              </div>
            ) : (
              <p className="mt-6 bg-surface p-5 text-base">
                A public email address hasn’t been added yet. In the meantime, use any of the profiles below, or{' '}
                <Link to="/achievements" className="link">
                  browse the achievements
                </Link>
                .
              </p>
            )}
            <dl className="mt-8 grid grid-cols-2 gap-6 text-base">
              {p.location && (
                <div>
                  <dt className="text-sm text-muted">Based in</dt>
                  <dd>{p.location}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted">Studying</dt>
                <dd>{p.university}</dd>
              </div>
            </dl>
            {p.cvPath && (
              <LinkButton to={p.cvPath} download="" className="mt-8">
                <Download size={17} aria-hidden="true" /> Download CV
              </LinkButton>
            )}
          </section>
          <section aria-labelledby="profiles-heading">
            <h2 id="profiles-heading" className="mb-6 text-display-md">
              Profiles
            </h2>
            {hasSocial ? <SocialLinks variant="list" /> : <p className="text-base">Profiles will appear here once they’re added.</p>}
          </section>
        </div>
        {p.profileImageSquare && (
          <figure className="reveal lg:col-span-5 lg:col-start-8">
            <img src={publicUrl(p.profileImageSquare)} alt={`Portrait of ${p.fullName}`} width={480} height={480} className="aspect-square w-full object-cover" />
          </figure>
        )}
      </div>
    </div>
  );
}
