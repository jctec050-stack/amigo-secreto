import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, User, Trash2, ArrowRight } from 'lucide-react'
import { supabase } from '../utils/supabase'
import { useSecretSantaStore } from '../store/secretSantaStore'

export default function Participantes() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const { currentSorteoId, participantes, isLoading, error, setCurrentSorteoId, addParticipante, removeParticipante, setParticipantes, setLoading, setError } = useSecretSantaStore()

  // Create a new sorteo when the page loads if one doesn't exist
  useEffect(() => {
    const createSorteo = async () => {
      if (!currentSorteoId) {
        setLoading(true)
        try {
          const { data, error } = await supabase
            .from('sorteos')
            .insert([{}])
            .select()
            .single()

          if (error) throw error
          setCurrentSorteoId(data.id)
        } catch (err) {
          setError('Error al crear el sorteo')
          console.error('Error creating sorteo:', err)
        } finally {
          setLoading(false)
        }
      } else {
        // Load existing participants
        loadParticipantes()
      }
    }

    createSorteo()
  }, [])

  const loadParticipantes = async () => {
    if (!currentSorteoId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('participantes')
        .select('*')
        .eq('sorteo_id', currentSorteoId)

      if (error) throw error
      setParticipantes(data || [])
    } catch (err) {
      setError('Error al cargar participantes')
      console.error('Error loading participants:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarParticipante = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim()) {
      setError('Por favor ingresa un nombre')
      return
    }

    if (!currentSorteoId) {
      setError('No hay sorteo activo')
      return
    }

    if (participantes.some(p => p.nombre.toLowerCase() === nombre.toLowerCase().trim())) {
      setError('Este participante ya fue agregado')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('participantes')
        .insert([{
          sorteo_id: currentSorteoId,
          nombre: nombre.trim()
        }])
        .select()
        .single()

      if (error) throw error
      addParticipante(data)
      setNombre('')
      setError(null)
    } catch (err) {
      setError('Error al agregar participante')
      console.error('Error adding participant:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarParticipante = async (id: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('participantes')
        .delete()
        .eq('id', id)

      if (error) throw error
      removeParticipante(id)
    } catch (err) {
      setError('Error al eliminar participante')
      console.error('Error removing participant:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRealizarSorteo = () => {
    if (participantes.length < 3) {
      setError('Se necesitan al menos 3 participantes para realizar el sorteo')
      return
    }
    navigate(`/sorteo/${currentSorteoId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-green-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="text-4xl">🎅</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Agregar Participantes
            </h1>
            <div className="text-4xl">🎄</div>
          </div>
          <p className="text-white/90 text-lg">
            Añade todos los nombres de los participantes del sorteo
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleAgregarParticipante} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del participante"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !nombre.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Agregar
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-white text-center">
              {error}
            </div>
          </div>
        )}

        {/* Participants List */}
        {participantes.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Participantes ({participantes.length})
              </h2>
              <div className="space-y-3">
                {participantes.map((participante) => (
                  <div
                    key={participante.id}
                    className="bg-white/20 rounded-lg p-4 flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{participante.nombre}</span>
                    <button
                      onClick={() => handleEliminarParticipante(participante.id)}
                      disabled={isLoading}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {participantes.length >= 3 && (
          <div className="text-center">
            <button
              onClick={handleRealizarSorteo}
              disabled={isLoading}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              Realizar Sorteo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-800">Procesando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}