import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../services/dashboard'

export function useDashboard() {
  return useQuery(['dashboard'], getDashboard, { refetchInterval: 5000 })
}
