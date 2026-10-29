import type { ProgramEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs, Steps } from './primitives';

export default function ProgramDetail({ entry }: { entry: ProgramEntry }) {
  return (
    <>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.modules?.length && (
        <DetailSection title="Modules">
          <Steps items={entry.modules} />
        </DetailSection>
      )}
      {!!entry.objectives?.length && (
        <DetailSection title="Learning objectives">
          <BulletList items={entry.objectives} />
        </DetailSection>
      )}
      {!!entry.exercises?.length && (
        <DetailSection title="Projects and exercises">
          <BulletList items={entry.exercises} />
        </DetailSection>
      )}
      {!!entry.technologies?.length && (
        <DetailSection title="Technologies">
          <Chips items={entry.technologies} />
        </DetailSection>
      )}
    </>
  );
}
