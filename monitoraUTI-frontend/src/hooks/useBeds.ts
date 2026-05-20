import { useQuery } from '@tanstack/react-query'
import { getBeds } from '../services/beds'

export function useBeds() {
  return useQuery(['beds'], getBeds, { refetchInterval: 5000 });
}
