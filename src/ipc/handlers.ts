import { ipcMain } from 'electron'
import { taskRepository } from '../repositories/task.repository'
import { pomodoroRepository } from '../repositories/pomodoro.repository'
import { meetingRepository } from '../repositories/meeting.repository'
import { settingsRepository } from '../repositories/settings.repository'
import { companionRepository } from '../repositories/companion.repository'

export function registerIpcHandlers(): void {
  // Tasks
  ipcMain.handle('tasks:getAll', (_event, status?) => taskRepository.getAll(status))
  ipcMain.handle('tasks:getById', (_event, id) => taskRepository.getById(id))
  ipcMain.handle('tasks:create', (_event, input) => taskRepository.create(input))
  ipcMain.handle('tasks:update', (_event, id, input) => taskRepository.update(id, input))
  ipcMain.handle('tasks:delete', (_event, id) => taskRepository.delete(id))
  ipcMain.handle('tasks:complete', (_event, id) => taskRepository.complete(id))

  // Pomodoro Sessions
  ipcMain.handle('pomodoro:getAll', () => pomodoroRepository.getAll())
  ipcMain.handle('pomodoro:getById', (_event, id) => pomodoroRepository.getById(id))
  ipcMain.handle('pomodoro:getByTaskId', (_event, taskId) => pomodoroRepository.getByTaskId(taskId))
  ipcMain.handle('pomodoro:create', (_event, input) => pomodoroRepository.create(input))
  ipcMain.handle('pomodoro:complete', (_event, id, endTime) => pomodoroRepository.complete(id, endTime))
  ipcMain.handle('pomodoro:getTodaySessions', () => pomodoroRepository.getTodaySessions())

  // Meetings
  ipcMain.handle('meetings:getAll', () => meetingRepository.getAll())
  ipcMain.handle('meetings:getById', (_event, id) => meetingRepository.getById(id))
  ipcMain.handle('meetings:getUpcoming', () => meetingRepository.getUpcoming())
  ipcMain.handle('meetings:create', (_event, input) => meetingRepository.create(input))
  ipcMain.handle('meetings:update', (_event, id, input) => meetingRepository.update(id, input))
  ipcMain.handle('meetings:delete', (_event, id) => meetingRepository.delete(id))
  ipcMain.handle('meetings:complete', (_event, id) => meetingRepository.complete(id))

  // Settings
  ipcMain.handle('settings:get', () => settingsRepository.get())
  ipcMain.handle('settings:update', (_event, input) => settingsRepository.update(input))

  // Companion
  ipcMain.handle('companion:get', () => companionRepository.get())
  ipcMain.handle('companion:update', (_event, input) => companionRepository.update(input))
  ipcMain.handle('companion:updatePosition', (_event, x, y) => companionRepository.updatePosition(x, y))
}
