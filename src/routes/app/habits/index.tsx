import { createFileRoute } from '@tanstack/react-router';

import { PageHabits } from '@/features/book/app/page-habits';

export const Route = createFileRoute('/app/habits/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageHabits />;
}
