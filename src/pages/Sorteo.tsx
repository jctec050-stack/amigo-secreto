import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Shuffle, Share2, Copy, Check } from 'lucide-react'
import { supabase, Participante, Asignacion } from '../utils/supabase'
import { useSecretSantaStore } from '../store/secretSantaStore'

export default function Sorteo() {
  const { id } = useParams<{ id: string }>()
  const { participantes, setParticipantes, isLoading, setLoading, setError } = useSecretSantaStore()
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([])
  const [enlacesGenerados, setEnlacesGenerados] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (id) {
      loadParticipantes()
    }
  }, [id])

  const loadParticipantes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('participantes')
        .select('*')
        .eq('sorteo_id', id)

      if (error) throw error
      const lista = data || []
      setParticipantes(lista)

      if (lista.length > 0) {
        const ids = lista.map(p => p.id)
        const { data: asigns, error: asignErr } = await supabase
          .from('asignaciones')
          .select('*')
          .in('participante_id', ids)
        if (asignErr) throw asignErr
        setAsignaciones(asigns || [])
      }
    } catch (err) {
      setError('Error al cargar participantes')
      console.error('Error loading participants:', err)
    } finally {
      setLoading(false)
    }
  }

  const realizarSorteo = async () => {
    if (participantes.length < 3) {
      setError('Se necesitan al menos 3 participantes')
      return
    }

    setLoading(true)
    try {
      // Random Derangement Algorithm
      let shuffled = [...participantes]
      let isValid = false
      
      // Intentar hasta encontrar una combinación válida (sin auto-asignaciones)
      while (!isValid) {
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        isValid = true
        for (let i = 0; i < participantes.length; i++) {
          if (participantes[i].id === shuffled[i].id) {
            isValid = false
            break
          }
        }
      }

      const assignments = participantes.map((p, i) => ({
        participante_id: p.id,
        amigo_asignado_id: shuffled[i].id
      }))

      // Upsert assignments (avoid duplicates), and return full rows
      const { data: inserted, error } = await supabase
        .from('asignaciones')
        .upsert(assignments, { onConflict: 'participante_id' })
        .select('*')

      if (error) throw error

      // Update sorteo status
      const { error: sorteoError } = await supabase
        .from('sorteos')
        .update({ 
          estado: 'completado',
          fecha_sorteo: new Date().toISOString()
        })
        .eq('id', id)

      if (sorteoError) throw sorteoError

      setAsignaciones((inserted || []) as Asignacion[])
      setError(null)
    } catch (err) {
      setError('Error al realizar el sorteo')
      console.error('Error performing sorteo:', err)
    } finally {
      setLoading(false)
    }
  }

  const generarEnlaces = async () => {
    setLoading(true)
    try {
      // Update assignments as notified
      const { error } = await supabase
        .from('asignaciones')
        .update({ notificado: true })
        .in('participante_id', participantes.map(p => p.id))

      if (error) throw error

      setEnlacesGenerados(true)
      setError(null)
    } catch (err) {
      setError('Error al generar enlaces')
      console.error('Error generating links:', err)
    } finally {
      setLoading(false)
    }
  }

  const compartirPorWhatsApp = (participante: Participante, amigoAsignado?: Participante) => {
    if (!amigoAsignado) return
    const mensaje = `🎅 ¡Hola ${participante.nombre}!\n\nTu amigo secreto de Navidad es: *${amigoAsignado.nombre}* 🎁\n\nRecuerda que el intercambio de regalos es muy pronto. ¡Que tengas una feliz Navidad! 🎄\n\nPuedes ver este mensaje en: ${window.location.origin}/resultado/${participante.token_acceso}`
    
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  const copiarEnlace = (token: string, index: number) => {
    const url = `${window.location.origin}/resultado/${token}`
    navigator.clipboard.writeText(url)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getAmigoAsignado = (participanteId: string): Participante | undefined => {
    const asignacion = asignaciones.find(a => a.participante_id === participanteId)
    if (!asignacion) return undefined
    return participantes.find(p => p.id === asignacion.amigo_asignado_id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-green-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="text-4xl">🎁</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Resultado del Sorteo
            </h1>
            <div className="text-4xl">🎄</div>
          </div>
          <p className="text-white/90 text-lg">
            Aquí están las asignaciones de tu amigo secreto
          </p>
        </div>

        {/* Sorteo Button */}
        {asignaciones.length === 0 && (
          <div className="text-center mb-8">
            <button
              onClick={realizarSorteo}
              disabled={isLoading || participantes.length < 3}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Shuffle className="w-5 h-5" />
              Realizar Sorteo
            </button>
          </div>
        )}

        {/* Results */}
        {asignaciones.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">
                Asignaciones del Amigo Secreto 🎅
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {participantes.map((participante, index) => {
                  const amigoAsignado = getAmigoAsignado(participante.id)
                  return (
                    <div key={participante.id} className="bg-yellow-400 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎁</div>
                        <p className="font-semibold text-gray-800">
                          {participante.nombre}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">le toca regalar a</p>
                        <p className="font-bold text-lg text-red-700">
                          {amigoAsignado?.nombre}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Share Links */}
            {!enlacesGenerados && (
              <div className="text-center mb-8">
                <button
                  onClick={generarEnlaces}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Share2 className="w-5 h-5" />
                  Generar Enlaces para Compartir
                </button>
              </div>
            )}

            {/* WhatsApp Sharing */}
            {enlacesGenerados && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">
                  Comparte con los participantes 📱
                </h3>
                <div className="space-y-4">
                  {participantes.map((participante, index) => {
                    const amigoAsignado = getAmigoAsignado(participante.id)
                    return (
                      <div key={participante.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{participante.nombre}</p>
                          <p className="text-sm text-gray-600">
                            Amigo asignado: <span className="font-medium text-red-600">{amigoAsignado?.nombre}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => compartirPorWhatsApp(participante, amigoAsignado)}
                            disabled={!amigoAsignado}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => copiarEnlace(participante.token_acceso, index)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedIndex === index ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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
