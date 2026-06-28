import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import { initializeDatabase, closeDatabase } from '../src/database'
import { registerIpcHandlers } from '../src/ipc/handlers'
import { createTray, destroyTray, updateTrayState, updateTrayTimer } from './tray'
import { setMainWindowForNotifications, notifyPomodoroComplete, notifyBreakComplete, notifyTaskComplete } from './notifications'

let mainWindow: BrowserWindow | null = null
const isDev = !app.isPackaged

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    if (mainWindow) {
      setMainWindowForNotifications(mainWindow)
    }
  })

  mainWindow.on('close', (event) => {
    if (!(app as any).isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (isDev) {
    const port = process.env.VITE_DEV_SERVER_PORT || '5173'
    mainWindow.loadURL(`http://localhost:${port}`)
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }
}

function registerNotificationHandlers(): void {
  ipcMain.handle('notify:pomodoro-complete', (_event, sessionCount) => {
    notifyPomodoroComplete(sessionCount)
    updateTrayState('break')
  })

  ipcMain.handle('notify:break-complete', () => {
    notifyBreakComplete()
    updateTrayState('idle')
  })

  ipcMain.handle('notify:task-complete', (_event, taskTitle) => {
    notifyTaskComplete(taskTitle)
  })

  ipcMain.on('tray:update-timer', (_event, remaining: number) => {
    updateTrayTimer(remaining)
  })

  ipcMain.on('tray:update-state', (_event, state: any) => {
    updateTrayState(state)
  })
}

app.whenReady().then(() => {
  initializeDatabase()
  registerIpcHandlers()
  registerNotificationHandlers()
  createWindow()

  if (mainWindow) {
    createTray(mainWindow)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      mainWindow?.show()
    }
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  destroyTray()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  ;(app as any).isQuitting = true
})

export { mainWindow }
