-- Migration: Book to Habit Models
-- Description: Create Habit and HabitEntry tables with indexes
-- Created: 2026-01-26

-- Create frequency enum
DO $$ BEGIN
    CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create difficulty enum
DO $$ BEGIN
    CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create HabitStatus enum
DO $$ BEGIN
    CREATE TYPE "HabitStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create TriggerType enum
DO $$ BEGIN
    CREATE TYPE "TriggerType" AS ENUM ('AFTER_HABIT', 'BEFORE_HABIT', 'TIME_BASED', 'LOCATION_BASED', 'EVENT_BASED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Environment enum
DO $$ BEGIN
    CREATE TYPE "Environment" AS ENUM ('HOME', 'WORK', 'GYM', 'OUTDOOR', 'MOBILE', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Mood enum
DO $$ BEGIN
    CREATE TYPE "Mood" AS ENUM ('GREAT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create DayOfWeek enum
DO $$ BEGIN
    CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Habit table
CREATE TABLE IF NOT EXISTS "habit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    -- Identity-Based Habits
    "identity" TEXT NOT NULL,
    "identityReason" TEXT,

    -- Habit Stacking
    "triggerType" "TriggerType",
    "triggerHabitId" TEXT,

    -- Environment Design
    "environment" "Environment",
    "location" TEXT,
    "cue" TEXT,

    -- The 4 Laws of Behavior Change
    "makeObvious" TEXT,
    "makeAttractive" TEXT,
    "makeEasy" TEXT,
    "makeSatisfying" TEXT,

    -- Configuration
    "frequency" "Frequency" NOT NULL DEFAULT 'DAILY',
    "days" "DayOfWeek"[],
    "scheduledTime" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "minimumMinutes" INTEGER,
    "targetMinutes" INTEGER,
    "quantity" TEXT,
    "unit" TEXT,

    -- Status & Metadata
    "status" "HabitStatus" NOT NULL DEFAULT 'ACTIVE',
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Relations
    "userId" TEXT NOT NULL,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "habit_triggerHabitId_fkey" FOREIGN KEY ("triggerHabitId") REFERENCES "habit"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for Habit
CREATE INDEX IF NOT EXISTS "habit_userId_status_idx" ON "habit"("userId", "status");
CREATE INDEX IF NOT EXISTS "habit_triggerHabitId_idx" ON "habit"("triggerHabitId");

-- Create HabitEntry table
CREATE TABLE IF NOT EXISTS "habit_entry" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,

    -- Completion
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    -- Actual quantity
    "actualQuantity" DECIMAL(65,30),
    "actualUnit" TEXT,

    -- Notes
    "notes" TEXT,
    "mood" "Mood",

    -- Context
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "skipReason" TEXT,

    -- Metadata
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- User relation
    "userId" TEXT NOT NULL,

    CONSTRAINT "habit_entry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "habit_entry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "habit_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "habit_entry_habitId_date_key" UNIQUE ("habitId", "date")
);

-- Create indexes for HabitEntry
CREATE INDEX IF NOT EXISTS "habit_entry_habitId_date_idx" ON "habit_entry"("habitId", "date");
CREATE INDEX IF NOT EXISTS "habit_entry_userId_date_idx" ON "habit_entry"("userId", "date");
