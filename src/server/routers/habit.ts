import { ORPCError } from '@orpc/client';
import { z } from 'zod';

import {
  zHabitCreate,
  zHabitEntryCreate,
  zHabitEntryQuery,
  zHabitEntryUpdate,
  zHabitId,
  zHabitQuery,
  zHabitUpdate,
} from '@/features/habit/schema';
import { Prisma } from '@/server/db/generated/client';
import { protectedProcedure } from '@/server/orpc';

const tags = ['habits'];

export default {
  // ==================== HABIT CRUD ====================

  getAll: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/habits',
      tags,
    })
    .input(
      z
        .object({
          cursor: z.string().optional(),
          limit: z.coerce.number().int().min(1).max(100).prefault(20),
          ...zHabitQuery.shape,
        })
        .prefault({})
    )
    .handler(async ({ context, input }) => {
      const where: Prisma.HabitWhereInput = {
        userId: context.user.id,
        ...(input.status && { status: input.status }),
        ...(input.frequency && { frequency: input.frequency }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' } },
            { description: { contains: input.search, mode: 'insensitive' } },
            { identity: { contains: input.search, mode: 'insensitive' } },
          ],
        }),
      };

      context.logger.info({ userId: context.user.id }, 'Getting user habits');
      const [total, items] = await Promise.all([
        context.db.habit.count({ where }),
        context.db.habit.findMany({
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
          where,
          include: {
            triggerHabit: {
              select: { id: true, name: true },
            },
          },
        }),
      ]);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
        total,
      };
    }),

  getById: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/habits/{id}',
      tags,
    })
    .input(zHabitId)
    .handler(async ({ context, input }) => {
      context.logger.info({ habitId: input.id }, 'Getting habit by ID');
      const habit = await context.db.habit.findUnique({
        where: { id: input.id, userId: context.user.id },
        include: {
          triggerHabit: {
            select: { id: true, name: true },
          },
          stackedHabits: {
            select: { id: true, name: true },
          },
        },
      });

      if (!habit) {
        context.logger.warn({ habitId: input.id }, 'Habit not found');
        throw new ORPCError('NOT_FOUND');
      }

      return habit;
    }),

  create: protectedProcedure({ permission: null })
    .route({
      method: 'POST',
      path: '/habits',
      tags,
    })
    .input(zHabitCreate)
    .handler(async ({ context, input }) => {
      context.logger.info({ name: input.name }, 'Creating new habit');

      // Validate trigger habit belongs to user if specified
      if (input.triggerHabitId) {
        const triggerHabit = await context.db.habit.findUnique({
          where: { id: input.triggerHabitId, userId: context.user.id },
        });

        if (!triggerHabit) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Trigger habit not found or does not belong to you',
          });
        }
      }

      try {
        return await context.db.habit.create({
          data: {
            ...input,
            userId: context.user.id,
          },
          include: {
            triggerHabit: {
              select: { id: true, name: true },
            },
          },
        });
      } catch (error: unknown) {
        context.logger.error({ error }, 'Failed to create habit');
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }
    }),

  update: protectedProcedure({ permission: null })
    .route({
      method: 'PUT',
      path: '/habits/{id}',
      tags,
    })
    .input(zHabitUpdate)
    .handler(async ({ context, input }) => {
      const { id, ...data } = input;
      context.logger.info({ habitId: id }, 'Updating habit');

      // Check habit exists and belongs to user
      const existing = await context.db.habit.findUnique({
        where: { id, userId: context.user.id },
      });

      if (!existing) {
        context.logger.warn({ habitId: id }, 'Habit not found');
        throw new ORPCError('NOT_FOUND');
      }

      // Validate trigger habit if being updated
      if (data.triggerHabitId) {
        const triggerHabit = await context.db.habit.findUnique({
          where: { id: data.triggerHabitId, userId: context.user.id },
        });

        if (!triggerHabit) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Trigger habit not found or does not belong to you',
          });
        }
      }

      try {
        return await context.db.habit.update({
          where: { id },
          data: {
            ...data,
            ...(data.status === 'ARCHIVED' && { archivedAt: new Date() }),
          },
          include: {
            triggerHabit: {
              select: { id: true, name: true },
            },
          },
        });
      } catch (error: unknown) {
        context.logger.error({ error }, 'Failed to update habit');
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }
    }),

  delete: protectedProcedure({ permission: null })
    .route({
      method: 'DELETE',
      path: '/habits/{id}',
      tags,
    })
    .input(zHabitId)
    .output(z.void())
    .handler(async ({ context, input }) => {
      context.logger.info({ habitId: input.id }, 'Deleting habit');

      // Check habit exists and belongs to user
      const habit = await context.db.habit.findUnique({
        where: { id: input.id, userId: context.user.id },
      });

      if (!habit) {
        context.logger.warn({ habitId: input.id }, 'Habit not found');
        throw new ORPCError('NOT_FOUND');
      }

      try {
        await context.db.habit.delete({
          where: { id: input.id },
        });
      } catch (error: unknown) {
        context.logger.error({ error }, 'Failed to delete habit');
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }
    }),

  // ==================== HABIT ENTRIES ====================

  getEntries: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/habits/entries',
      tags,
    })
    .input(
      z
        .object({
          cursor: z.string().optional(),
          limit: z.coerce.number().int().min(1).max(100).prefault(20),
          ...zHabitEntryQuery.shape,
        })
        .prefault({})
    )
    .handler(async ({ context, input }) => {
      const where: Prisma.HabitEntryWhereInput = {
        userId: context.user.id,
        ...(input.habitId && { habitId: input.habitId }),
        ...(input.completed !== undefined && { completed: input.completed }),
        ...(input.startDate &&
          input.endDate && {
            date: {
              gte: input.startDate,
              lte: input.endDate,
            },
          }),
      };

      context.logger.info({ userId: context.user.id }, 'Getting habit entries');
      const [total, items] = await Promise.all([
        context.db.habitEntry.count({ where }),
        context.db.habitEntry.findMany({
          take: input.limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: { date: 'desc' },
          where,
          include: {
            habit: {
              select: { id: true, name: true },
            },
          },
        }),
      ]);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
        total,
      };
    }),

  getEntryById: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/habits/entries/{id}',
      tags,
    })
    .input(z.object({ id: z.string().cuid() }))
    .handler(async ({ context, input }) => {
      context.logger.info({ entryId: input.id }, 'Getting habit entry by ID');
      const entry = await context.db.habitEntry.findUnique({
        where: { id: input.id, userId: context.user.id },
        include: {
          habit: true,
        },
      });

      if (!entry) {
        context.logger.warn({ entryId: input.id }, 'Habit entry not found');
        throw new ORPCError('NOT_FOUND');
      }

      return entry;
    }),

  createEntry: protectedProcedure({ permission: null })
    .route({
      method: 'POST',
      path: '/habits/entries',
      tags,
    })
    .input(zHabitEntryCreate)
    .handler(async ({ context, input }) => {
      context.logger.info({ habitId: input.habitId }, 'Creating habit entry');

      // Verify habit belongs to user
      const habit = await context.db.habit.findUnique({
        where: { id: input.habitId, userId: context.user.id },
      });

      if (!habit) {
        throw new ORPCError('BAD_REQUEST', {
          message: 'Habit not found or does not belong to you',
        });
      }

      try {
        return await context.db.habitEntry.create({
          data: {
            ...input,
            userId: context.user.id,
            completedAt: input.completed ? new Date() : undefined,
          },
          include: {
            habit: {
              select: { id: true, name: true },
            },
          },
        });
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ORPCError('CONFLICT', {
            message: 'Entry already exists for this habit and date',
          });
        }
        context.logger.error({ error }, 'Failed to create habit entry');
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }
    }),

  updateEntry: protectedProcedure({ permission: null })
    .route({
      method: 'PUT',
      path: '/habits/entries/{id}',
      tags,
    })
    .input(zHabitEntryUpdate)
    .handler(async ({ context, input }) => {
      const { id, ...data } = input;
      context.logger.info({ entryId: id }, 'Updating habit entry');

      // Check entry exists and belongs to user
      const existing = await context.db.habitEntry.findUnique({
        where: { id, userId: context.user.id },
      });

      if (!existing) {
        context.logger.warn({ entryId: id }, 'Habit entry not found');
        throw new ORPCError('NOT_FOUND');
      }

      try {
        // Calculate completedAt based on completed status
        let completedAt: Date | null | undefined = undefined;
        if (data.completed !== undefined) {
          completedAt = data.completed ? new Date() : null;
        }

        return await context.db.habitEntry.update({
          where: { id },
          data: {
            ...data,
            completedAt,
          },
          include: {
            habit: {
              select: { id: true, name: true },
            },
          },
        });
      } catch (error: unknown) {
        context.logger.error({ error }, 'Failed to update habit entry');
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }
    }),

  deleteEntry: protectedProcedure({ permission: null })
    .route({
      method: 'DELETE',
      path: '/habits/entries/{id}',
      tags,
    })
    .input(z.object({ id: z.string().cuid() }))
    .output(z.void())
    .handler(async ({ context, input }) => {
      context.logger.info({ entryId: input.id }, 'Deleting habit entry');

      // Check entry exists and belongs to user
      const entry = await context.db.habitEntry.findUnique({
        where: { id: input.id, userId: context.user.id },
      });

      if (!entry) {
        context.logger.warn({ entryId: input.id }, 'Habit entry not found');
        throw new ORPCError('NOT_FOUND');
      }

      try {
        await context.db.habitEntry.delete({
          where: { id: input.id },
        });
      } catch (error: unknown) {
        context.logger.error({ error }, 'Failed to delete habit entry');
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }
    }),
};
