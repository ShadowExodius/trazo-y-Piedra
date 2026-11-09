import { useState, useRef, useEffect } from 'react'

const SUGERENCIAS = [
  '¿Qué prendas tienen en el catálogo?',
  'Quiero personalizar una prenda',
  '¿Cómo cuido mi denim pintado?',
  '¿Tienen algún código de descuento?',
]

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false)
  const [entrada, setEntrada] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensajes, setMensajes] = useState([
    {
      autor: 'ia',
      texto:
        'Hola, soy Aurora, tu estilista en el Atelier Trazo & Piedra. Puedo recomendarte piezas hechas a mano, servicios de personalización o cuidado del denim. ¿En qué te asesoro hoy?',
    },
  ])
  const finMensajesRef = useRef(null)

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  // Despertar el servidor gratuito de Render en segundo plano al cargar la página
  useEffect(() => {
    fetch('https://trazo-y-piedra.onrender.com/contacto').catch(() => {})
  }, [])

  const enviarConsulta = async (textoConsulta) => {
    const pregunta = textoConsulta.trim()
    setError('')

    if (!pregunta) {
      setError('Escribe un mensaje antes de consultar al Atelier.')
      return
    }

    setMensajes((prev) => [...prev, { autor: 'usuario', texto: pregunta }])
    setEntrada('')
    setCargando(true)

    try {
      const res = await fetch('https://trazo-y-piedra.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: pregunta }),
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) {
        throw new Error('Error al consultar el servidor del Atelier.')
      }

      const datos = await res.json()
      setMensajes((prev) => [...prev, { autor: 'ia', texto: datos.respuesta }])
    } catch {
      setError('No se pudo conectar con Aurora en este momento. Intenta de nuevo en unos segundos.')
    } finally {
      setCargando(false)
    }
  }

  const manejarSubmit = (e) => {
    e.preventDefault()
    enviarConsulta(entrada)
  }

  return (
    <div className="chatbot-contenedor">
      {abierto && (
        <aside className="chatbot-ventana" aria-label="Asistente virtual de Trazo y Piedra">
          <header className="chatbot-header">
            <div>
              <span className="chatbot-tag">AURORA · ESTILISTA</span>
              <h3 className="chatbot-titulo">Atelier Trazo &amp; Piedra</h3>
            </div>
            <button
              type="button"
              className="bolsa-icon-btn chatbot-cerrar"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar asistente"
            >
              ✕
            </button>
          </header>

          <div className="chatbot-mensajes">
            {mensajes.map((m, i) => (
              <div key={i} className={`chatbot-burbuja ${m.autor === 'usuario' ? 'usuario' : 'ia'}`}>
                {m.texto}
              </div>
            ))}

            {cargando && (
              <div className="chatbot-burbuja ia chatbot-cargando">
                Aurora está escribiendo...
              </div>
            )}
            <div ref={finMensajesRef} />
          </div>

          <div className="chatbot-sugerencias">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                className="chatbot-chip"
                onClick={() => enviarConsulta(s)}
                disabled={cargando}
              >
                {s}
              </button>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={manejarSubmit} noValidate>
            {error && <span className="error-texto activo chatbot-error">{error}</span>}
            <div className="chatbot-input-fila">
              <input
                type="text"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Pregúntale a Aurora sobre prendas o servicios..."
                disabled={cargando}
              />
              <button type="submit" className="chatbot-btn-enviar" disabled={cargando}>
                Enviar
              </button>
            </div>
          </form>
        </aside>
      )}

      <button
        type="button"
        className="chatbot-boton-flotante"
        onClick={() => setAbierto((v) => !v)}
      >
        <svg
          className="chatbot-icono-estrella"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          <path d="M19 3v4M17 5h4" />
          <circle cx="6" cy="18" r="1.5" />
        </svg>
        <span>AURORA &middot; ESTILISTA</span>
      </button>
    </div>
  )
}
