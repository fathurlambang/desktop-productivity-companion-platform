const api = window.electronAPI

export const ipc = {
  tasks: {
    getAll: (status?: string) => api.ipcRenderer.invoke('tasks:getAll', status),
    getById: (id: number) => api.ipcRenderer.invoke('tasks:getById', id),
    create: (input: { title: string; description?: string; priority?: number }) =>
      api.ipcRenderer.invoke('tasks:create', input),
    update: (id: number, input: Record<string, unknown>) =>
      api.ipcRenderer.invoke('tasks:update', id, input),
    delete: (id: number) => api.ipcRenderer.invoke('tasks:delete', id),
    complete: (id: number) => api.ipcRenderer.invoke('tasks:complete', id),
  },

  pomodoro: {
    getAll: () => api.ipcRenderer.invoke('pomodoro:getAll'),
    getById: (id: number) => api.ipcRenderer.invoke('pomodoro:getById', id),
    getByTaskId: (taskId: number) => api.ipcRenderer.invoke('pomodoro:getByTaskId', taskId),
    create: (input: { taskId?: number; startTime: string; duration: number }) =>
      api.ipcRenderer.invoke('pomodoro:create', input),
    complete: (id: number, endTime: string) =>
      api.ipcRenderer.invoke('pomodoro:complete', id, endTime),
    getTodaySessions: () => api.ipcRenderer.invoke('pomodoro:getTodaySessions'),
  },

  meetings: {
    getAll: () => api.ipcRenderer.invoke('meetings:getAll'),
    getById: (id: number) => api.ipcRenderer.invoke('meetings:getById', id),
    getUpcoming: () => api.ipcRenderer.invoke('meetings:getUpcoming'),
    create: (input: Record<string, unknown>) => api.ipcRenderer.invoke('meetings:create', input),
    update: (id: number, input: Record<string, unknown>) =>
      api.ipcRenderer.invoke('meetings:update', id, input),
    delete: (id: number) => api.ipcRenderer.invoke('meetings:delete', id),
    complete: (id: number) => api.ipcRenderer.invoke('meetings:complete', id),
  },

  settings: {
    get: () => api.ipcRenderer.invoke('settings:get'),
    update: (input: Record<string, unknown>) => api.ipcRenderer.invoke('settings:update', input),
  },

  companion: {
    get: () => api.ipcRenderer.invoke('companion:get'),
    update: (input: Record<string, unknown>) => api.ipcRenderer.invoke('companion:update', input),
    updatePosition: (x: number, y: number) =>
      api.ipcRenderer.invoke('companion:updatePosition', x, y),
  },

  notifications: {
    pomodoroComplete: (sessionCount: number) =>
      api.ipcRenderer.invoke('notify:pomodoro-complete', sessionCount),
    breakComplete: () => api.ipcRenderer.invoke('notify:break-complete'),
    taskComplete: (taskTitle: string) =>
      api.ipcRenderer.invoke('notify:task-complete', taskTitle),
  },

  tray: {
    updateTimer: (remaining: number) =>
      api.ipcRenderer.send('tray:update-timer', remaining),
    updateState: (state: string) =>
      api.ipcRenderer.send('tray:update-state', state),
  },

  timer: {
    start: (duration: number, sessionCount: number) =>
      api.ipcRenderer.send('timer:start', duration, sessionCount),
    startBreak: (duration: number, isLongBreak: boolean) =>
      api.ipcRenderer.send('timer:start-break', duration, isLongBreak),
    pause: () => api.ipcRenderer.send('timer:pause'),
    resume: () => api.ipcRenderer.send('timer:resume'),
    stop: () => api.ipcRenderer.send('timer:stop'),
    getState: () => api.ipcRenderer.invoke('timer:get-state'),
    onTick: (callback: (data: { remaining: number; state: string }) => void) =>
      api.ipcRenderer.on('timer:tick', callback as any),
    onState: (callback: (data: { state: string; type: string; remaining: number; total: number; sessionCount: number }) => void) =>
      api.ipcRenderer.on('timer:state', callback as any),
    onNotification: (callback: (data: { type: string; sessionCount?: number }) => void) =>
      api.ipcRenderer.on('timer:notification', callback as any),
  },
}
