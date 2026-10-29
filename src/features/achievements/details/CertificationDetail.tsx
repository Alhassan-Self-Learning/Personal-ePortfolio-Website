import { BadgeCheck, ExternalLink } from 'lucide-react';
import type { CertificationEntry } from '@/types/content';
import { formatDate } from '@/lib/dates';
import { certValidity } from '../status';
import { DetailSection, Paragraphs } from './primitives';

/** Certifications lead with the credential itself and how to verify it. */
export default function CertificationDetail({ entry }: { entry: CertificationEntry }) {
  const verify = entry.links?.find((l) => l.kind === 'verification');
  const validity = certValidity(entry);
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-cat-certifications/40">
        <div className="flex items-start gap-4 bg-cat-certifications/10 p-5">
          <BadgeCheck size={28} aria-hidden="true" className="mt-0.5 shrink-0 text-cat-certifications" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold">{validity.label}</p>
            <p className="text-sm text-muted">
              Issued by {entry.issuer}
              {entry.date ? ` in ${formatDate(entry.date)}` : ''}
              {entry.expires ? `, ${validity.expired ? 'expired' : 'expires'} ${formatDate(entry.expires)}` : ''}
            </p>
          </div>
        </div>
        <dl className="grid gap-px bg-line sm:grid-cols-2">
          <div className="bg-surface p-4">
            <dt className="text-xs text-muted">Credential ID</dt>
            <dd className="mt-1 break-all font-mono text-sm">{entry.credentialId && !entry.hideCredentialId ? entry.credentialId : 'Not published'}</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-xs text-muted">Verification</dt>
            <dd className="mt-1 text-sm">
              {verify ? (
                <a href={verify.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                  Verify with {entry.issuer} <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <span className="text-muted">No public verification link</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
      {entry.description && (
        <DetailSection title="About this certification">
          <Paragraphs text={entry.description} />
        </DetailSection>
      )}
    </>
  );
}
