export type ElectronAPI = {
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]) => void
    on: (channel: string, func: (...args: unknown[]) => void) => () => void
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  }
}

export type IPCChannels = {
  // Tasks
  'tasks:getAll': (status?: string) => unknown[]
  'tasks:getById': (id: number) => unknown
  'tasks:create': (input: { title: string; description?: string; priority?: number }) => unknown
  'tasks:update': (id: number, input: Record<string, unknown>) => unknown
  'tasks:delete': (id: number) => void
  'tasks:complete': (id: number) => unknown

  // Pomodoro
  'pomodoro:getAll': () => unknown[]
  'pomodoro:getById': (id: number) => unknown
  'pomodoro:getByTaskId': (taskId: number) => unknown[]
  'pomodoro:create': (input: { taskId?: number; startTime: string; duration: number }) => unknown
  'pomodoro:complete': (id: number, endTime: string) => unknown
  'pomodoro:getTodaySessions': () => unknown[]

  // Meetings
  'meetings:getAll': () => unknown[]
  'meetings:getById': (id: number) => unknown
  'meetings:getUpcoming': () => unknown[]
  'meetings:create': (input: Record<string, unknown>) => unknown
  'meetings:update': (id: number, input: Record<string, unknown>) => unknown
  'meetings:delete': (id: number) => void
  'meetings:complete': (id: number) => unknown

  // Settings
  'settings:get': () => unknown
  'settings:update': (input: Record<string, unknown>) => unknown

  // Companion
  'companion:get': () => unknown
  'companion:update': (input: Record<string, unknown>) => unknown
  'companion:updatePosition': (x: number, y: number) => unknown
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
