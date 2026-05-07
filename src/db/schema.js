import { pgTable, pgEnum, serial, integer, jsonb, text, timestamp } from 'drizzle-orm/pg-core';

export const matchStatusEnum = pgEnum('match_status', ['pending', 'in_progress', 'completed']); 

export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    status: matchStatusEnum('status').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    homeScore: integer('home_score').notNull(),
    awayScore: integer('away_score').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const commentary = pgTable('commentary', {
    id: serial('id').primaryKey(),
    matchId: integer('match_id').notNull().references(() => matches.id),
    minute: integer('minute'),
    sequence: integer('sequence'),
    period: text('period'),
    eventType: text('event_type'),
    actor: text('actor'),
    team: text('team'),
    message: text('message').notNull(),
    metaData: jsonb('meta_data'),
    tags: text('tags').array(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});