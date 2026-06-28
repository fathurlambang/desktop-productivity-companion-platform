import { BrowserWindow } from 'electron'

type TimerState = 'idle' | 'running' | 'paused' | 'break'
type TimerType = 'focus' | 'short_break' | 'long_break'

class TimerService {
  private interval: ReturnType<typeof setInterval> | null = null
  private remaining: number = 0
  private total: number = 0
  private state: TimerState = 'idle'
  private type: TimerType = 'focus'
  private sessionCount: number = 0
  private window: BrowserWindow | null = null

  setWindow(window: BrowserWindow): void {
    this.window = window
  }

  start(duration: number, sessionCount: number): void {
    this.stop()
    this.remaining = duration
    this.total = duration
    this.state = 'running'
    this.type = 'focus'
    this.sessionCount = sessionCount
    this.startInterval()
    this.sendState()
  }

  startBreak(duration: number, isLongBreak: boolean): void {
    this.stop()
    this.remaining = duration
    this.total = duration
    this.state = 'break'
    this.type = isLongBreak ? 'long_break' : 'short_break'
    this.startInterval()
    this.sendState()
  }

  pause(): void {
    this.state = 'paused'
    this.stopInterval()
    this.sendState()
  }

  resume(): void {
    this.state = 'running'
    this.startInterval()
    this.sendState()
  }

  stop(): void {
    this.stopInterval()
    this.state = 'idle'
    this.remaining = 0
    this.sendState()
  }

  getState(): { state: TimerState; type: TimerType; remaining: number; total: number; sessionCount: number } {
    return {
      state: this.state,
      type: this.type,
      remaining: this.remaining,
      total: this.total,
      sessionCount: this.sessionCount,
    }
  }

  private startInterval(): void {
    this.stopInterval()
    this.interval = setInterval(() => {
      if (this.remaining <= 0) {
        this.onTimerComplete()
        return
      }
      this.remaining--
      this.sendTick()
    }, 1000)
  }

  private stopInterval(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  private onTimerComplete(): void {
    this.stopInterval()

    if (this.state === 'running') {
      this.sessionCount++
      const isLongBreak = this.sessionCount % 4 === 0
      this.state = 'break'
      this.type = isLongBreak ? 'long_break' : 'short_break'
      this.sendState()
      this.sendNotification('pomodoro-complete', this.sessionCount)
    } else if (this.state === 'break') {
      this.state = 'idle'
      this.type = 'focus'
      this.sendState()
      this.sendNotification('break-complete')
    }
  }

  private sendTick(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('timer:tick', {
        remaining: this.remaining,
        state: this.state,
      })
    }
  }

  private sendState(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('timer:state', {
        state: this.state,
        type: this.type,
        remaining: this.remaining,
        total: this.total,
        sessionCount: this.sessionCount,
      })
    }
  }

  private sendNotification(type: string, sessionCount?: number): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('timer:notification', { type, sessionCount })
    }
  }
}

export const timerService = new TimerService()
