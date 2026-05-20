import React from 'react'

export default function RightPanel() {
  // static mock for now
  const alerts = [
    { id: 1, text: 'Cama 07 - Quarto 103', humidity: '88%', time: '14:30' },
    { id: 2, text: 'Cama 01 - Quarto 101', humidity: '85%', time: '14:30' },
    { id: 3, text: 'Cama 10 - Quarto 104', humidity: '79%', time: '14:25' }
  ]

  return (
    <aside className="w-80 p-4 space-y-4">
      <div className="glass-card p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-400">Últimos alertas</div>
          <button className="text-xs text-indigo-400">Ver todos</button>
        </div>

        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.text}</div>
                <div className="text-xs text-slate-400">Umidade: {a.humidity}</div>
              </div>
              <div className="text-xs text-slate-400">{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 rounded">
        <div className="text-sm text-slate-400 mb-2">Atividade Recente</div>
        <ul className="text-sm text-slate-200 space-y-2">
          <li>Alerta na Cama 07 — 14:30</li>
          <li>Alerta na Cama 01 — 14:30</li>
          <li>Alerta limpo na Cama 02 — 14:28</li>
        </ul>
      </div>
    </aside>
  )
}
