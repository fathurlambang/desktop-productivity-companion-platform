import { Trash2, Check, Play, Pause } from 'lucide-react'
import type { Task } from './types'
import { getPriorityLabel } from './types'
import { Button } from '@/components/Button'

type TaskItemProps = {
  task: Task
  isActive: boolean
  onComplete: (id: number) => void
  onDelete: (id: number) => void
  onSetActive: (id: number | null) => void
}

export function TaskItem({ task, isActive, onComplete, onDelete, onSetActive }: TaskItemProps) {
  const priorityLabel = getPriorityLabel(task.priority)
  const isCompleted = task.status === 'completed'

  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-primary',
    high: 'text-destructive',
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-none border-2 transition-none ${
        isActive ? 'border-primary bg-primary/10' : 'border-border'
      } ${isCompleted ? 'opacity-50' : ''}`}
    >
      <button
        onClick={() => !isCompleted && onComplete(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-none border-2 flex items-center justify-center transition-none ${
          isCompleted
            ? 'bg-primary border-primary'
            : 'border-foreground hover:border-primary'
        }`}
      >
        {isCompleted && <Check className="w-3 h-3 text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm uppercase tracking-wide ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {task.description}
          </div>
        )}
      </div>

      <span className={`text-xs font-bold uppercase tracking-wider ${priorityColors[priorityLabel]}`}>
        {priorityLabel}
      </span>

      {!isCompleted && (
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-none ${isActive ? 'text-primary border-2 border-primary' : 'text-muted-foreground hover:text-foreground border-2 border-transparent hover:border-border'}`}
          onClick={() => onSetActive(isActive ? null : task.id)}
          aria-label={isActive ? 'Unset active task' : 'Set as active task'}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-muted-foreground hover:text-destructive border-2 border-transparent hover:border-destructive"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
