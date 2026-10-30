import type { EventEntry } from '@/types/content';
import { eventRoleLabel } from '../status';
import { BulletList, Chips, DetailSection, Paragraphs } from './primitives';

const roleSentence: Record<EventEntry['role'], string> = {
  attendee: 'I attended this event.',
  speaker: 'I spoke at this event.',
  presenter: 'I presented at this event.',
  exhibitor: 'I exhibited at this event.',
  volunteer: 'I volunteered at this event.',
  organizer: 'I helped organise this event.',
};

/** Events state the role up front so attending is never confused with presenting. */
export default function EventDetail({ entry }: { entry: EventEntry }) {
  const active = entry.role !== 'attendee';
  return (
    <>
      <div className={active ? 'reveal bg-cat-events/10 p-6' : 'reveal bg-surface p-6'}>
        <p className="text-sm text-muted">My role</p>
        <p className="text-xl font-medium">{eventRoleLabel[entry.role]}</p>
        <p className="mt-1 text-base">{roleSentence[entry.role]}</p>
      </div>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.takeaways?.length && (
        <DetailSection title="What I took away">
          <BulletList items={entry.takeaways} />
        </DetailSection>
      )}
      {!!entry.topics?.length && (
        <DetailSection title="Topics">
          <Chips items={entry.topics} />
        </DetailSection>
      )}
      {!!entry.speakers?.length && (
        <DetailSection title="Speakers">
          <BulletList items={entry.speakers} />
        </DetailSection>
      )}
    </>
  );
}
