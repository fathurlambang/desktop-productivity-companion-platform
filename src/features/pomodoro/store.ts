import { create } from 'zustand'
import type { TimerState, TimerType, TimerConfig } from './types'
import { DEFAULT_CONFIG, getTimerDuration } from './types'

type PomodoroStore = {
  state: TimerState
  type: TimerType
  remaining: number
  total: number
  sessionCount: number
  config: TimerConfig
  activeTaskId: number | null
  currentSessionId: number | null

  start: (taskId?: number) => void
  startBreak: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  skipBreak: () => void
  tick: () => void
  setConfig: (config: Partial<TimerConfig>) => void
  reset: () => void
}

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  state: 'idle',
  type: 'focus',
  remaining: DEFAULT_CONFIG.focusDuration,
  total: DEFAULT_CONFIG.focusDuration,
  sessionCount: 0,
  config: DEFAULT_CONFIG,
  activeTaskId: null,
  currentSessionId: null,

  start: (taskId) => {
    const { config } = get()
    set({
      state: 'running',
      type: 'focus',
      remaining: config.focusDuration,
      total: config.focusDuration,
      activeTaskId: taskId ?? null,
    })
  },

  startBreak: () => {
    set({ state: 'running' })
  },

  pause: () => {
    set({ state: 'paused' })
  },

  resume: () => {
    set({ state: 'running' })
  },

  stop: () => {
    set({
      state: 'idle',
      remaining: get().total,
      currentSessionId: null,
    })
  },

  skipBreak: () => {
    const { config } = get()
    set({
      state: 'running',
      type: 'focus',
      remaining: config.focusDuration,
      total: config.focusDuration,
    })
  },

  tick: () => {
    const { remaining, state, type, sessionCount, config } = get()
    if (state !== 'running') return

    if (remaining <= 0) {
      if (type === 'focus') {
        const newCount = sessionCount + 1
        const isLongBreak = newCount % 4 === 0
        const breakType = isLongBreak ? 'long_break' : 'short_break'
        const breakDuration = getTimerDuration(breakType, config)

        set({
          state: config.autoBreak ? 'break' : 'idle',
          type: breakType,
          remaining: breakDuration,
          total: breakDuration,
          sessionCount: newCount,
        })
      } else {
        set({
          state: config.autoStart ? 'running' : 'idle',
          type: 'focus',
          remaining: config.focusDuration,
          total: config.focusDuration,
        })
      }
      return
    }

    set({ remaining: remaining - 1 })
  },

  setConfig: (newConfig) => {
    set({ config: { ...get().config, ...newConfig } })
  },

  reset: () => {
    const { config } = get()
    set({
      state: 'idle',
      type: 'focus',
      remaining: config.focusDuration,
      total: config.focusDuration,
      sessionCount: 0,
      currentSessionId: null,
    })
  },
}))
