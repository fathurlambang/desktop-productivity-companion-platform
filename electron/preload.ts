import { contextBridge, ipcRenderer } from 'electron'

export type ElectronAPI = {
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]) => void
    on: (channel: string, func: (...args: unknown[]) => void) => () => void
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  }
}

const electronAPI: ElectronAPI = {
  ipcRenderer: {
    send(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args)
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
        func(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    invoke(channel: string, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args)
    },
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
