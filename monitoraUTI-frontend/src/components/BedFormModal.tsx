import React from 'react'
import { BedForm } from '../types'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  title: string
  initialValue: BedForm
  onClose: () => void
  onSubmit: (value: BedForm) => void
}

export default function BedFormModal({ open, title, initialValue, onClose, onSubmit }: Props) {
  const [form, setForm] = React.useState(initialValue)

  React.useEffect(() => {
    setForm(initialValue)
  }, [initialValue, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="glass-card w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400">Preencha os dados da cama e do paciente.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Nome da cama</span>
            <input className="w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-slate-100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Quarto</span>
            <input className="w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-slate-100" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-300">Paciente</span>
            <input className="w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-slate-100" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-300">Motivo da internação</span>
            <input className="w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-slate-100" value={form.admissionReason} onChange={(e) => setForm({ ...form, admissionReason: e.target.value })} />
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-slate-300">Cancelar</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-lg shadow-indigo-600/30">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
