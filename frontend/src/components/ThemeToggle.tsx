import { useState } from 'react'
import { applyTheme, getInitialTheme, type Theme } from '../services/theme'

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  function selectTheme(nextTheme: Theme) {
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <button
        type="button"
        className={theme === 'light' ? 'theme-toggle__option--active' : ''}
        aria-pressed={theme === 'light'}
        onClick={() => selectTheme('light')}
      >
        Light
      </button>
      <button
        type="button"
        className={theme === 'dark' ? 'theme-toggle__option--active' : ''}
        aria-pressed={theme === 'dark'}
        onClick={() => selectTheme('dark')}
      >
        Dark
      </button>
    </div>
  )
}

export default ThemeToggle