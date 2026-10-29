import { Trophy, Users, User } from 'lucide-react';
import type { CompetitionEntry } from '@/types/content';
import { BulletList, Chips, DetailSection, Paragraphs } from './primitives';

export default function CompetitionDetail({ entry }: { entry: CompetitionEntry }) {
  return (
    <>
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        <div className="flex gap-3 bg-surface p-5">
          <Trophy size={22} aria-hidden="true" className={entry.result ? 'text-cat-competitions' : 'text-muted'} />
          <div>
            <p className="text-xs text-muted">Result</p>
            <p className="font-display text-lg font-semibold">{entry.result ?? 'Participated'}</p>
          </div>
        </div>
        <div className="flex gap-3 bg-surface p-5">
          {entry.participation === 'team' ? <Users size={22} aria-hidden="true" className="text-muted" /> : <User size={22} aria-hidden="true" className="text-muted" />}
          <div>
            <p className="text-xs text-muted">{entry.participation === 'team' ? 'Team' : 'Participation'}</p>
            <p className="font-display text-lg font-semibold">{entry.participation === 'team' ? entry.teamName ?? 'Team entry' : 'Individual'}</p>
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
