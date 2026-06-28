export type Priority = 'low' | 'medium' | 'high'

export type TaskStatus = 'active' | 'completed'

export type TimerState = 'idle' | 'running' | 'paused' | 'break'

export type TimerType = 'focus' | 'short_break' | 'long_break'

export type CompanionState =
  | 'idle'
  | 'focus'
  | 'walking'
  | 'sleeping'
  | 'happy'
  | 'celebrating'
  | 'meeting_alert'
  | 'hidden'
