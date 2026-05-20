export type Bed = {
  id: number
  name: string
  room?: string
  patientName?: string | null
  admissionReason?: string | null
  isActive: boolean
  hasHumidityAlert: boolean
  currentHumidity?: number | null
  humidityStatus?: string
  lastAlertAt?: string | null
  createdAt: string
}

export type BedForm = {
  name: string
  room: string
  patientName: string
  admissionReason: string
}

export type DashboardSummary = {
  totalBeds: number
  activeBeds: number
  alertBeds: number
  monitoredPatients: number
  latestAlerts: Array<{
    id: number
    bedId: number
    bedName?: string
    detectedAt: string
    humidityValue: number
  }>
  recentEvents: Array<{
    id: number
    bedId: number
    bedName?: string
    detectedAt: string
    humidityValue: number
  }>
}

export type EventItem = {
  id: number
  bedId: number
  bedName?: string
  detectedAt: string
  humidityValue: number
}
