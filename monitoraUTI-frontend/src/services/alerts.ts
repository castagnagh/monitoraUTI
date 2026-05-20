import { api } from './api'

export const sendHumidityAlert = async (bedId: number, humidityValue: number) => {
  await api.post('/api/alerts', { bedId, humidityValue })
}
