import { eq } from 'drizzle-orm'
import { getDatabase } from '../database'
import { meetings } from '../database/schema'

export type CreateMeetingInput = {
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  reminderBefore?: number
}

export type UpdateMeetingInput = {
  title?: string
  description?: string
  date?: string
  startTime?: string
  endTime?: string
  reminderBefore?: number
  status?: 'upcoming' | 'completed' | 'cancelled'
}

export const meetingRepository = {
  getAll() {
    const db = getDatabase()
    return db.select().from(meetings).all()
  },

  getById(id: number) {
    const db = getDatabase()
    return db.select().from(meetings).where(eq(meetings.id, id)).get()
  },

  getUpcoming() {
    const db = getDatabase()
    return db.select().from(meetings).all().filter((m) => m.status === 'upcoming')
  },

  create(input: CreateMeetingInput) {
    const db = getDatabase()
    return db.insert(meetings).values({
      title: input.title,
      description: input.description ?? '',
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      reminderBefore: input.reminderBefore ?? 5,
    }).returning().get()
  },

  update(id: number, input: UpdateMeetingInput) {
    const db = getDatabase()
    return db.update(meetings)
      .set(input)
      .where(eq(meetings.id, id))
      .returning()
      .get()
  },

  delete(id: number) {
    const db = getDatabase()
    return db.delete(meetings).where(eq(meetings.id, id)).run()
  },

  complete(id: number) {
    const db = getDatabase()
    return db.update(meetings)
      .set({ status: 'completed' })
      .where(eq(meetings.id, id))
      .returning()
      .get()
  },
}
