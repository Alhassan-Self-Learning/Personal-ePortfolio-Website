import { LinkButton } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <div className="container-page py-20 sm:py-28">
      <h1 className="text-display-lg">No record of this page</h1>
      <p className="mt-6 max-w-[52ch] text-xl">The address may be mistyped, or the page may have moved. Search the portfolio or start from the homepage.</p>
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
