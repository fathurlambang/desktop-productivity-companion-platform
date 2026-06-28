export type TimerState = 'idle' | 'running' | 'paused' | 'break'

export type TimerType = 'focus' | 'short_break' | 'long_break'

export type TimerConfig = {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  autoBreak: boolean
  autoStart: boolean
}

export const DEFAULT_CONFIG: TimerConfig = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoBreak: true,
  autoStart: false,
}

export function getTimerDuration(type: TimerType, config: TimerConfig): number {
  switch (type) {
    case 'focus':
      return config.focusDuration
    case 'short_break':
      return config.shortBreakDuration
    case 'long_break':
      return config.longBreakDuration
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getProgressPercent(remaining: number, total: number): number {
  if (total === 0) return 0
  return ((total - remaining) / total) * 100
}
