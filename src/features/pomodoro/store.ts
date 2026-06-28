import { create } from 'zustand'
import type { TimerState, TimerType, TimerConfig } from './types'
import { DEFAULT_CONFIG, getTimerDuration } from './types'
import { ipc } from '@/ipc/bridge'

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
  setConfig: (config: Partial<TimerConfig>) => void
  reset: () => void

  syncFromMain: (data: { state: TimerState; type: TimerType; remaining: number; total: number; sessionCount: number }) => void
  updateRemaining: (remaining: number) => void
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
    const { config, sessionCount } = get()
    set({
      state: 'running',
      type: 'focus',
      remaining: config.focusDuration,
      total: config.focusDuration,
      activeTaskId: taskId ?? null,
    })
    ipc.timer.start(config.focusDuration, sessionCount)
  },

  startBreak: () => {
    const { sessionCount, config } = get()
    const isLongBreak = sessionCount % 4 === 0
    const breakType = isLongBreak ? 'long_break' : 'short_break'
    const breakDuration = getTimerDuration(breakType, config)

    set({
      state: 'running',
      type: breakType,
      remaining: breakDuration,
      total: breakDuration,
    })
    ipc.timer.startBreak(breakDuration, isLongBreak)
  },

  pause: () => {
    set({ state: 'paused' })
    ipc.timer.pause()
  },

  resume: () => {
    set({ state: 'running' })
    ipc.timer.resume()
  },

  stop: () => {
    set({
      state: 'idle',
      remaining: get().total,
      currentSessionId: null,
    })
    ipc.timer.stop()
  },

  skipBreak: () => {
    const { config } = get()
    set({
      state: 'running',
      type: 'focus',
      remaining: config.focusDuration,
      total: config.focusDuration,
    })
    ipc.timer.start(config.focusDuration, get().sessionCount)
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
    ipc.timer.stop()
  },

  syncFromMain: (data) => {
    set({
      state: data.state,
      type: data.type as TimerType,
      remaining: data.remaining,
      total: data.total,
      sessionCount: data.sessionCount,
    })
  },

  updateRemaining: (remaining) => {
    set({ remaining })
  },
}))
