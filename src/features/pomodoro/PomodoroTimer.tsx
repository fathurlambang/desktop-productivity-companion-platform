import { useEffect } from 'react'
import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-react'
import { usePomodoroTimer } from './usePomodoroTimer'
import { formatTime, getProgressPercent } from './types'
import { Button } from '@/components/Button'
import { useTaskStore } from '@/features/tasks/store'

export function PomodoroTimer() {
  const {
    state,
    type,
    remaining,
    total,
    sessionCount,
    start,
    startBreak,
    pause,
    resume,
    stop,
    skipBreak,
    reset,
  } = usePomodoroTimer()

  const { tasks, activeTaskId, setActiveTask } = useTaskStore()
  const activeTask = tasks.find((t) => t.id === activeTaskId)

  useEffect(() => {
    const api = (window as any).electronAPI
    if (!api?.ipcRenderer?.on) return

    const unsubTimer = api.ipcRenderer.on('tray:timer-action', (timerState: string) => {
      if (timerState === 'idle' || timerState === 'paused') {
        if (state === 'idle') start(activeTaskId ?? undefined)
        else if (state === 'paused') resume()
      } else if (timerState === 'running') {
        if (state === 'running') pause()
      }
    })

    const unsubTask = api.ipcRenderer.on('tray:select-task', (taskId: number) => {
      setActiveTask(taskId)
    })

    return () => {
      unsubTimer()
      unsubTask()
    }
  }, [state, activeTaskId, start, pause, resume, setActiveTask])

  const progress = getProgressPercent(remaining, total)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const typeLabel = type === 'focus' ? 'Focus' : type === 'short_break' ? 'Short Break' : 'Long Break'
  const isActive = state === 'running' || state === 'paused'

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-ink/60 font-medium tracking-wide">
        Session {sessionCount + 1} · {typeLabel}
      </div>

      {activeTask && (
        <div className="text-xs text-ink/60 bg-gold/10 px-3 py-1 rounded-full">
          {activeTask.title}
        </div>
      )}

      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={type === 'focus' ? 'var(--primary)' : 'var(--secondary)'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-slow"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold tabular-nums tracking-tight text-ink">
            {formatTime(remaining)}
          </span>
          {state === 'paused' && (
            <span className="text-xs text-ink/60 mt-1">Paused</span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {state === 'idle' || state === 'paused' ? (
          <Button variant="gold" onClick={() => state === 'idle' ? start(activeTaskId ?? undefined) : resume()}>
            <Play className="w-4 h-4 mr-2" />
            {state === 'idle' ? 'Start' : 'Resume'}
          </Button>
        ) : state === 'running' ? (
          <Button variant="secondary" onClick={pause}>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        ) : null}

        {state === 'break' && (
          <>
            <Button variant="gold" onClick={startBreak}>
              <Play className="w-4 h-4 mr-2" />
              Start Break
            </Button>
            <Button variant="secondary" onClick={skipBreak}>
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </>
        )}

        {isActive && (
          <Button variant="destructive" onClick={stop}>
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}

        {state !== 'idle' && (
          <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < sessionCount % 4
                ? 'bg-gold'
                : 'bg-ink/20'
            }`}
          />
        ))}
        <span className="text-xs text-ink/60 ml-2">
          {sessionCount} completed
        </span>
      </div>
    </div>
  )
}
