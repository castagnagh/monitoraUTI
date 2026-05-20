import React from 'react'
import { Home, Bed, Bell, Settings } from 'lucide-react'

type Props = {
  activeTab: string
  onNavigate: (tab: string) => void
}

export default function Sidebar({ activeTab, onNavigate }: Props) {
  const itemClass = (tab: string) => `flex items-center gap-3 py-2 px-3 rounded glass-card hover:opacity-90 transition ${activeTab === tab ? 'ring-1 ring-cyan-400/40 bg-cyan-400/10' : ''}`

  return (
    <aside className="w-72 p-4 h-screen text-slate-200 sticky top-0">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-400 rounded flex items-center justify-center shadow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L5 7v6c0 5 5 9 7 9s7-4 7-9V7l-7-4z" fill="white"/></svg>
        </div>
        <div>
          <div className="font-bold text-lg">Monitora UTI</div>
          <div className="text-xs text-slate-400">Monitoramento de Fraldas</div>
        </div>
      </div>

      <nav className="space-y-2">
        <button onClick={() => onNavigate('dashboard')} className={itemClass('dashboard')}>
          <Home size={16} />
          <span>Dashboard</span>
        </button>

        <button onClick={() => onNavigate('beds')} className={itemClass('beds')}>
          <Bed size={16} />
          <span>Camas</span>
        </button>

        <button onClick={() => onNavigate('alerts')} className={itemClass('alerts')}>
          <Bell size={16} />
          <span>Alertas</span>
        </button>

        <button onClick={() => onNavigate('events')} className={itemClass('events')}>
          <Settings size={16} />
          <span>Eventos</span>
        </button>
      </nav>

      <div className="mt-auto pt-6" />
    </aside>
  )
}
