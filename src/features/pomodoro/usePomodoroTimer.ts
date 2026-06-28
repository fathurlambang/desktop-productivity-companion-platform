import { useEffect } from 'react'
import { usePomodoroStore } from './store'
import { ipc } from '@/ipc/bridge'

export function usePomodoroTimer() {
  const { syncFromMain, updateRemaining } = usePomodoroStore()

  useEffect(() => {
    const unsubTick = ipc.timer.onTick((data) => {
      updateRemaining(data.remaining)
      ipc.tray.updateTimer(data.remaining)
    })

    const unsubState = ipc.timer.onState((data) => {
      syncFromMain(data as any)
      ipc.tray.updateState(data.state)
    })

    const unsubNotification = ipc.timer.onNotification((data) => {
      if (data.type === 'pomodoro-complete') {
        ipc.notifications.pomodoroComplete(data.sessionCount ?? 0)
      } else if (data.type === 'break-complete') {
        ipc.notifications.breakComplete()
      }
    })

    return () => {
      unsubTick()
      unsubState()
      unsubNotification()
    }
  }, [syncFromMain, updateRemaining])

  return usePomodoroStore()
}
