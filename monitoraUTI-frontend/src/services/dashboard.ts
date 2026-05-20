import { api } from './api'
import { DashboardSummary } from '../types'

export const getDashboard = async (): Promise<DashboardSummary> => {
  const res = await api.get('/api/dashboard')
  const data = res.data

  return {
    totalBeds: data.totalBeds ?? data.total ?? 0,
    activeBeds: data.activeBeds ?? data.active ?? 0,
    alertBeds: data.alertBeds ?? data.alerts ?? 0,
    monitoredPatients: data.monitoredPatients ?? data.totalBeds ?? data.total ?? 0,
    latestAlerts: data.latestAlerts ?? data.latest ?? [],
    recentEvents: data.recentEvents ?? data.latest ?? []
  }
}
