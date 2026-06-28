import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

type ThemeStore = {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  return resolved
}

export const useThemeStore = create<ThemeStore>((set) => {
  const saved = (localStorage.getItem('theme') as Theme) ?? 'system'
  const resolved = applyTheme(saved)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') {
      const r = applyTheme('system')
      useThemeStore.setState({ resolved: r })
    }
  })

  return {
    theme: saved,
    resolved,
    setTheme: (theme) => {
      localStorage.setItem('theme', theme)
      const resolved = applyTheme(theme)
      set({ theme, resolved })
    },
  }
})
