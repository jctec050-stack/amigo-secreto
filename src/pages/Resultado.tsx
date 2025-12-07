import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Gift, Sparkles, Snowflake } from 'lucide-react'
import { supabase, Participante, Asignacion } from '../utils/supabase'

export default function Resultado() {
  const { token } = useParams<{ token: string }>()
  const [participante, setParticipante] = useState<Participante | null>(null)
  const [amigoAsignado, setAmigoAsignado] = useState<Participante | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      cargarResultado()
    }
  }, [token])

  const cargarResultado = async () => {
    setIsLoading(true)
    try {
      // Get participant by token
      const { data: participanteData, error: participanteError } = await supabase
        .from('participantes')
        .select('*')
        .eq('token_acceso', token)
        .single()

      if (participanteError) throw participanteError
      if (!participanteData) {
        setError('Participante no encontrado')
        return
      }

      setParticipante(participanteData)

      // Get assignment for this participant
      const { data: asignacionData, error: asignacionError } = await supabase
        .from('asignaciones')
        .select('*')
        .eq('participante_id', participanteData.id)
        .single()

      if (asignacionError) throw asignacionError
      if (!asignacionData) {
        setError('Asignación no encontrada')
        return
      }

      // Get the assigned friend
      const { data: amigoData, error: amigoError } = await supabase
        .from('participantes')
        .select('*')
        .eq('id', asignacionData.amigo_asignado_id)
        .single()

      if (amigoError) throw amigoError
      setAmigoAsignado(amigoData)

    } catch (err) {
      setError('Error al cargar el resultado')
      console.error('Error loading result:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-green-700 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg">Cargando tu amigo secreto...</p>
        </div>
      </div>
    )
  }

  if (error || !participante || !amigoAsignado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-green-700 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'No se pudo cargar la información'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-green-700 relative overflow-hidden">
      {/* Animated Snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-white text-3xl animate-pulse opacity-30">❄️</div>
        <div className="absolute top-20 right-20 text-white text-2xl animate-bounce opacity-20">❄️</div>
        <div className="absolute bottom-20 left-20 text-white text-xl animate-pulse opacity-25">❄️</div>
        <div className="absolute bottom-10 right-10 text-white text-3xl animate-bounce opacity-30">❄️</div>
        <div className="absolute top-1/2 left-1/4 text-white text-lg animate-pulse opacity-20">⭐</div>
        <div className="absolute top-1/3 right-1/3 text-white text-2xl animate-bounce opacity-25">⭐</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="text-5xl animate-bounce">🎅</div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                ¡Feliz Navidad!
              </h1>
              <div className="text-5xl animate-bounce delay-300">🎄</div>
            </div>
            <p className="text-xl text-white/90">
              Hola <span className="font-bold text-yellow-300">{participante.nombre}</span>,
            </p>
            <p className="text-lg text-white/90 mt-2">
              tu amigo secreto de Navidad es:
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Gift className="w-16 h-16 text-red-600 animate-pulse" />
              </div>
              <div className="mb-4">
                <Sparkles className="w-8 h-8 text-red-600 mx-auto mb-2 animate-spin" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-2 drop-shadow-lg">
                {amigoAsignado.nombre}
              </h2>
              <div className="flex justify-center items-center gap-2 mt-4">
                <Snowflake className="w-6 h-6 text-blue-600 animate-pulse" />
                <p className="text-lg text-gray-700 font-medium">
                  ¡Es hora de encontrar el regalo perfecto!
                </p>
                <Snowflake className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Christmas Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="text-center text-white">
              <div className="flex justify-center gap-2 mb-4 text-2xl">
                <span className="animate-bounce">🎁</span>
                <span className="animate-bounce delay-100">🎄</span>
                <span className="animate-bounce delay-200">🎅</span>
                <span className="animate-bounce delay-300">⭐</span>
                <span className="animate-bounce delay-400">🎁</span>
              </div>
              <p className="text-lg leading-relaxed">
                Recuerda que el espíritu del amigo secreto está en compartir alegría y sorpresas. 
                ¡Que tengas una Navidad llena de amor, paz y felicidad!
              </p>
              <p className="text-sm mt-4 opacity-80">
                Guarda este mensaje para recordar quién es tu amigo secreto 🎅
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <div className="text-xl">🏠</div>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}