import { eq } from 'drizzle-orm'
import { getDatabase } from '../database'
import { tasks } from '../database/schema'
import type { TaskStatus } from '../types'

export type CreateTaskInput = {
  title: string
  description?: string
  priority?: number
}

export type UpdateTaskInput = {
  title?: string
  description?: string
  priority?: number
  status?: TaskStatus
}

export const taskRepository = {
  getAll(status?: TaskStatus) {
    const db = getDatabase()
    if (status) {
      return db.select().from(tasks).where(eq(tasks.status, status)).all()
    }
    return db.select().from(tasks).all()
  },

  getById(id: number) {
    const db = getDatabase()
    return db.select().from(tasks).where(eq(tasks.id, id)).get()
  },

  create(input: CreateTaskInput) {
    const db = getDatabase()
    return db.insert(tasks).values({
      title: input.title,
      description: input.description ?? '',
      priority: input.priority ?? 0,
    }).returning().get()
  },

  update(id: number, input: UpdateTaskInput) {
    const db = getDatabase()
    return db.update(tasks)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(eq(tasks.id, id))
      .returning()
      .get()
  },

  delete(id: number) {
    const db = getDatabase()
    return db.delete(tasks).where(eq(tasks.id, id)).run()
  },

  complete(id: number) {
    const db = getDatabase()
    return db.update(tasks)
      .set({ status: 'completed', updatedAt: new Date().toISOString() })
      .where(eq(tasks.id, id))
      .returning()
      .get()
  },
}
