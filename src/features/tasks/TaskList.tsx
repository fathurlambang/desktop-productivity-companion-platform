import { useEffect } from 'react'
import { useTaskStore } from './store'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import type { TaskStatus } from './types'
import { Button } from '@/components/Button'

export function TaskList() {
  const { tasks, activeTaskId, filter, loading, fetchTasks, createTask, deleteTask, completeTask, setActiveTask, setFilter } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filters: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-ink">Tasks</h2>

      <TaskForm onSubmit={createTask} />

      <div className="flex gap-1">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-ink/60 py-8 text-sm">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-ink/60 py-8 text-sm">
          No tasks yet. Add one above.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={activeTaskId === task.id}
              onComplete={completeTask}
              onDelete={deleteTask}
              onSetActive={setActiveTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}
