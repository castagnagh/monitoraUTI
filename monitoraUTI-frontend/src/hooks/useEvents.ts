import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../services/events'

export function useEvents() {
  return useQuery(['events'], () => getEvents(20), { refetchInterval: 5000 })
}
