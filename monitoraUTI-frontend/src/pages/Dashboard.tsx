import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bed, BedForm } from '../types'
import Sidebar from '../components/Sidebar'
import BedCard from '../components/BedCard'
import Topbar from '../components/Topbar'
import MetricCard from '../components/MetricCard'
import BedFormModal from '../components/BedFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useBeds } from '../hooks/useBeds'
import { useDashboard } from '../hooks/useDashboard'
import { useEvents } from '../hooks/useEvents'
import { createBed, updateBed, deleteBed, clearBedAlert } from '../services/beds'
import { sendHumidityAlert } from '../services/alerts'
import { Bell, Plus, RefreshCw } from 'lucide-react'
import { getHumidityLevel } from '../utils/humidity'

type TabKey = 'dashboard' | 'beds' | 'alerts' | 'events'

type DashboardProps = {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

const emptyForm: BedForm = {
  name: '',
  room: '',
  patientName: '',
  admissionReason: ''
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleString('pt-BR')
}

function fieldClass(theme: 'dark' | 'light') {
  return theme === 'light'
    ? 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-cyan-400 focus:outline-none'
    : 'w-full rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 text-slate-100 placeholder:text-slate-500'
}

function actionButtonClass(theme: 'dark' | 'light', tone: 'neutral' | 'danger' | 'soft' = 'neutral') {
  if (tone === 'danger') {
    return theme === 'light'
      ? 'rounded-lg bg-red-500 px-4 py-2 text-white shadow-sm hover:bg-red-600'
      : 'rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg shadow-red-600/30 hover:bg-red-500'
  }

  if (tone === 'soft') {
    return theme === 'light'
      ? 'rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100'
      : 'rounded-lg border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5'
  }

  return theme === 'light'
    ? 'rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800'
    : 'rounded-lg bg-slate-700 px-4 py-2 text-slate-100 hover:bg-slate-600'
}

function getBedTone(bed: Bed, theme: 'dark' | 'light') {
  const level = getHumidityLevel(bed)
  if (theme === 'light') {
    if (level === 'inactive') return 'text-slate-500 bg-slate-100 ring-slate-300/60'
    if (level === 'alert') return 'text-red-700 bg-red-100 ring-red-300/70'
    if (level === 'attention') return 'text-amber-700 bg-amber-100 ring-amber-300/70'
    return 'text-emerald-700 bg-emerald-100 ring-emerald-300/70'
  }

  if (level === 'inactive') return 'text-slate-400 bg-slate-800/80 ring-slate-600/40'
  if (level === 'alert') return 'text-red-300 bg-red-900/30 ring-red-400/30'
  if (level === 'attention') return 'text-yellow-200 bg-yellow-900/20 ring-yellow-400/25'
  return 'text-emerald-300 bg-emerald-900/20 ring-emerald-400/25'
}

export default function Dashboard({ theme, onToggleTheme }: DashboardProps) {
  const qc = useQueryClient()
  const [tab, setTab] = React.useState<TabKey>('dashboard')
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingBed, setEditingBed] = React.useState<Bed | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Bed | null>(null)
  const [toast, setToast] = React.useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [alertBedId, setAlertBedId] = React.useState<number | ''>('')
  const [alertHumidity, setAlertHumidity] = React.useState('82')

  const { data: beds, isLoading } = useBeds()
  const { data: dashboard } = useDashboard()
  const { data: events } = useEvents()

  const createMutation = useMutation((payload: BedForm) => createBed(payload), {
    onSuccess: async () => {
      await qc.invalidateQueries(['beds'])
      await qc.invalidateQueries(['dashboard'])
      setToast({ type: 'success', message: 'Cama criada com sucesso.' })
      setFormOpen(false)
    }
  })

  const updateMutation = useMutation((payload: { id: number; form: BedForm; isActive: boolean }) => updateBed(payload.id, { ...payload.form, isActive: payload.isActive }), {
    onSuccess: async () => {
      await qc.invalidateQueries(['beds'])
      await qc.invalidateQueries(['dashboard'])
      setToast({ type: 'success', message: 'Cama atualizada com sucesso.' })
      setEditingBed(null)
      setFormOpen(false)
    }
  })

  const deleteMutation = useMutation((id: number) => deleteBed(id), {
    onSuccess: async () => {
      await qc.invalidateQueries(['beds'])
      await qc.invalidateQueries(['dashboard'])
      setToast({ type: 'success', message: 'Cama removida com sucesso.' })
      setDeleteTarget(null)
    }
  })

  const alertMutation = useMutation(({ bedId, humidityValue }: { bedId: number; humidityValue: number }) => sendHumidityAlert(bedId, humidityValue), {
    onSuccess: async () => {
      await qc.invalidateQueries(['beds'])
      await qc.invalidateQueries(['dashboard'])
      await qc.invalidateQueries(['events'])
      setToast({ type: 'success', message: 'Alerta enviado para a API do ESP32.' })
    }
  })

  const clearMutation = useMutation((id: number) => clearBedAlert(id), {
    onSuccess: async () => {
      await qc.invalidateQueries(['beds'])
      await qc.invalidateQueries(['dashboard'])
      setToast({ type: 'info', message: 'Alerta da cama limpo.' })
    }
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      qc.invalidateQueries(['beds'])
      qc.invalidateQueries(['dashboard'])
      qc.invalidateQueries(['events'])
    }, 5000)

    return () => clearInterval(timer)
  }, [qc])

  React.useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const metrics = [
    { label: 'Total de Camas', value: dashboard?.totalBeds ?? beds?.length ?? 0, hint: 'Todas as camas cadastradas' },
    { label: 'Camas Ativas', value: dashboard?.activeBeds ?? beds?.filter((bed) => bed.isActive).length ?? 0, hint: 'Disponíveis para monitoramento', accent: 'from-emerald-500 to-cyan-400' },
    { label: 'Camas com Alerta', value: dashboard?.alertBeds ?? beds?.filter((bed) => bed.hasHumidityAlert).length ?? 0, hint: 'Acima do limite de umidade', accent: 'from-red-500 to-orange-400' },
    { label: 'Pacientes Monitorados', value: dashboard?.monitoredPatients ?? beds?.filter((bed) => Boolean(bed.patientName)).length ?? 0, hint: 'Com paciente informado', accent: 'from-fuchsia-500 to-indigo-400' }
  ]

  const bedsByRoom = React.useMemo(() => {
    const list = beds ?? []
    const grouped = list.reduce<Record<string, Bed[]>>((acc, bed) => {
      const room = bed.room?.trim() || 'Sem quarto'
      acc[room] = acc[room] || []
      acc[room].push(bed)
      return acc
    }, {})

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
  }, [beds])

  const openCreate = () => {
    setEditingBed(null)
    setFormOpen(true)
  }

  const openEdit = (bed: Bed) => {
    setEditingBed(bed)
    setFormOpen(true)
  }

  const handleSaveBed = (form: BedForm) => {
    if (editingBed) {
      updateMutation.mutate({ id: editingBed.id, form, isActive: editingBed.isActive })
      return
    }
    createMutation.mutate(form)
  }

  const bedFormValue: BedForm = editingBed
    ? {
        name: editingBed.name,
        room: editingBed.room ?? '',
        patientName: editingBed.patientName ?? '',
        admissionReason: editingBed.admissionReason ?? ''
      }
    : emptyForm

  const renderBedsGrid = (list: Bed[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {list.map((bed) => (
        <div key={bed.id} className={`rounded-2xl p-1 ring-1 ${getBedTone(bed, theme)} shadow-lg shadow-black/20`}>
          <BedCard
            bed={bed}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            theme={theme}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen text-slate-200">
      <Sidebar activeTab={tab} onNavigate={(nextTab) => setTab(nextTab as TabKey)} />

      <main className="p-6 flex-1 max-w-[calc(100vw-18rem)]">
        <Topbar theme={theme} onToggleTheme={onToggleTheme} />

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {(['dashboard', 'beds', 'alerts', 'events'] as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === key ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'}`}
            >
              {key === 'dashboard' && 'Dashboard'}
              {key === 'beds' && 'Camas'}
              {key === 'alerts' && 'Alertas'}
              {key === 'events' && 'Eventos'}
            </button>
          ))}
        </div>

        {toast && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200' : toast.type === 'error' ? 'border-red-400/30 bg-red-500/15 text-red-200' : 'border-cyan-400/30 bg-cyan-500/15 text-cyan-200'}`}>
            {toast.message}
          </div>
        )}

        {(tab === 'dashboard' || tab === 'beds') && (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} accent={metric.accent} />
            ))}
          </section>
        )}

        {tab === 'dashboard' && (
          <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.9fr] gap-6">
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">Mapa visual das camas</h2>
                    <p className="text-sm text-slate-400">Organizado por quarto, com status em tempo real.</p>
                  </div>
                  <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30">
                    <Plus size={16} />
                    Adicionar cama
                  </button>
                </div>

                <div className="space-y-6">
                  {bedsByRoom.map(([room, roomBeds]) => (
                    <div key={room}>
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm text-cyan-300 font-semibold">{room}</div>
                          <div className="text-xs text-slate-500">{roomBeds.length} cama(s)</div>
                        </div>
                      </div>
                      {renderBedsGrid(roomBeds)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100">Últimos alertas</h3>
                    <p className="text-sm text-slate-400">Eventos recebidos da API.</p>
                  </div>
                  <Bell size={18} className="text-red-300" />
                </div>
                <div className="space-y-3 max-h-[22rem] overflow-auto pr-1">
                  {(dashboard?.latestAlerts ?? []).slice(0, 6).map((alert) => (
                    <div key={alert.id} className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-red-200">{alert.bedName ?? `Cama ${alert.bedId}`}</div>
                          <div className="text-xs text-slate-300">Umidade: {alert.humidityValue}%</div>
                        </div>
                        <div className="text-xs text-slate-400">{formatDate(alert.detectedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100">Eventos recentes</h3>
                    <p className="text-sm text-slate-400">Histórico da API /api/events.</p>
                  </div>
                  <RefreshCw size={18} className="text-cyan-300" />
                </div>
                <div className="space-y-3 max-h-[20rem] overflow-auto pr-1">
                  {(events ?? []).slice(0, 6).map((event) => (
                    <div key={event.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-100">{event.bedName ?? `Cama ${event.bedId}`}</div>
                          <div className="text-xs text-slate-400">Umidade: {event.humidityValue}%</div>
                        </div>
                        <div className="text-xs text-slate-400">{formatDate(event.detectedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'beds' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">CRUD completo de camas</h2>
                <p className="text-sm text-slate-400">Adicionar, editar, ativar, desativar, limpar alerta e excluir.</p>
              </div>
              <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30">
                <Plus size={16} /> Adicionar cama
              </button>
            </div>

            {isLoading && <div className="text-slate-400">Carregando camas...</div>}

            {bedsByRoom.map(([room, roomBeds]) => (
              <div key={room} className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100">{room}</h3>
                    <p className="text-xs text-slate-400">{roomBeds.length} registro(s)</p>
                  </div>
                </div>
                {renderBedsGrid(roomBeds)}
              </div>
            ))}
          </section>
        )}

        {tab === 'alerts' && (
          <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-6">
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <h2 className="text-lg font-semibold text-slate-100 mb-2">Disparar alerta manual</h2>
              <p className="text-sm text-slate-400 mb-5">Simula o ESP32 enviando umidade para a API.</p>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!alertBedId) return
                  alertMutation.mutate({ bedId: Number(alertBedId), humidityValue: Number(alertHumidity) })
                }}
              >
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Cama</span>
                  <select className={fieldClass(theme)} value={alertBedId} onChange={(e) => setAlertBedId(Number(e.target.value))}>
                    <option value="">Selecione...</option>
                    {(beds ?? []).map((bed) => (
                      <option key={bed.id} value={bed.id}>{bed.name} - {bed.room ?? 'Sem quarto'}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Umidade (%)</span>
                  <input type="number" min="0" max="100" className={fieldClass(theme)} value={alertHumidity} onChange={(e) => setAlertHumidity(e.target.value)} />
                </label>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setAlertBedId(''); setAlertHumidity('82') }} className={actionButtonClass(theme, 'soft')}>Limpar</button>
                  <button type="submit" className={actionButtonClass(theme, 'danger')}>Enviar alerta</button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="font-semibold text-slate-100 mb-3">Últimos alertas</h3>
                <div className="space-y-3">
                  {(dashboard?.latestAlerts ?? []).slice(0, 8).map((alert) => (
                    <div key={alert.id} className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                      <div className="font-semibold text-red-200">{alert.bedName ?? `Cama ${alert.bedId}`}</div>
                      <div className="text-xs text-slate-300">Umidade: {alert.humidityValue}%</div>
                      <div className="text-xs text-slate-400 mt-1">{formatDate(alert.detectedAt)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="font-semibold text-slate-100 mb-3">Ações rápidas</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <button onClick={() => qc.invalidateQueries(['beds'])} className="w-full rounded-lg border border-white/10 px-4 py-2 text-left hover:bg-white/5">Atualizar camas</button>
                  <button onClick={() => qc.invalidateQueries(['events'])} className="w-full rounded-lg border border-white/10 px-4 py-2 text-left hover:bg-white/5">Atualizar eventos</button>
                  <button onClick={() => qc.invalidateQueries(['dashboard'])} className="w-full rounded-lg border border-white/10 px-4 py-2 text-left hover:bg-white/5">Atualizar dashboard</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'events' && (
          <section className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Histórico de eventos</h2>
                <p className="text-sm text-slate-400">Lista completa recebida via GET /api/events.</p>
              </div>
              <button onClick={() => qc.invalidateQueries(['events'])} className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5">Recarregar</button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Cama</th>
                    <th className="px-4 py-3">Quarto</th>
                    <th className="px-4 py-3">Umidade</th>
                    <th className="px-4 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {(events ?? []).map((event) => (
                    <tr key={event.id} className="border-t border-white/10">
                      <td className="px-4 py-3 text-slate-100">{event.bedName ?? `Cama ${event.bedId}`}</td>
                      <td className="px-4 py-3 text-slate-300">{beds?.find((bed) => bed.id === event.bedId)?.room ?? '-'}</td>
                      <td className="px-4 py-3 text-slate-300">{event.humidityValue}%</td>
                      <td className="px-4 py-3 text-slate-300">{formatDate(event.detectedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <BedFormModal
        open={formOpen}
        title={editingBed ? 'Editar cama' : 'Adicionar cama'}
        initialValue={bedFormValue}
        onClose={() => { setFormOpen(false); setEditingBed(null) }}
        onSubmit={handleSaveBed}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir cama"
        description={deleteTarget ? `Tem certeza que deseja excluir ${deleteTarget.name}?` : ''}
        confirmLabel="Excluir"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
