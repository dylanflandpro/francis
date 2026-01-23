import { ORPCError } from '@orpc/client';

import { zHabit } from '@/features/habits/schema';
import { protectedProcedure } from '@/server/orpc';

const tags = ['habits'];

export default {
  getAll: protectedProcedure({ permission: { habits: ['read'] } })
    .route({
      method: 'GET',
      path: '/habits',
      tags,
    })
    .output(zHabit().array())
    .handler(async ({ context }) => {
      const habits = await context.db.habits.findMany({
        where: {
          userId: context.user.id,
        },
        include: {
          user: true,
        },
      });

      if (!habits) {
        context.logger.warn('Unable to find habits');
        throw new ORPCError('NOT_FOUND');
      }
      return habits;
    }),
  create: protectedProcedure({ permission: { habits: ['create'] } })
    .route({
      method: 'POST',
      path: '/habits',
      tags,
    })
    .input(zHabit().omit({ id: true, user: true }))
    .output(zHabit().omit({ id: true, user: true }))
    .handler(async ({ context, input }) => {
      const createHabit = await context.db.habits.create({
        data: {
          ...input,
          userId: context.user.id,
        },
      });

      if (!createHabit) {
        context.logger.warn('Unable to create habit');
        throw new ORPCError('BAD_REQUEST');
      }

      return createHabit;
    }),
};
