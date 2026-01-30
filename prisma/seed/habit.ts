import { db } from '@/server/db';
import { Prisma } from '@/server/db/generated/client';

import { emphasis } from './_utils';

export async function createHabits() {
  console.log(`⏳ Seeding habits`);

  let createdCounter = 0;
  const existingCount = await db.habit.count();

  // Get existing users
  const adminUser = await db.user.findUnique({
    where: { email: 'admin@admin.com' },
  });
  const regularUser = await db.user.findUnique({
    where: { email: 'user@user.com' },
  });

  if (!adminUser || !regularUser) {
    console.log('⚠️  Users not found, skipping habit seeding');
    return;
  }

  // Sample habits based on Atomic Habits principles
  const sampleHabits: Prisma.HabitCreateInput[] = [
    // Morning routine habits for regular user
    {
      name: 'Morning Meditation',
      description: 'Start the day with 10 minutes of mindfulness meditation',
      identity: 'I am a calm and centered person',
      identityReason:
        'Meditation helps me stay grounded and focused throughout the day',
      frequency: 'DAILY',
      difficulty: 'BEGINNER',
      minimumMinutes: 5,
      targetMinutes: 10,
      environment: 'HOME',
      location: 'Bedroom corner with meditation cushion',
      cue: 'Right after waking up, before checking phone',
      makeObvious: 'Leave meditation cushion visible in bedroom corner',
      makeAttractive: 'Light a calming lavender candle during meditation',
      makeEasy: 'Start with just 5 minutes, keep it simple',
      makeSatisfying: 'Track streak and feel the calmness throughout the day',
      scheduledTime: '06:30',
      status: 'ACTIVE',
      user: { connect: { id: regularUser.id } },
    },
    {
      name: 'Morning Exercise',
      description: '20-minute workout to energize the day',
      identity: 'I am a healthy and active person',
      identityReason: 'Regular exercise makes me feel strong and energized',
      frequency: 'DAILY',
      days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      difficulty: 'INTERMEDIATE',
      minimumMinutes: 15,
      targetMinutes: 30,
      environment: 'GYM',
      location: 'Local gym or home workout space',
      cue: 'After morning meditation',
      triggerType: 'AFTER_HABIT',
      makeObvious: 'Lay out workout clothes the night before',
      makeAttractive: 'Listen to favorite upbeat music playlist',
      makeEasy: 'Pack gym bag the night before, choose nearby gym',
      makeSatisfying: 'Enjoy post-workout smoothie, track progress photos',
      scheduledTime: '07:00',
      status: 'ACTIVE',
      user: { connect: { id: regularUser.id } },
    },
    {
      name: 'Read for 30 Minutes',
      description: 'Read personal development or fiction books',
      identity: 'I am a lifelong learner',
      identityReason: 'Reading expands my knowledge and perspective',
      frequency: 'DAILY',
      difficulty: 'BEGINNER',
      minimumMinutes: 15,
      targetMinutes: 30,
      environment: 'HOME',
      location: 'Comfortable reading chair',
      cue: 'During morning coffee or before bed',
      makeObvious: 'Keep current book on nightstand or coffee table',
      makeAttractive: 'Create cozy reading nook with good lighting',
      makeEasy: 'Start with just one page if needed',
      makeSatisfying: 'Track books completed, discuss insights with friends',
      scheduledTime: '21:00',
      status: 'ACTIVE',
      user: { connect: { id: regularUser.id } },
    },
    // Productivity habits for admin user
    {
      name: 'Daily Planning',
      description: 'Review and plan tasks for the day',
      identity: 'I am an organized and productive person',
      identityReason: 'Planning helps me prioritize and accomplish my goals',
      frequency: 'DAILY',
      difficulty: 'BEGINNER',
      minimumMinutes: 5,
      targetMinutes: 15,
      environment: 'WORK',
      location: 'Office desk',
      cue: 'First thing when sitting at desk',
      makeObvious: 'Keep planner open on desk',
      makeAttractive: 'Use a beautiful planner with favorite pens',
      makeEasy: 'Use simple template, limit to top 3 priorities',
      makeSatisfying: 'Check off completed tasks, review progress weekly',
      scheduledTime: '09:00',
      status: 'ACTIVE',
      user: { connect: { id: adminUser.id } },
    },
    {
      name: 'Deep Work Session',
      description: 'Focused work on most important project',
      identity: 'I am a focused and productive professional',
      identityReason: 'Deep work allows me to create valuable outcomes',
      frequency: 'DAILY',
      days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      difficulty: 'ADVANCED',
      minimumMinutes: 60,
      targetMinutes: 120,
      environment: 'WORK',
      location: 'Quiet office or library',
      cue: 'After daily planning session',
      triggerType: 'AFTER_HABIT',
      makeObvious: 'Block calendar time, put up "Do Not Disturb" sign',
      makeAttractive: 'Work on most exciting/important project first',
      makeEasy: 'Eliminate distractions, turn off notifications',
      makeSatisfying: 'Track focused hours, celebrate weekly progress',
      scheduledTime: '09:30',
      status: 'ACTIVE',
      user: { connect: { id: adminUser.id } },
    },
    // Health habits
    {
      name: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      identity: 'I am a healthy person who takes care of my body',
      identityReason: 'Proper hydration keeps me energized and healthy',
      frequency: 'DAILY',
      difficulty: 'BEGINNER',
      quantity: '8',
      unit: 'glasses',
      environment: 'MOBILE',
      cue: 'Every 2 hours',
      triggerType: 'TIME_BASED',
      makeObvious: 'Keep water bottle visible on desk',
      makeAttractive: 'Use a nice water bottle, add lemon slices',
      makeEasy: 'Fill large bottle in morning, use app reminders',
      makeSatisfying: 'Track glasses consumed, notice energy improvement',
      status: 'ACTIVE',
      user: { connect: { id: regularUser.id } },
    },
    {
      name: 'Evening Walk',
      description: 'Take a 20-minute walk after dinner',
      identity: 'I am an active person who values movement',
      identityReason: 'Evening walks help me digest and unwind',
      frequency: 'DAILY',
      difficulty: 'BEGINNER',
      minimumMinutes: 15,
      targetMinutes: 20,
      environment: 'OUTDOOR',
      location: 'Neighborhood or local park',
      cue: 'After dinner',
      triggerType: 'AFTER_HABIT',
      makeObvious: 'Set reminder on phone, lay out walking shoes',
      makeAttractive: 'Listen to favorite podcast or music',
      makeEasy: 'Start with just around the block',
      makeSatisfying: 'Enjoy fresh air, track steps, feel relaxed',
      scheduledTime: '19:30',
      status: 'ACTIVE',
      user: { connect: { id: adminUser.id } },
    },
    // Paused habit example
    {
      name: 'Learn Spanish',
      description: 'Practice Spanish on Duolingo',
      identity: 'I am a multilingual communicator',
      identityReason:
        'Learning languages opens up new cultures and opportunities',
      frequency: 'DAILY',
      difficulty: 'INTERMEDIATE',
      minimumMinutes: 10,
      targetMinutes: 20,
      environment: 'MOBILE',
      cue: 'During commute or lunch break',
      makeObvious: 'Keep Duolingo app on phone home screen',
      makeAttractive: 'Compete with friends, earn badges',
      makeEasy: 'Start with just 5 minutes daily',
      makeSatisfying: 'Track streak, celebrate milestones',
      status: 'PAUSED',
      user: { connect: { id: regularUser.id } },
    },
  ];

  // Create habits
  for (const habitData of sampleHabits) {
    try {
      await db.habit.create({ data: habitData });
      createdCounter += 1;
    } catch (error) {
      // Skip if habit already exists or other error
      console.log(`⚠️  Skipped creating habit: ${habitData.name}`);
      return error;
    }
  }

  console.log(
    `✅ ${existingCount} existing habits 👉 ${createdCounter} habits created`
  );
  console.log(
    `👉 Created habits for: ${emphasis('user@user.com')} and ${emphasis('admin@admin.com')}`
  );
}
