import { getDatabase } from '../database'
import { settings } from '../database/schema'

export type UpdateSettingsInput = {
  theme?: string
  language?: string
  pomodoroDuration?: number
  shortBreak?: number
  longBreak?: number
  autoBreak?: boolean
  autoStart?: boolean
  trayEnabled?: boolean
  companionEnabled?: boolean
}

export const settingsRepository = {
  get() {
    const db = getDatabase()
    const result = db.select().from(settings).get()
    if (!result) {
      return db.insert(settings).values({}).returning().get()
    }
    return result
  },

  update(input: UpdateSettingsInput) {
    const db = getDatabase()
    const existing = db.select().from(settings).get()
    if (!existing) {
      return db.insert(settings).values(input).returning().get()
    }
    return db.update(settings)
      .set(input)
      .returning()
      .get()
  },
}
