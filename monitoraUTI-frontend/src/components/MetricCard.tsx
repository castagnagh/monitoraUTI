import React from 'react'

type Props = {
  label: string
  value: number | string
  hint?: string
  accent?: string
}

export default function MetricCard({ label, value, hint, accent = 'from-indigo-500 to-cyan-400' }: Props) {
  return (
    <div className="glass-card p-4 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
      <div className={`mb-3 h-10 w-10 rounded-xl bg-gradient-to-br ${accent} opacity-95`} />
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-2xl font-bold text-slate-100 mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  )
}
