import { Trophy, Users, User } from 'lucide-react';
import type { CompetitionEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs } from './primitives';

export default function CompetitionDetail({ entry }: { entry: CompetitionEntry }) {
  return (
    <>
      <div className="reveal grid gap-3 sm:grid-cols-2">
        <div className="flex gap-3 bg-surface p-6">
          <Trophy size={22} aria-hidden="true" className={entry.result ? 'text-cat-competitions' : 'text-muted'} />
          <div>
            <p className="text-sm text-muted">Result</p>
            <p className="text-xl font-medium">{entry.result ?? 'Participated'}</p>
          </div>
        </div>
        <div className="flex gap-3 bg-surface p-6">
          {entry.participation === 'team' ? <Users size={22} aria-hidden="true" className="text-muted" /> : <User size={22} aria-hidden="true" className="text-muted" />}
          <div>
            <p className="text-sm text-muted">{entry.participation === 'team' ? 'Team' : 'Participation'}</p>
            <p className="text-xl font-medium">{entry.participation === 'team' ? entry.teamName ?? 'Team entry' : 'Individual'}</p>
          </div>
        </div>
      </div>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.challengeCategories?.length && (
        <DetailSection title="Challenge categories">
          <Chips items={entry.challengeCategories} />
        </DetailSection>
      )}
      {!!entry.highlights?.length && (
        <DetailSection title="What I worked on">
          <BulletList items={entry.highlights} />
        </DetailSection>
      )}
    </>
  );
}
