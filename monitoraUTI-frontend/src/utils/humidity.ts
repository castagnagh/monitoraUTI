import { Bed } from '../types'

export type HumidityLevel = 'normal' | 'attention' | 'alert' | 'inactive'

export function getHumidityLevel(bed: Bed): HumidityLevel {
  if (!bed.isActive) return 'inactive'

  const rawStatus = (bed.humidityStatus ?? '').trim().toUpperCase()

  if (rawStatus.includes('ALERTA') || rawStatus.includes('ALERT')) return 'alert'
  if (rawStatus.includes('ATEN') || rawStatus.includes('ATTENT')) return 'attention'
  if (rawStatus.includes('NORMAL')) return 'normal'

  const humidity = bed.currentHumidity ?? null
  if (humidity == null) return 'normal'
  if (humidity <= 40) return 'normal'
  if (humidity <= 70) return 'attention'
  return 'alert'
}

export function getHumidityLabel(level: HumidityLevel) {
  switch (level) {
    case 'alert':
      return 'ALERTA'
    case 'attention':
      return 'ATENÇÃO'
    case 'inactive':
      return 'DESATIVADA'
    default:
      return 'NORMAL'
  }
}
