import { FlaskConical, Server } from 'lucide-react';
import type { LabEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs, Steps } from './primitives';

/** Labs read like a lab notebook: setup, method, what was learned and observed. */
export default function LabDetail({ entry }: { entry: LabEntry }) {
  const independent = entry.kind === 'independent';
  return (
    <>
      <div className="reveal flex items-start gap-3 bg-surface p-6 text-base">
        {independent ? <FlaskConical size={18} aria-hidden="true" className="mt-0.5 text-cat-labs" /> : <Server size={18} aria-hidden="true" className="mt-0.5 text-cat-labs" />}
        <p>
          {independent
            ? 'An independent experiment I designed and ran myself.'
            : `A guided lab on ${entry.platform}. Answers and flags are not published here, in line with the platform's rules.`}
          {entry.environment && <span className="block text-muted">Environment: {entry.environment}</span>}
        </p>
      </div>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.objectives?.length && (
        <DetailSection title="Objectives">
          <BulletList items={entry.objectives} />
        </DetailSection>
      )}
      {!!entry.methodology?.length && (
        <DetailSection title="Method">
          <Steps items={entry.methodology} />
        </DetailSection>
      )}
      {!!entry.concepts?.length && (
        <DetailSection title="Concepts covered">
          <BulletList items={entry.concepts} />
        </DetailSection>
      )}
      {!!entry.observations?.length && (
        <DetailSection title="Observations">
          <BulletList items={entry.observations} />
        </DetailSection>
      )}
      {entry.notes && (
        <DetailSection title="Technical notes">
          <Paragraphs text={entry.notes} />
        </DetailSection>
      )}
      {!!entry.tools?.length && (
        <DetailSection title="Tools">
          <Chips items={entry.tools} />
        </DetailSection>
      )}
    </>
  );
}
