import { eq } from 'drizzle-orm'
import { getDatabase } from '../database'
import { pomodoroSessions } from '../database/schema'

export type CreateSessionInput = {
  taskId?: number
  startTime: string
  duration: number
}

export const pomodoroRepository = {
  getAll() {
    const db = getDatabase()
    return db.select().from(pomodoroSessions).all()
  },

  getById(id: number) {
    const db = getDatabase()
    return db.select().from(pomodoroSessions).where(eq(pomodoroSessions.id, id)).get()
  },

  getByTaskId(taskId: number) {
    const db = getDatabase()
    return db.select().from(pomodoroSessions).where(eq(pomodoroSessions.taskId, taskId)).all()
  },

  create(input: CreateSessionInput) {
    const db = getDatabase()
    return db.insert(pomodoroSessions).values({
      taskId: input.taskId,
      startTime: input.startTime,
      duration: input.duration,
    } as any).returning().get()
  },

  complete(id: number, endTime: string) {
    const db = getDatabase()
    return db.update(pomodoroSessions)
      .set({ endTime, completed: true } as any)
      .where(eq(pomodoroSessions.id, id))
      .returning()
      .get()
  },

  getTodaySessions() {
    const db = getDatabase()
    const today = new Date().toISOString().split('T')[0] ?? ''
    return db.select().from(pomodoroSessions).all().filter((s) => s.startTime.startsWith(today))
  },
}
