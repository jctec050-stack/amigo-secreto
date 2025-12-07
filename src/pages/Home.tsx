import { useNavigate } from 'react-router-dom'
import { Gift, Sparkles, Users } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const handleCrearSorteo = () => {
    navigate('/participantes')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-green-700">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Christmas Icons */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="text-6xl animate-bounce">🎄</div>
            <div className="text-6xl animate-pulse">🎅</div>
            <div className="text-6xl animate-bounce delay-300">🎁</div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Amigo Secreto
            <span className="block text-yellow-300">de Navidad</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Organiza tu intercambio de regalos navideños de forma fácil y divertida. 
            Crea tu sorteo, agrega participantes y comparte los resultados por WhatsApp.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Users className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-lg font-semibold mb-2">Agrega Participantes</h3>
              <p className="text-sm opacity-90">Añade todos los nombres de tus amigos y familiares</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-lg font-semibold mb-2">Sorteo Aleatorio</h3>
              <p className="text-sm opacity-90">Realiza el sorteo sin auto-asignaciones</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Gift className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-lg font-semibold mb-2">Comparte Resultados</h3>
              <p className="text-sm opacity-90">Envía los resultados por WhatsApp</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCrearSorteo}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Gift className="w-6 h-6" />
            Crear Nuevo Sorteo
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-20 text-center">
          <div className="flex justify-center gap-4 text-4xl opacity-50">
            <span className="animate-pulse">❄️</span>
            <span className="animate-pulse delay-100">⭐</span>
            <span className="animate-pulse delay-200">❄️</span>
            <span className="animate-pulse delay-300">⭐</span>
            <span className="animate-pulse delay-400">❄️</span>
          </div>
        </div>
      </div>

      {/* Snowflake Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-white text-2xl animate-pulse opacity-30">❄️</div>
        <div className="absolute top-20 right-20 text-white text-xl animate-bounce opacity-20">❄️</div>
        <div className="absolute bottom-20 left-20 text-white text-lg animate-pulse opacity-25">❄️</div>
        <div className="absolute bottom-10 right-10 text-white text-2xl animate-bounce opacity-30">❄️</div>
      </div>
    </div>
  )
}