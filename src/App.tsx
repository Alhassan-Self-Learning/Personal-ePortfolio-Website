import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { categoryMeta, categoryOrder } from '@/data/categories';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const SkillsPage = lazy(() => import('@/pages/SkillsPage'));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'));
const JourneyPage = lazy(() => import('@/pages/JourneyPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CategoryPage = lazy(() => import('@/features/achievements/CategoryPage'));
const EntryDetailPage = lazy(() => import('@/features/achievements/EntryDetailPage'));

/** Keeps /achievements/projects/<id>-style links pointing at the right entry. */
function MovedTo({ base }: { base: string }) {
  const { id } = useParams();
  return <Navigate to={id ? `${base}/${id}` : base} replace />;
}

const categoryRoutes = categoryOrder.flatMap((k) => [
  { path: categoryMeta[k].path, element: <CategoryPage key={k} category={k} /> },
  { path: `${categoryMeta[k].path}/:id`, element: <EntryDetailPage key={k} category={k} /> },
]);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'skills', element: <SkillsPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      // Projects and Experience live at the top level; keep the hub-style URLs working.
      { path: 'achievements/projects', element: <MovedTo base="/projects" /> },
      { path: 'achievements/projects/:id', element: <MovedTo base="/projects" /> },
      { path: 'achievements/experience', element: <MovedTo base="/experience" /> },
      { path: 'achievements/experience/:id', element: <MovedTo base="/experience" /> },
      { path: 'journey', element: <JourneyPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'search', element: <SearchPage /> },
      ...categoryRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
