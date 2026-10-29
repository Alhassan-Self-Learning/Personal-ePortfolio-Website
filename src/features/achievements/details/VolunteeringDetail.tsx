import type { VolunteeringEntry } from '@/types/content';
import { BulletList, DetailSection, Paragraphs } from './primitives';

export default function VolunteeringDetail({ entry }: { entry: VolunteeringEntry }) {
  return (
    <>
      <p className="text-lg">
        <span className="font-semibold">{entry.role}</span> <span className="text-muted">with {entry.organization}</span>
      </p>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.outcomes?.length && (
        <div className="rounded-xl border border-cat-volunteering/40 bg-cat-volunteering/5 p-5">
          <h2 className="mb-3 text-sm font-semibold text-cat-volunteering">Outcomes</h2>
          <BulletList items={entry.outcomes} />
        </div>
      )}
      {!!entry.responsibilities?.length && (
        <DetailSection title="Responsibilities">
          <BulletList items={entry.responsibilities} />
        </DetailSection>
      )}
      {!!entry.contributions?.length && (
        <DetailSection title="Contributions">
          <BulletList items={entry.contributions} />
        </DetailSection>
      )}
    </>
  );
}
