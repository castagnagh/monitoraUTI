import { api } from './api'
import { Bed, BedForm } from '../types'

export const getBeds = async (): Promise<Bed[]> => {
  const res = await api.get('/api/beds')
  return res.data
}

export const createBed = async (payload: BedForm): Promise<Bed> => {
  const res = await api.post('/api/beds', payload)
  return res.data
}

export const updateBed = async (id: number, payload: BedForm & { isActive: boolean }): Promise<void> => {
  await api.put(`/api/beds/${id}`, payload)
}

export const deleteBed = async (id: number): Promise<void> => {
  await api.delete(`/api/beds/${id}`)
}

export const toggleBed = async (id: number) => {
  await api.post(`/api/beds/${id}/toggle`)
}

export const clearBedAlert = async (id: number) => {
  await api.post(`/api/beds/${id}/clear-alert`)
}
