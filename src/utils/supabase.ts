import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../../supabase/config.js'

const supabaseUrl = supabaseConfig.url
const supabaseAnonKey = supabaseConfig.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Sorteo {
  id: string
  estado: 'pendiente' | 'completado'
  fecha_creacion: string
  fecha_sorteo?: string
}

export interface Participante {
  id: string
  sorteo_id: string
  nombre: string
  token_acceso: string
  creado_en: string
}

export interface Asignacion {
  id: string
  participante_id: string
  amigo_asignado_id: string
  notificado: boolean
  fecha_asignacion: string
}