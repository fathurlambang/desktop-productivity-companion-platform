import { create } from 'zustand'
import type { Task, TaskStatus } from './types'
import { ipc } from '@/ipc/bridge'

type TaskStore = {
  tasks: Task[]
  activeTaskId: number | null
  filter: TaskStatus | 'all'
  loading: boolean

  fetchTasks: () => Promise<void>
  createTask: (input: { title: string; description?: string; priority?: number }) => Promise<void>
  updateTask: (id: number, input: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  completeTask: (id: number) => Promise<void>
  setActiveTask: (id: number | null) => void
  setFilter: (filter: TaskStatus | 'all') => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  activeTaskId: null,
  filter: 'all',
  loading: false,

  fetchTasks: async () => {
    set({ loading: true })
    const tasks = (await ipc.tasks.getAll(get().filter === 'all' ? undefined : get().filter)) as Task[]
    set({ tasks, loading: false })
  },

  createTask: async (input) => {
    await ipc.tasks.create(input)
    await get().fetchTasks()
  },

  updateTask: async (id, input) => {
    await ipc.tasks.update(id, input as Record<string, unknown>)
    await get().fetchTasks()
  },

  deleteTask: async (id) => {
    await ipc.tasks.delete(id)
    if (get().activeTaskId === id) {
      set({ activeTaskId: null })
    }
    await get().fetchTasks()
  },

  completeTask: async (id) => {
    await ipc.tasks.complete(id)
    if (get().activeTaskId === id) {
      set({ activeTaskId: null })
    }
    await get().fetchTasks()
  },

  setActiveTask: (id) => {
    set({ activeTaskId: id })
  },

  setFilter: (filter) => {
    set({ filter })
    get().fetchTasks()
  },
}))
