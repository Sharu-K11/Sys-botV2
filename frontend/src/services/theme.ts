export type Theme = 'light' | 'dark'

const THEME_KEY = 'sysbot_theme'

export function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.dataset.theme = theme
}

export function initializeTheme() {
  document.documentElement.dataset.theme = getInitialTheme()
}