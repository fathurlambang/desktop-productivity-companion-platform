import { Tray, Menu, nativeImage, BrowserWindow, app } from 'electron'
import { join } from 'path'
import { taskRepository } from '../src/repositories/task.repository'

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null
let currentTaskId: number | null = null

type TimerState = 'idle' | 'running' | 'paused' | 'break'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function getMinimalIcon(): Electron.NativeImage {
  const iconPath = join(__dirname, '../build/tray-minimal.png')

  try {
    const image = nativeImage.createFromPath(iconPath)
    if (image.isEmpty()) {
      return nativeImage.createEmpty()
    }
    image.setTemplateImage(true)
    return image
  } catch {
    return nativeImage.createEmpty()
  }
}

function getTaskList(): Electron.MenuItemConstructorOptions[] {
  try {
    const tasks = taskRepository.getAll('active')
    if (tasks.length === 0) {
      return [{ label: 'No tasks', enabled: false }]
    }

    return tasks.map((task) => ({
      label: task.title,
      type: 'radio' as const,
      checked: task.id === currentTaskId,
      click: () => {
        currentTaskId = task.id
        mainWindow?.webContents.send('tray:select-task', task.id)
        rebuildMenu()
      },
    }))
  } catch {
    return [{ label: 'Failed to load tasks', enabled: false }]
  }
}

let currentTimerState: TimerState = 'idle'
let currentRemaining: number = 0
let currentTaskName: string | null = null

function updateDisplay(): void {
  if (!tray) return

  const timeStr = formatTime(currentRemaining)
  const stateLabel = currentTimerState === 'running' ? timeStr :
    currentTimerState === 'paused' ? `${timeStr} ⏸` :
    currentTimerState === 'break' ? `${timeStr} ☕` : 'FC'

  const taskStr = currentTaskName ? ` - ${currentTaskName}` : ''
  tray.setToolTip(`Focus Companion${taskStr}\n${stateLabel}`)

  if (process.platform === 'darwin') {
    tray.setTitle(` ${stateLabel}`)
  }
}

function rebuildMenu(): void {
  if (!tray) return
  tray.setContextMenu(buildContextMenu(currentTimerState, currentTaskName))
}

function buildContextMenu(timerState: TimerState, _currentTask: string | null): Electron.Menu {
  currentTimerState = timerState

  const timerLabel = timerState === 'idle' ? 'Start Timer' :
    timerState === 'running' ? 'Pause Timer' :
    timerState === 'paused' ? 'Resume Timer' : 'Timer Running'

  return Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainWindow?.show(),
    },
    { type: 'separator' },
    {
      label: timerState === 'idle' ? timerLabel : `${timerLabel} (${formatTime(currentRemaining)})`,
      click: () => {
        mainWindow?.webContents.send('tray:timer-action', timerState)
      },
    },
    {
      label: 'Select Task',
      submenu: getTaskList(),
    },
    {
      label: `Current: ${currentTaskName ?? 'None'}`,
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        mainWindow?.show()
        mainWindow?.webContents.send('tray:open-settings')
      },
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.quit()
      },
    },
  ])
}

export function createTray(window: BrowserWindow): Tray {
  mainWindow = window
  tray = new Tray(getMinimalIcon())

  updateDisplay()
  tray.setContextMenu(buildContextMenu('idle', null))

  tray.on('double-click', () => {
    mainWindow?.show()
  })

  return tray
}

export function updateTrayState(state: TimerState, _currentTask?: string): void {
  if (!tray) return

  currentTimerState = state
  updateDisplay()
  rebuildMenu()
}

export function updateTrayTimer(remaining: number): void {
  if (!tray) return

  currentRemaining = remaining
  updateDisplay()
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
