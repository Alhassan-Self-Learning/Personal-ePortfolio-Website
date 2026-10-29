import type { ExperienceEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs } from './primitives';

export default function ExperienceDetail({ entry }: { entry: ExperienceEntry }) {
  return (
    <>
      {entry.description && <Paragraphs text={entry.description} />}
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
      {!!entry.outcomes?.length && (
        <DetailSection title="Outcomes">
          <BulletList items={entry.outcomes} />
        </DetailSection>
      )}
      {!!entry.technologies?.length && (
        <DetailSection title="Tools and technologies">
          <Chips items={entry.technologies} />
        </DetailSection>
      )}
    </>
  );
}
