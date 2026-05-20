import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', onCancel, onConfirm }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-500/15 p-3 text-red-300">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-800 text-slate-300"><X size={18} /></button>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-white/10 px-4 py-2 text-slate-300">Cancelar</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg shadow-red-600/30">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
