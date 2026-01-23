import z from 'zod';

import { zUser } from '@/features/user/schema';
export type Habit = z.infer<ReturnType<typeof zHabit>>;
export const zHabit = () =>
  z.object({
    id: z.string(),
    name: z.string(),
    when: z.string(),
    identity: z.string(),
    days: z.array(zDays()),
    quantity: z.string(), // TODO faire les différentes mesures pour quantifier les habitudes
    time: z.string().array(), // hour when habit should be remind
    user: zUser(),
  });

export const zDays = () =>
  z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]);
