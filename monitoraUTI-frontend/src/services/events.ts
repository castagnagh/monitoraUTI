import { api } from './api'
import { EventItem } from '../types'

export const getEvents = async (take = 20): Promise<EventItem[]> => {
  const res = await api.get('/api/events', { params: { take } })
  return res.data
}
