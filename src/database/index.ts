import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import * as schema from './schema'

let db: ReturnType<typeof drizzle> | null = null

export function getDbPath(): string {
  const userDataPath = app.getPath('userData')
  const dbDir = join(userDataPath, 'database')
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }
  return join(dbDir, 'focus-companion.db')
}

export function initializeDatabase(): ReturnType<typeof drizzle> {
  if (db) return db

  const dbPath = getDbPath()
  const sqlite = new Database(dbPath)

  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  db = drizzle(sqlite, { schema })

  createTables(sqlite)

  return db
}

function createTables(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'active' NOT NULL,
      priority INTEGER DEFAULT 0 NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER REFERENCES tasks(id),
      start_time TEXT NOT NULL,
      end_time TEXT,
      duration INTEGER NOT NULL,
      completed INTEGER DEFAULT 0 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      reminder_before INTEGER DEFAULT 5 NOT NULL,
      status TEXT DEFAULT 'upcoming' NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      theme TEXT DEFAULT 'system' NOT NULL,
      language TEXT DEFAULT 'en' NOT NULL,
      pomodoro_duration INTEGER DEFAULT 1500 NOT NULL,
      short_break INTEGER DEFAULT 300 NOT NULL,
      long_break INTEGER DEFAULT 900 NOT NULL,
      auto_break INTEGER DEFAULT 1 NOT NULL,
      auto_start INTEGER DEFAULT 0 NOT NULL,
      tray_enabled INTEGER DEFAULT 1 NOT NULL,
      companion_enabled INTEGER DEFAULT 1 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS companion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_name TEXT DEFAULT 'Companion' NOT NULL,
      image_path TEXT,
      size TEXT DEFAULT 'medium' NOT NULL,
      opacity REAL DEFAULT 1.0 NOT NULL,
      position_x INTEGER DEFAULT 0 NOT NULL,
      position_y INTEGER DEFAULT 0 NOT NULL,
      behavior TEXT DEFAULT 'idle' NOT NULL,
      click_through INTEGER DEFAULT 0 NOT NULL,
      lock_position INTEGER DEFAULT 0 NOT NULL
    );
  `)
}

export function getDatabase(): ReturnType<typeof drizzle> {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

export function closeDatabase(): void {
  if (db) {
    const sqlite = (db as any).session.client
    sqlite.close()
    db = null
  }
}
