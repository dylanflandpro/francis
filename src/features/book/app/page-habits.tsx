import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';

import { orpc } from '@/lib/orpc/client';

import { PageError } from '@/components/errors/page-error';
import { Spinner } from '@/components/ui/spinner';

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/app/page-layout';

export const PageHabits = () => {
  const habitsQuery = useQuery(orpc.habit.getAll.queryOptions());

  const ui = getUiState((set) => {
    if (habitsQuery.isLoading) return set('pending');
    if (habitsQuery.status === 'error') return set('error');

    const items = habitsQuery.data;
    if (!items) return set('empty');
    return set('default', { items });
  });

  return (
    <PageLayout>
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>Habits</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent>
        {ui
          .match('pending', () => <Spinner />)
          .match('error', () => <PageError type="unknown-server-error" />)
          .match('empty', () => (
            <div className="flex flex-1 text-sm text-muted-foreground">
              no habits found
            </div>
          ))
          .match('default', ({ items }) => (
            <div className="flex flex-col gap-4 pb-20">
              {items.map((item) => (
                <div key={item.id}>
                  I will <span className="underline">{item.name}</span>,{' '}
                  <span className="underline">{item.when}</span> so that I can
                  become <span className="underline">{item.identity}</span>
                </div>
              ))}
            </div>
          ))
          .exhaustive()}
      </PageLayoutContent>
    </PageLayout>
  );
};
