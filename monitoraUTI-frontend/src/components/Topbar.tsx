import React from 'react'
import { Bell, Moon, SunMedium } from 'lucide-react'

type Props = {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function Topbar({ theme, onToggleTheme }: Props) {
  const [now, setNow] = React.useState(new Date())
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="text-sm text-slate-400">Monitoramento hospitalar em tempo real</div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded glass-card flex items-center gap-2 transition hover:scale-[1.02]"
          title={theme === 'dark' ? 'Mudar para light mode' : 'Mudar para dark mode'}
        >
          {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
        </button>
        <button className="relative p-2 rounded glass-card">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">3</span>
        </button>
        <div className="text-sm text-slate-400">{now.toLocaleString()}</div>
      </div>
    </header>
  )
}
