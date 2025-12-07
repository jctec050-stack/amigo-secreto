import { create } from 'zustand'
import { Participante } from '../utils/supabase'

interface SecretSantaState {
  currentSorteoId: string | null
  participantes: Participante[]
  isLoading: boolean
  error: string | null
  
  setCurrentSorteoId: (id: string) => void
  setParticipantes: (participantes: Participante[]) => void
  addParticipante: (participante: Participante) => void
  removeParticipante: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearStore: () => void
}

export const useSecretSantaStore = create<SecretSantaState>((set) => ({
  currentSorteoId: null,
  participantes: [],
  isLoading: false,
  error: null,
  
  setCurrentSorteoId: (id) => set({ currentSorteoId: id }),
  setParticipantes: (participantes) => set({ participantes }),
  addParticipante: (participante) => set((state) => ({
    participantes: [...state.participantes, participante]
  })),
  removeParticipante: (id) => set((state) => ({
    participantes: state.participantes.filter(p => p.id !== id)
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearStore: () => set({
    currentSorteoId: null,
    participantes: [],
    isLoading: false,
    error: null
  })
}))