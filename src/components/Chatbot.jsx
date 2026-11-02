import { useState } from 'react'
import { productos, codigosDescuento, formatoPrecio } from '../data/productos.js'

const SUGERENCIAS = [
  '¿Qué prendas tienen en el catálogo?',
  'Quiero personalizar una prenda',
  '¿Cómo cuido mi denim pintado?',
  '¿Tienen algún código de descuento?',
]

function respuestaAtelierLocal(pregunta = '') {
  const texto = pregunta.toLowerCase()
  const listaProductos = productos
    .map((p) => `${p.nombre} (${formatoPrecio(p.precio)}${p.custom ? ', personalizable' : ''})`)
    .join(', ')
  const codigos = Object.entries(codigosDescuento)
    .map(([codigo, pct]) => `${codigo} (${pct}% de descuento)`)
    .join(', ')

  if (
    texto.includes('precio') ||
    texto.includes('catalogo') ||
    texto.includes('catálogo') ||
    texto.includes('prenda') ||
    texto.includes('producto') ||
    texto.includes('tienen')
  ) {
    return `En nuestro catálogo contamos con piezas hechas a mano: ${listaProductos}. Puedes agregar cualquiera a tu bolsa y usar el código ${codigos}.`
  }

  if (
    texto.includes('servicio') ||
    texto.includes('personaliza') ||
    texto.includes('pint') ||
    texto.includes('bordad') ||
    texto.includes('restaura') ||
    texto.includes('medida')
  ) {
    return 'En el Atelier ofrecemos cuatro oficios artesanales: Pintura a mano sobre denim, Bordado en oro con mostacilla y cristal, Modificación a medida y Restauración de prendas heredadas. Puedes agendar tu consulta desde la sección Contacto.'
  }

  if (texto.includes('cuidado') || texto.includes('lavar') || texto.includes('kit') || texto.includes('conservar')) {
    return 'Para conservar el trazo y el bordado recomendamos lavar a mano con agua fría, sin retorcer ni frotar la ilustración. Nuestro Kit Cuidado Ecológico ($ 85.000) está pensado especialmente para proteger cada pieza.'
  }

  if (texto.includes('descuento') || texto.includes('codigo') || texto.includes('código') || texto.includes('promo')) {
    return `Sí, puedes ingresar el código ${codigos} dentro de tu bolsa de compras antes de finalizar tu pedido.`
  }

  if (
    texto.includes('ubicacion') ||
    texto.includes('ubicación') ||
    texto.includes('donde') ||
    texto.includes('dónde') ||
    texto.includes('horario') ||
    texto.includes('bogota') ||
    texto.includes('bogotá') ||
    texto.includes('contacto')
  ) {
    return 'Nuestro Atelier está en la Cra. 11 # 84-12, Bogotá, Colombia. Atendemos de martes a sábado de 10:00 a 18:00 y por correo en hola@trazoypiedra.com.'
  }

  return `Soy Aurora, estilista del Atelier Trazo & Piedra — "Una pieza no se compra, se hereda". Puedo ayudarte con nuestro catálogo (${productos.length} piezas disponibles entre $ 75.000 y $ 380.000), nuestros 4 servicios de personalización y restauración, o el cuidado de tus prendas. ¿Qué te gustaría consultar?`
}

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
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: pregunta }),
      })

      if (!res.ok) {
        throw new Error('Error al consultar el servidor del Atelier.')
      }

      const datos = await res.json()
      setMensajes((prev) => [...prev, { autor: 'ia', texto: datos.respuesta }])
    } catch {
      // Respaldo inteligente para que funcione también en GitHub Pages sin servidor local
      await new Promise((r) => setTimeout(r, 450))
      setMensajes((prev) => [
        ...prev,
        { autor: 'ia', texto: respuestaAtelierLocal(pregunta) },
      ])
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
