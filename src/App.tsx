import { PomodoroTimer } from './features/pomodoro'
import { TaskList } from './features/tasks'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b-2 border-foreground bg-background">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-none font-bold text-xl tracking-tighter">
              FC
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
              Focus Companion
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Productivity
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto items-start">
          <div className="lg:col-span-5 bg-card text-card-foreground p-8 rounded-none border-2 border-foreground">
            <PomodoroTimer />
          </div>
          <div className="lg:col-span-7 bg-card text-card-foreground p-8 rounded-none border-2 border-foreground">
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
