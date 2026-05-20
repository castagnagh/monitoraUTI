import React from 'react'
import { Bed } from '../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleBed, clearBedAlert } from '../services/beds'
import { Pencil, Trash2, Power } from 'lucide-react'
import { getHumidityLevel, getHumidityLabel } from '../utils/humidity'

type Props = {
  bed: Bed
  onEdit: (bed: Bed) => void
  onDelete: (bed: Bed) => void
  theme: 'dark' | 'light'
}

export default function BedCard({ bed, onEdit, onDelete, theme }: Props) {
  const qc = useQueryClient()
  const toggle = useMutation(() => toggleBed(bed.id), { onSuccess: () => qc.invalidateQueries(['beds']) })
  const clear = useMutation(() => clearBedAlert(bed.id), { onSuccess: () => qc.invalidateQueries(['beds']) })

  const level = getHumidityLevel(bed)
  const state = getHumidityLabel(level)

  const stateColor = level === 'inactive'
    ? 'text-slate-400 bg-slate-800/80'
    : level === 'alert'
      ? 'text-red-300 bg-red-900/30'
      : level === 'attention'
        ? 'text-yellow-200 bg-yellow-900/20'
        : 'text-emerald-300 bg-emerald-900/20'

  const pulseClass = level === 'alert' ? 'animate-pulse ring-2 ring-red-400/40' : ''

  const neutralButton = theme === 'light'
    ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
    : 'bg-slate-700 text-slate-100 hover:bg-slate-600'

  const clearButton = theme === 'light'
    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
    : 'bg-indigo-600 text-white hover:bg-indigo-500'

  const dangerButton = theme === 'light'
    ? 'bg-red-500 text-white hover:bg-red-600'
    : 'bg-red-600 text-white hover:bg-red-500'

  const badgeAccent = theme === 'light'
    ? 'text-[13px] font-bold tracking-wide px-3 py-2 min-w-[5.75rem] text-center'
    : 'text-[12px] font-semibold tracking-wide px-2.5 py-1.5 min-w-[5.5rem] text-center'

  const surfaceClass = theme === 'light'
    ? level === 'inactive'
      ? 'bg-slate-200/95 border-slate-300/90'
      : level === 'alert'
        ? 'bg-red-200/95 border-red-300/90'
        : level === 'attention'
          ? 'bg-amber-200/95 border-amber-300/90'
          : 'bg-emerald-200/95 border-emerald-300/90'
    : 'glass-card border-white/10'

  return (
    <div className={`h-full rounded-2xl p-3 shadow-sm border ${surfaceClass} ${pulseClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-100">{bed.name}</div>
          <div className="text-xs text-slate-400">Quarto: {bed.room ?? '-'}</div>
          <div className="text-xs text-slate-400">Paciente: {bed.patientName ?? '—'}</div>
          {bed.admissionReason && <div className="text-xs text-slate-400 line-clamp-2">Motivo: {bed.admissionReason}</div>}
        </div>

        <div className={`badge shrink-0 ${badgeAccent} ${stateColor}`}>{state}</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <div className="text-slate-500">Último alerta</div>
          <div className="mt-1">{bed.lastAlertAt ? new Date(bed.lastAlertAt).toLocaleString('pt-BR') : '-'}</div>
        </div>
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <div className="text-slate-500">Umidade</div>
          <div className="mt-1 text-lg font-semibold text-slate-100">
            {bed.currentHumidity == null ? '-' : `${bed.currentHumidity}%`}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => clear.mutate()} className={`px-3 py-2 rounded-lg text-xs transition ${clearButton}`}>
          Limpar alerta
        </button>
        <button onClick={() => toggle.mutate()} className={`px-3 py-2 rounded-lg text-xs inline-flex items-center gap-2 transition ${neutralButton}`}>
          <Power size={14} />
          Ativar/Desativar
        </button>
        <button onClick={() => onEdit(bed)} className={`px-3 py-2 rounded-lg text-xs inline-flex items-center gap-2 transition ${neutralButton}`}>
          <Pencil size={14} />
          Editar
        </button>
        <button onClick={() => onDelete(bed)} className={`px-3 py-2 rounded-lg text-xs inline-flex items-center gap-2 transition ${dangerButton}`}>
          <Trash2 size={14} />
          Excluir
        </button>
      </div>
    </div>
  )
}
