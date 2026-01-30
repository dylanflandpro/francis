import { z } from 'zod';

// Enums matching Prisma schema
export const FrequencySchema = z.enum(['DAILY', 'WEEKLY', 'CUSTOM']);
export const DifficultySchema = z.enum([
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
]);
export const HabitStatusSchema = z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']);
export const TriggerTypeSchema = z.enum([
  'AFTER_HABIT',
  'BEFORE_HABIT',
  'TIME_BASED',
  'LOCATION_BASED',
  'EVENT_BASED',
]);
export const EnvironmentSchema = z.enum([
  'HOME',
  'WORK',
  'GYM',
  'OUTDOOR',
  'MOBILE',
  'CUSTOM',
]);
export const MoodSchema = z.enum([
  'GREAT',
  'GOOD',
  'NEUTRAL',
  'BAD',
  'TERRIBLE',
]);
export const DayOfWeekSchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

// Create Habit Schema
export const zHabitCreate = z.object({
  name: z.string().min(1, 'Habit name is required').max(100),
  description: z.string().max(500).optional(),

  // Identity-Based Habits
  identity: z.string().min(1, 'Identity is required').max(200),
  identityReason: z.string().max(500).optional(),

  // Habit Stacking
  triggerType: TriggerTypeSchema.optional(),
  triggerHabitId: z.string().cuid().optional(),

  // Environment Design
  environment: EnvironmentSchema.optional(),
  location: z.string().max(200).optional(),
  cue: z.string().max(200).optional(),

  // The 4 Laws of Behavior Change
  makeObvious: z.string().max(500).optional(),
  makeAttractive: z.string().max(500).optional(),
  makeEasy: z.string().max(500).optional(),
  makeSatisfying: z.string().max(500).optional(),

  // Frequency
  frequency: FrequencySchema.default('DAILY'),
  days: z.array(DayOfWeekSchema).optional(),
  scheduledTime: z
    .string()
    .regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/)
    .optional(),

  // Difficulty
  difficulty: DifficultySchema.default('BEGINNER'),
  minimumMinutes: z.number().int().min(1).max(1440).optional(),
  targetMinutes: z.number().int().min(1).max(1440).optional(),

  // Quantity
  quantity: z.string().max(50).optional(),
  unit: z.string().max(50).optional(),

  // Status
  status: HabitStatusSchema.default('ACTIVE'),
});

// Update Habit Schema
export const zHabitUpdate = zHabitCreate.partial().extend({
  id: z.string().cuid(),
});

// Habit ID param
export const zHabitId = z.object({
  id: z.string().cuid(),
});

// Habit Entry Schema
export const zHabitEntryCreate = z.object({
  habitId: z.string().cuid(),
  completed: z.boolean().default(false),
  completedAt: z.date().optional(),
  actualQuantity: z.number().positive().optional(),
  actualUnit: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
  mood: MoodSchema.optional(),
  skipped: z.boolean().default(false),
  skipReason: z.string().max(500).optional(),
  date: z.date().default(() => new Date()),
});

// Update Habit Entry Schema
export const zHabitEntryUpdate = zHabitEntryCreate.partial().extend({
  id: z.string().cuid(),
});

// Query schemas
export const zHabitQuery = z.object({
  status: HabitStatusSchema.optional(),
  search: z.string().optional(),
  frequency: FrequencySchema.optional(),
});

export const zHabitEntryQuery = z.object({
  habitId: z.string().cuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  completed: z.boolean().optional(),
});

// Type exports
export type HabitCreate = z.infer<typeof zHabitCreate>;
export type HabitUpdate = z.infer<typeof zHabitUpdate>;
export type HabitEntryCreate = z.infer<typeof zHabitEntryCreate>;
export type HabitEntryUpdate = z.infer<typeof zHabitEntryUpdate>;
export type HabitQuery = z.infer<typeof zHabitQuery>;
export type HabitEntryQuery = z.infer<typeof zHabitEntryQuery>;
