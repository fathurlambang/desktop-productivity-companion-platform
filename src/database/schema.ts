import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').default(''),
  status: text('status', { enum: ['active', 'completed'] }).default('active').notNull(),
  priority: integer('priority').default(0).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const pomodoroSessions = sqliteTable('pomodoro_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskId: integer('task_id').references(() => tasks.id),
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  duration: integer('duration').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
})

export const meetings = sqliteTable('meetings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').default(''),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  reminderBefore: integer('reminder_before').default(5).notNull(),
  status: text('status', { enum: ['upcoming', 'completed', 'cancelled'] }).default('upcoming').notNull(),
})

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  theme: text('theme').default('system').notNull(),
  language: text('language').default('en').notNull(),
  pomodoroDuration: integer('pomodoro_duration').default(1500).notNull(),
  shortBreak: integer('short_break').default(300).notNull(),
  longBreak: integer('long_break').default(900).notNull(),
  autoBreak: integer('auto_break', { mode: 'boolean' }).default(true).notNull(),
  autoStart: integer('auto_start', { mode: 'boolean' }).default(false).notNull(),
  trayEnabled: integer('tray_enabled', { mode: 'boolean' }).default(true).notNull(),
  companionEnabled: integer('companion_enabled', { mode: 'boolean' }).default(true).notNull(),
})

export const companion = sqliteTable('companion', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  characterName: text('character_name').default('Companion').notNull(),
  imagePath: text('image_path'),
  size: text('size', { enum: ['small', 'medium', 'large'] }).default('medium').notNull(),
  opacity: real('opacity').default(1.0).notNull(),
  positionX: integer('position_x').default(0).notNull(),
  positionY: integer('position_y').default(0).notNull(),
  behavior: text('behavior').default('idle').notNull(),
  clickThrough: integer('click_through', { mode: 'boolean' }).default(false).notNull(),
  lockPosition: integer('lock_position', { mode: 'boolean' }).default(false).notNull(),
})
