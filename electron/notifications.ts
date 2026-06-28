import { Notification, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null

export function setMainWindowForNotifications(window: BrowserWindow): void {
  mainWindow = window
}

export function showNotification(options: {
  title: string
  body: string
  onClick?: () => void
}): void {
  const notification = new Notification({
    title: options.title,
    body: options.body,
    silent: false,
  })

  notification.on('click', () => {
    mainWindow?.show()
    options.onClick?.()
  })

  notification.show()
}

export function notifyPomodoroComplete(sessionCount: number): void {
  showNotification({
    title: 'Pomodoro Complete!',
    body: `Session ${sessionCount} finished. Time for a break!`,
  })
}

export function notifyBreakComplete(): void {
  showNotification({
    title: 'Break Over!',
    body: 'Ready to focus again?',
  })
}

export function notifyTaskComplete(taskTitle: string): void {
  showNotification({
    title: 'Task Completed!',
    body: `"${taskTitle}" marked as done.`,
  })
}
