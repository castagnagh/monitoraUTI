import React from 'react'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = window.localStorage.getItem('monitora-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  React.useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('monitora-theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen">
      <Dashboard theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
    </div>
  )
}
