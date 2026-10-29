import { LinkButton } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <div className="container-page py-24">
      <p className="font-mono text-sm text-muted">HTTP 404</p>
      <h1 className="mt-3 font-display text-display-lg">No record of this page</h1>
      <p className="mt-4 max-w-[52ch] text-lg text-muted">The address may be mistyped, or the page may have moved. Search the portfolio or start from the homepage.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton to="/" variant="primary">
          Go to homepage
        </LinkButton>
        <LinkButton to="/search">Search the portfolio</LinkButton>
        <LinkButton to="/achievements" variant="ghost">
          Browse achievements
        </LinkButton>
      </div>
    </div>
  );
}
