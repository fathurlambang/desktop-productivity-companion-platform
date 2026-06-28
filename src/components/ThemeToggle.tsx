import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react'
import { useThemeStore } from '@/store/theme'
import { Button } from '@/components/Button'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4 mr-2" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 mr-2" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4 mr-2" /> },
  ] as const

  const currentOption = options.find((opt) => opt.value === theme) || options[2]

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle theme"
        className="w-full flex items-center justify-between gap-2 px-3"
      >
        <div className="flex items-center">
          {currentOption.icon}
          <span className="hidden sm:inline-block">{currentOption.label}</span>
        </div>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-none border-2 border-foreground bg-popover text-popover-foreground z-dropdown">
          <div className="p-0">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center rounded-none px-4 py-3 text-sm outline-none transition-none hover:bg-accent hover:text-accent-foreground border-b-2 border-foreground last:border-b-0 ${
                  theme === option.value ? 'bg-primary text-primary-foreground font-bold' : 'font-medium'
                }`}
              >
                {option.icon}
                <span className="uppercase tracking-wider text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
