import type { WorkshopEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs } from './primitives';

export default function WorkshopDetail({ entry }: { entry: WorkshopEntry }) {
  return (
    <>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.activities?.length && (
        <DetailSection title="Hands-on activities">
          <BulletList items={entry.activities} />
        </DetailSection>
      )}
      {!!entry.topics?.length && (
        <DetailSection title="Topics">
          <Chips items={entry.topics} />
        </DetailSection>
      )}
    </>
  );
}
