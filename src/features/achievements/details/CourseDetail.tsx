import type { CourseEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs } from './primitives';

export default function CourseDetail({ entry }: { entry: CourseEntry }) {
  return (
    <>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.outcomes?.length && (
        <DetailSection title="What I can do after this course">
          <BulletList items={entry.outcomes} />
        </DetailSection>
      )}
      {(!!entry.topics?.length || !!entry.technologies?.length) && (
        <DetailSection title="Topics and technologies">
          <div className="space-y-3">
            <Chips items={entry.topics} />
            <Chips items={entry.technologies} />
          </div>
        </DetailSection>
      )}
    </>
  );
}
