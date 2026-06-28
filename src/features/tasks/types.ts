export type Priority = 'low' | 'medium' | 'high'

export type TaskStatus = 'active' | 'completed'

export type Task = {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: number
  createdAt: string
  updatedAt: string
}

export function getPriorityLabel(priority: number): Priority {
  if (priority <= 0) return 'low'
  if (priority === 1) return 'medium'
  return 'high'
}

export function getPriorityColor(priority: number): string {
  const label = getPriorityLabel(priority)
  switch (label) {
    case 'low':
      return 'text-muted-foreground'
    case 'medium':
      return 'text-yellow-500'
    case 'high':
      return 'text-red-500'
  }
}

export function getPriorityValue(priority: Priority): number {
  switch (priority) {
    case 'low':
      return 0
    case 'medium':
      return 1
    case 'high':
      return 2
  }
}
