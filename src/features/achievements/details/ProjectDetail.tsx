import { MediaGallery } from '@/components/ui/MediaGallery';
import type { ProjectEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Pair, Paragraphs } from './primitives';

/** Projects emphasise the problem, the implementation and the decisions behind it. */
export default function ProjectDetail({ entry }: { entry: ProjectEntry }) {
  const visuals = entry.media ?? [];
  return (
    <>
      {entry.description && <Paragraphs text={entry.description} />}
      {(entry.problem || entry.contribution) && (
        <Pair
          left={{ title: 'Problem', body: entry.problem ?? <span className="text-muted">Not described yet.</span> }}
          right={{ title: 'My contribution', body: entry.contribution ?? <span className="text-muted">Not described yet.</span> }}
        />
      )}
      {!!entry.objectives?.length && (
        <DetailSection title="Objectives">
          <BulletList items={entry.objectives} />
        </DetailSection>
      )}
      {!!visuals.length && (
        <DetailSection title="Screenshots and diagrams">
          <MediaGallery items={visuals} />
        </DetailSection>
      )}
      {(entry.implementation || !!entry.technologies?.length) && (
        <DetailSection title="Implementation">
          <div className="space-y-4">
            <Paragraphs text={entry.implementation} />
            <Chips items={entry.technologies} />
          </div>
        </DetailSection>
      )}
      {!!entry.features?.length && (
        <DetailSection title="Key features">
          <BulletList items={entry.features} />
        </DetailSection>
      )}
      {!!entry.challenges?.length && (
        <DetailSection title="Challenges">
          <BulletList items={entry.challenges} />
        </DetailSection>
      )}
      {!!entry.results?.length && (
        <DetailSection title="Results">
          <BulletList items={entry.results} />
        </DetailSection>
      )}
    </>
  );
}
