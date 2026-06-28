import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import type { Priority } from './types'
import { getPriorityValue } from './types'

type TaskFormProps = {
  onSubmit: (input: { title: string; description: string; priority: number }) => void
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('low')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority: getPriorityValue(priority),
    })

    setTitle('')
    setDescription('')
    setPriority('low')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What are you working on?"
        className="bg-paper border-ink/10 text-ink placeholder:text-ink/40"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add details (optional)"
        className="flex min-h-[72px] w-full rounded-md border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-fast resize-none"
      />
      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="flex h-10 rounded-md border border-ink/10 bg-paper text-ink px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors duration-fast"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Button type="submit" disabled={!title.trim()} variant="gold">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </form>
  )
}
