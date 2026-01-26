import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

describe('Prisma Schema - Enums', () => {
  describe('Frequency enum', () => {
    it('should have DAILY, WEEKLY, and CUSTOM values', async () => {
      // This test validates the enum exists by creating a habit with each value
      const testUserId = 'test-user-id';

      const habits = [
        {
          userId: testUserId,
          name: 'Daily Habit',
          identity: 'I am healthy',
          frequency: 'DAILY' as const,
        },
        {
          userId: testUserId,
          name: 'Weekly Habit',
          identity: 'I am consistent',
          frequency: 'WEEKLY' as const,
        },
        {
          userId: testUserId,
          name: 'Custom Habit',
          identity: 'I am flexible',
          frequency: 'CUSTOM' as const,
        },
      ];

      for (const habitData of habits) {
        const habit = await prisma.habit.create({
          data: {
            ...habitData,
            difficulty: 'BEGINNER',
          },
        });
        expect(habit.frequency).toBe(habitData.frequency);
        await prisma.habit.delete({ where: { id: habit.id } });
      }
    });
  });

  describe('Difficulty enum', () => {
    it('should have BEGINNER, INTERMEDIATE, and ADVANCED values', async () => {
      const testUserId = 'test-user-id';

      const difficulties: Array<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = [
        'BEGINNER',
        'INTERMEDIATE',
        'ADVANCED',
      ];

      for (const difficulty of difficulties) {
        const habit = await prisma.habit.create({
          data: {
            userId: testUserId,
            name: `Habit ${difficulty}`,
            identity: `I am ${difficulty.toLowerCase()}`,
            difficulty,
          },
        });
        expect(habit.difficulty).toBe(difficulty);
        await prisma.habit.delete({ where: { id: habit.id } });
      }
    });
  });

  describe('HabitStatus enum', () => {
    it('should have ACTIVE, PAUSED, and ARCHIVED values', async () => {
      const testUserId = 'test-user-id';

      const statuses: Array<'ACTIVE' | 'PAUSED' | 'ARCHIVED'> = [
        'ACTIVE',
        'PAUSED',
        'ARCHIVED',
      ];

      for (const status of statuses) {
        const habit = await prisma.habit.create({
          data: {
            userId: testUserId,
            name: `Habit ${status}`,
            identity: `I am ${status.toLowerCase()}`,
            status,
          },
        });
        expect(habit.status).toBe(status);
        await prisma.habit.delete({ where: { id: habit.id } });
      }
    });
  });

  describe('TriggerType enum', () => {
    it('should have AFTER_HABIT, BEFORE_HABIT, TIME_BASED, LOCATION_BASED, and EVENT_BASED values', async () => {
      const testUserId = 'test-user-id';

      const triggerTypes: Array<
        | 'AFTER_HABIT'
        | 'BEFORE_HABIT'
        | 'TIME_BASED'
        | 'LOCATION_BASED'
        | 'EVENT_BASED'
      > = [
        'AFTER_HABIT',
        'BEFORE_HABIT',
        'TIME_BASED',
        'LOCATION_BASED',
        'EVENT_BASED',
      ];

      for (const triggerType of triggerTypes) {
        const habit = await prisma.habit.create({
          data: {
            userId: testUserId,
            name: `Habit ${triggerType}`,
            identity: `I am triggered by ${triggerType.toLowerCase()}`,
            triggerType,
          },
        });
        expect(habit.triggerType).toBe(triggerType);
        await prisma.habit.delete({ where: { id: habit.id } });
      }
    });
  });

  describe('Environment enum', () => {
    it('should have HOME, WORK, GYM, OUTDOOR, MOBILE, and CUSTOM values', async () => {
      const testUserId = 'test-user-id';

      const environments: Array<
        'HOME' | 'WORK' | 'GYM' | 'OUTDOOR' | 'MOBILE' | 'CUSTOM'
      > = ['HOME', 'WORK', 'GYM', 'OUTDOOR', 'MOBILE', 'CUSTOM'];

      for (const environment of environments) {
        const habit = await prisma.habit.create({
          data: {
            userId: testUserId,
            name: `Habit ${environment}`,
            identity: `I am at ${environment.toLowerCase()}`,
            environment,
          },
        });
        expect(habit.environment).toBe(environment);
        await prisma.habit.delete({ where: { id: habit.id } });
      }
    });
  });

  describe('Mood enum', () => {
    it('should have GREAT, GOOD, NEUTRAL, BAD, and TERRIBLE values', async () => {
      const testUserId = 'test-user-id';

      const habits = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Mood Test Habit',
          identity: 'I am testing moods',
        },
      });

      const moods: Array<'GREAT' | 'GOOD' | 'NEUTRAL' | 'BAD' | 'TERRIBLE'> = [
        'GREAT',
        'GOOD',
        'NEUTRAL',
        'BAD',
        'TERRIBLE',
      ];

      for (const mood of moods) {
        const entry = await prisma.habitEntry.create({
          data: {
            habitId: habits.id,
            userId: testUserId,
            mood,
          },
        });
        expect(entry.mood).toBe(mood);
        await prisma.habitEntry.delete({ where: { id: entry.id } });
      }

      await prisma.habit.delete({ where: { id: habits.id } });
    });
  });

  describe('DayOfWeek enum', () => {
    it('should have all 7 days of the week', async () => {
      const testUserId = 'test-user-id';

      const days: Array<
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY'
      > = [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ];

      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Days Test Habit',
          identity: 'I am testing days',
          days,
        },
      });

      expect(habit.days).toHaveLength(7);
      expect(habit.days).toContain('MONDAY');
      expect(habit.days).toContain('SUNDAY');

      await prisma.habit.delete({ where: { id: habit.id } });
    });
  });
});

describe('Prisma Schema - Habit Model', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Create a test user or use existing
    testUserId = 'test-habit-schema-user';
    try {
      await prisma.user.create({
        data: {
          id: testUserId,
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: true,
        },
      });
      // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (_error) {
      // User might already exist, ignore
    }
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.habitEntry.deleteMany({ where: { userId: testUserId } });
    await prisma.habit.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  describe('Basic fields', () => {
    it('should create habit with required fields', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Morning Exercise',
          identity: 'I am someone who exercises',
        },
      });

      expect(habit.id).toBeDefined();
      expect(habit.name).toBe('Morning Exercise');
      expect(habit.identity).toBe('I am someone who exercises');
      expect(habit.createdAt).toBeDefined();
      expect(habit.updatedAt).toBeDefined();

      await prisma.habit.delete({ where: { id: habit.id } });
    });

    it('should create habit with optional fields', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Reading',
          description: 'Read for 30 minutes daily',
          identity: 'I am someone who reads',
          scheduledTime: '07:00',
          quantity: '30',
          unit: 'minutes',
          minimumMinutes: 10,
          targetMinutes: 30,
        },
      });

      expect(habit.description).toBe('Read for 30 minutes daily');
      expect(habit.scheduledTime).toBe('07:00');
      expect(habit.quantity).toBe('30');
      expect(habit.unit).toBe('minutes');
      expect(habit.minimumMinutes).toBe(10);
      expect(habit.targetMinutes).toBe(30);

      await prisma.habit.delete({ where: { id: habit.id } });
    });
  });

  describe('Atomic Habits principles', () => {
    it('should support identity-based habits', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Meditation',
          identity: 'I am someone who meditates daily',
          identityReason: 'To improve my mental clarity',
        },
      });

      expect(habit.identity).toBe('I am someone who meditates daily');
      expect(habit.identityReason).toBe('To improve my mental clarity');

      await prisma.habit.delete({ where: { id: habit.id } });
    });

    it('should support habit stacking', async () => {
      const triggerHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Morning Coffee',
          identity: 'I am someone who enjoys coffee',
        },
      });

      const stackedHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Journaling',
          identity: 'I am someone who journals',
          triggerType: 'AFTER_HABIT',
          triggerHabitId: triggerHabit.id,
        },
      });

      expect(stackedHabit.triggerType).toBe('AFTER_HABIT');
      expect(stackedHabit.triggerHabitId).toBe(triggerHabit.id);

      await prisma.habit.deleteMany({ where: { userId: testUserId } });
    });

    it('should support environment design', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Reading',
          identity: 'I am someone who reads',
          environment: 'HOME',
          location: 'Living room',
          cue: 'Seeing book on coffee table',
        },
      });

      expect(habit.environment).toBe('HOME');
      expect(habit.location).toBe('Living room');
      expect(habit.cue).toBe('Seeing book on coffee table');

      await prisma.habit.delete({ where: { id: habit.id } });
    });

    it('should support the 4 laws of behavior change', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Exercise',
          identity: 'I am someone who exercises',
          makeObvious: 'Lay out workout clothes the night before',
          makeAttractive: 'Listen to favorite music while exercising',
          makeEasy: 'Start with just 5 minutes',
          makeSatisfying: 'Track progress in app',
        },
      });

      expect(habit.makeObvious).toBe(
        'Lay out workout clothes the night before'
      );
      expect(habit.makeAttractive).toBe(
        'Listen to favorite music while exercising'
      );
      expect(habit.makeEasy).toBe('Start with just 5 minutes');
      expect(habit.makeSatisfying).toBe('Track progress in app');

      await prisma.habit.delete({ where: { id: habit.id } });
    });
  });

  describe('Status management', () => {
    it('should create active habit by default', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Active Habit',
          identity: 'I am someone who stays active',
        },
      });

      expect(habit.status).toBe('ACTIVE');
      expect(habit.archivedAt).toBeNull();

      await prisma.habit.delete({ where: { id: habit.id } });
    });

    it('should support paused and archived status', async () => {
      const pausedHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Paused Habit',
          identity: 'I am someone who takes breaks',
          status: 'PAUSED',
        },
      });

      const archivedHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Archived Habit',
          identity: 'I was someone who did this',
          status: 'ARCHIVED',
          archivedAt: new Date(),
        },
      });

      expect(pausedHabit.status).toBe('PAUSED');
      expect(archivedHabit.status).toBe('ARCHIVED');
      expect(archivedHabit.archivedAt).toBeDefined();

      await prisma.habit.deleteMany({ where: { userId: testUserId } });
    });
  });

  describe('Default values', () => {
    it('should set DAILY as default frequency', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Default Frequency',
          identity: 'I am someone who has defaults',
        },
      });

      expect(habit.frequency).toBe('DAILY');

      await prisma.habit.delete({ where: { id: habit.id } });
    });

    it('should set BEGINNER as default difficulty', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Default Difficulty',
          identity: 'I am someone who starts at the beginning',
        },
      });

      expect(habit.difficulty).toBe('BEGINNER');

      await prisma.habit.delete({ where: { id: habit.id } });
    });
  });
});

describe('Prisma Schema - HabitEntry Model', () => {
  let testUserId: string;
  let testHabitId: string;

  beforeAll(async () => {
    testUserId = 'test-habit-entry-schema-user';
    try {
      await prisma.user.create({
        data: {
          id: testUserId,
          name: 'Test User',
          email: 'test-entries@example.com',
          emailVerified: true,
        },
      });
      // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (_error) {
      // User might already exist
    }

    const habit = await prisma.habit.create({
      data: {
        userId: testUserId,
        name: 'Test Habit',
        identity: 'I am someone who tests',
      },
    });
    testHabitId = habit.id;
  });

  afterAll(async () => {
    await prisma.habitEntry.deleteMany({ where: { userId: testUserId } });
    await prisma.habit.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  describe('Basic fields', () => {
    it('should create entry with required fields', async () => {
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
        },
      });

      expect(entry.id).toBeDefined();
      expect(entry.habitId).toBe(testHabitId);
      expect(entry.userId).toBe(testUserId);
      expect(entry.date).toBeDefined();
      expect(entry.createdAt).toBeDefined();
      expect(entry.updatedAt).toBeDefined();

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Completion tracking', () => {
    it('should create uncompleted entry by default', async () => {
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
        },
      });

      expect(entry.completed).toBe(false);
      expect(entry.completedAt).toBeNull();

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });

    it('should support marking entry as completed', async () => {
      const completedAt = new Date();
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          completed: true,
          completedAt,
        },
      });

      expect(entry.completed).toBe(true);
      expect(entry.completedAt).toEqual(completedAt);

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Quantity tracking', () => {
    it('should track actual quantity', async () => {
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          actualQuantity: 5.5,
          actualUnit: 'km',
        },
      });

      expect(entry.actualQuantity).toBe(5.5);
      expect(entry.actualUnit).toBe('km');

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Notes and mood', () => {
    it('should support notes and mood tracking', async () => {
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          notes: 'Felt great today!',
          mood: 'GREAT',
        },
      });

      expect(entry.notes).toBe('Felt great today!');
      expect(entry.mood).toBe('GREAT');

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Skip tracking', () => {
    it('should support skipping with reason', async () => {
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          skipped: true,
          skipReason: 'Sick today',
        },
      });

      expect(entry.skipped).toBe(true);
      expect(entry.skipReason).toBe('Sick today');

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Date management', () => {
    it('should use current date by default', async () => {
      const now = new Date();
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
        },
      });

      expect(entry.date).toBeDefined();
      expect(Math.abs(entry.date.getTime() - now.getTime())).toBeLessThan(5000); // Within 5 seconds

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });

    it('should support custom date', async () => {
      const customDate = new Date('2026-01-26T10:00:00.000Z');
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date: customDate,
        },
      });

      expect(entry.date).toEqual(customDate);

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });
});

describe('Prisma Schema - Relations', () => {
  let testUserId: string;
  let testHabitId: string;

  beforeAll(async () => {
    testUserId = 'test-relations-user';
    try {
      await prisma.user.create({
        data: {
          id: testUserId,
          name: 'Test User',
          email: 'test-relations@example.com',
          emailVerified: true,
        },
      });
      // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (_error) {
      // User might already exist
    }

    const habit = await prisma.habit.create({
      data: {
        userId: testUserId,
        name: 'Test Habit',
        identity: 'I am someone who tests relations',
      },
    });
    testHabitId = habit.id;
  });

  afterAll(async () => {
    await prisma.habitEntry.deleteMany({ where: { userId: testUserId } });
    await prisma.habit.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  describe('User to Habit relation', () => {
    it('should allow fetching habits for a user', async () => {
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
        include: { habits: true },
      });

      expect(user).toBeDefined();
      expect(user?.habits).toHaveLength(1);
      expect(user?.habits[0]?.id).toBe(testHabitId);
    });

    it('should allow creating habit with user relation', async () => {
      const habit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'New Habit',
          identity: 'I am someone who creates',
        },
      });

      expect(habit.userId).toBe(testUserId);

      await prisma.habit.delete({ where: { id: habit.id } });
    });
  });

  describe('User to HabitEntry relation', () => {
    it('should allow fetching entries for a user', async () => {
      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
        },
      });

      const user = await prisma.user.findUnique({
        where: { id: testUserId },
        include: { habitEntries: true },
      });

      expect(user?.habitEntries).toHaveLength(1);
      expect(user?.habitEntries[0]?.id).toBe(entry.id);

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Habit to HabitEntry relation', () => {
    it('should allow fetching entries for a habit', async () => {
      const _entry1 = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
        },
      });

      const _entry2 = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
        },
      });

      const habit = await prisma.habit.findUnique({
        where: { id: testHabitId },
        include: { entries: true },
      });

      expect(habit?.entries).toHaveLength(2);

      await prisma.habitEntry.deleteMany({ where: { habitId: testHabitId } });
    });
  });

  describe('Habit stacking relation', () => {
    it('should allow habit stacking', async () => {
      const triggerHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Trigger Habit',
          identity: 'I am someone who triggers',
        },
      });

      const stackedHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Stacked Habit',
          identity: 'I am someone who stacks',
          triggerType: 'AFTER_HABIT',
          triggerHabitId: triggerHabit.id,
        },
      });

      // Fetch trigger habit with stacked habits
      const triggerWithStacked = await prisma.habit.findUnique({
        where: { id: triggerHabit.id },
        include: { stackedHabits: true },
      });

      expect(triggerWithStacked?.stackedHabits).toHaveLength(1);
      expect(triggerWithStacked?.stackedHabits[0]?.id).toBe(stackedHabit.id);

      // Fetch stacked habit with trigger habit
      const stackedWithTrigger = await prisma.habit.findUnique({
        where: { id: stackedHabit.id },
        include: { triggerHabit: true },
      });

      expect(stackedWithTrigger?.triggerHabit?.id).toBe(triggerHabit.id);

      await prisma.habit.deleteMany({
        where: {
          userId: testUserId,
          id: { in: [triggerHabit.id, stackedHabit.id] },
        },
      });
    });
  });

  describe('Cascade delete', () => {
    it('should delete entries when habit is deleted', async () => {
      const tempHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Temp Habit',
          identity: 'I am someone who is temporary',
        },
      });

      const entry = await prisma.habitEntry.create({
        data: {
          habitId: tempHabit.id,
          userId: testUserId,
        },
      });

      await prisma.habit.delete({ where: { id: tempHabit.id } });

      const deletedEntry = await prisma.habitEntry.findUnique({
        where: { id: entry.id },
      });

      expect(deletedEntry).toBeNull();
    });
  });
});

describe('Prisma Schema - Indexes and Constraints', () => {
  let testUserId: string;
  let testHabitId: string;

  beforeAll(async () => {
    testUserId = 'test-indexes-user';
    try {
      await prisma.user.create({
        data: {
          id: testUserId,
          name: 'Test User',
          email: 'test-indexes@example.com',
          emailVerified: true,
        },
      });
      // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (_error) {
      // User might already exist
    }

    const habit = await prisma.habit.create({
      data: {
        userId: testUserId,
        name: 'Test Habit',
        identity: 'I am someone who tests indexes',
      },
    });
    testHabitId = habit.id;
  });

  afterAll(async () => {
    await prisma.habitEntry.deleteMany({ where: { userId: testUserId } });
    await prisma.habit.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  describe('Habit indexes', () => {
    it('should support querying by userId and status', async () => {
      const activeHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Active Test Habit',
          identity: 'I am someone who is active',
          status: 'ACTIVE',
        },
      });

      const pausedHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Paused Test Habit',
          identity: 'I am someone who pauses',
          status: 'PAUSED',
        },
      });

      const activeHabits = await prisma.habit.findMany({
        where: {
          userId: testUserId,
          status: 'ACTIVE',
        },
      });

      expect(activeHabits.length).toBeGreaterThan(0);
      expect(activeHabits.some((h) => h.id === activeHabit.id)).toBe(true);

      await prisma.habit.deleteMany({
        where: {
          userId: testUserId,
          id: { in: [activeHabit.id, pausedHabit.id] },
        },
      });
    });

    it('should support querying by triggerHabitId', async () => {
      const triggerHabit = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Trigger Index Habit',
          identity: 'I am someone who triggers index',
        },
      });

      const stackedHabit1 = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Stacked 1',
          identity: 'I am someone who stacks 1',
          triggerType: 'AFTER_HABIT',
          triggerHabitId: triggerHabit.id,
        },
      });

      const stackedHabit2 = await prisma.habit.create({
        data: {
          userId: testUserId,
          name: 'Stacked 2',
          identity: 'I am someone who stacks 2',
          triggerType: 'AFTER_HABIT',
          triggerHabitId: triggerHabit.id,
        },
      });

      const stackedHabits = await prisma.habit.findMany({
        where: {
          triggerHabitId: triggerHabit.id,
        },
      });

      expect(stackedHabits).toHaveLength(2);

      await prisma.habit.deleteMany({
        where: {
          userId: testUserId,
          id: { in: [triggerHabit.id, stackedHabit1.id, stackedHabit2.id] },
        },
      });
    });
  });

  describe('HabitEntry indexes', () => {
    it('should support querying by habitId and date', async () => {
      const date1 = new Date('2026-01-26T00:00:00.000Z');
      const date2 = new Date('2026-01-27T00:00:00.000Z');

      const _entry1 = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date: date1,
        },
      });

      const _entry2 = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date: date2,
        },
      });

      const entries = await prisma.habitEntry.findMany({
        where: {
          habitId: testHabitId,
          date: { gte: date1, lte: date2 },
        },
        orderBy: { date: 'asc' },
      });

      expect(entries).toHaveLength(2);
      expect(entries[0]?.date).toEqual(date1);
      expect(entries[1]?.date).toEqual(date2);

      await prisma.habitEntry.deleteMany({ where: { habitId: testHabitId } });
    });

    it('should support querying by userId and date', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const entry = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date: today,
        },
      });

      const entries = await prisma.habitEntry.findMany({
        where: {
          userId: testUserId,
          date: today,
        },
      });

      expect(entries.length).toBeGreaterThan(0);

      await prisma.habitEntry.delete({ where: { id: entry.id } });
    });
  });

  describe('Unique constraint', () => {
    it('should enforce unique combination of habitId and date', async () => {
      const date = new Date('2026-01-26T10:00:00.000Z');

      await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date,
        },
      });

      await expect(
        prisma.habitEntry.create({
          data: {
            habitId: testHabitId,
            userId: testUserId,
            date,
          },
        })
      ).rejects.toThrow();

      await prisma.habitEntry.deleteMany({
        where: { habitId: testHabitId, date },
      });
    });

    it('should allow entries for the same habit on different dates', async () => {
      const date1 = new Date('2026-01-26T10:00:00.000Z');
      const date2 = new Date('2026-01-27T10:00:00.000Z');

      const entry1 = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date: date1,
        },
      });

      const entry2 = await prisma.habitEntry.create({
        data: {
          habitId: testHabitId,
          userId: testUserId,
          date: date2,
        },
      });

      expect(entry1.id).not.toBe(entry2.id);

      await prisma.habitEntry.deleteMany({
        where: { habitId: testHabitId, date: { in: [date1, date2] } },
      });
    });
  });
});
