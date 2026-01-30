import { db } from '@/server/db';

import { createHabits } from './habit';
import { createUsers } from './user';

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed users first
    await createUsers();

    // Seed habits (requires users to exist)
    await createHabits();

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
