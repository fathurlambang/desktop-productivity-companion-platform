import { useEffect, useRef } from 'react'
import { usePomodoroStore } from './store'
import { ipc } from '@/ipc/bridge'

export function usePomodoroTimer() {
  const { state, remaining, tick } = usePomodoroStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state, tick])

  useEffect(() => {
    ipc.tray.updateState(state)
  }, [state])

  useEffect(() => {
    if (state === 'running' || state === 'paused') {
      ipc.tray.updateTimer(remaining)
    }
  }, [state, remaining])

  return usePomodoroStore()
}
