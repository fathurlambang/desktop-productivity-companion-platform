import { getDatabase } from '../database'
import { companion } from '../database/schema'

export type UpdateCompanionInput = {
  characterName?: string
  imagePath?: string
  size?: 'small' | 'medium' | 'large'
  opacity?: number
  positionX?: number
  positionY?: number
  behavior?: string
  clickThrough?: boolean
  lockPosition?: boolean
}

export const companionRepository = {
  get() {
    const db = getDatabase()
    const result = db.select().from(companion).get()
    if (!result) {
      return db.insert(companion).values({}).returning().get()
    }
    return result
  },

  update(input: UpdateCompanionInput) {
    const db = getDatabase()
    const existing = db.select().from(companion).get()
    if (!existing) {
      return db.insert(companion).values(input).returning().get()
    }
    return db.update(companion)
      .set(input)
      .returning()
      .get()
  },

  updatePosition(x: number, y: number) {
    const db = getDatabase()
    const existing = db.select().from(companion).get()
    if (!existing) {
      return db.insert(companion).values({ positionX: x, positionY: y }).returning().get()
    }
    return db.update(companion)
      .set({ positionX: x, positionY: y })
      .returning()
      .get()
  },
}
