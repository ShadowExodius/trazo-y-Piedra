import { useState, useRef, useEffect } from 'react'
import { productos, codigosDescuento, formatoPrecio } from '../data/productos.js'

const SUGERENCIAS = [
  '¿Qué prendas tienen en el catálogo?',
  'Quiero personalizar una prenda',
  '¿Cómo cuido mi denim pintado?',
  '¿Tienen algún código de descuento?',
]

function respuestaAtelierLocal(pregunta = '') {
  const texto = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const listaProductos = productos
    .map((p) => `${p.nombre} (${formatoPrecio(p.precio)}${p.custom ? ', personalizable' : ''})`)
    .join(', ')
  const codigos = Object.entries(codigosDescuento)
    .map(([codigo, pct]) => `${codigo} (${pct}% de descuento)`)
    .join(', ')

  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|quien eres)/.test(texto)) {
    return '¡Hola! Soy Aurora, estilista de Trazo & Piedra. Estoy aquí para ayudarte a elegir una pieza pintada o bordada a mano, recomendarte un regalo o contarte sobre nuestros servicios de taller. ¿Qué estás buscando hoy?'
  }

  if (texto.includes('gracias') || texto.includes('adios') || texto.includes('chao') || texto.includes('perfecto') || texto.includes('genial')) {
    return `Con todo el gusto. Recuerda que en Trazo & Piedra cada pieza nace para una sola persona. Si deseas encargar la tuya, puedes usar el código ${codigos} en tu bolsa.`
  }

  if (texto.includes('chaqueta') || texto.includes('spider')) {
    return 'Nuestra Chaqueta Denim Spider-Man tiene un valor de $ 380.000 COP. Es una pieza intervenida a mano y 100% personalizable; podemos adaptarle detalles o crear un motivo exclusivo para ti.'
  }

  if (texto.includes('jean') || texto.includes('geisha') || texto.includes('pantalon')) {
    return 'El Jean vintage Japanese Geisha cuesta $ 120.000 COP. Es un denim intervenido a mano con inspiración japonesa y admite personalización en el taller.'
  }

  if (texto.includes('top') || texto.includes('sol de oro') || texto.includes('blusa') || texto.includes('camiseta')) {
    return 'El Top Sol de Oro tiene un precio de $ 320.000 COP. Lleva bordado artesanal con hilo dorado, mostacilla y cristal hecho por nuestras artesanas.'
  }

  if (texto.includes('bolso') || texto.includes('tote') || texto.includes('naranja')) {
    return 'El Tote Bag Naranjas en Flor cuesta $ 75.000 COP. Es pintado a mano, ligero, resistente y personalizable; una opción encantadora para uso diario o para regalar.'
  }

  if (texto.includes('recomienda') || texto.includes('regalo') || texto.includes('ocasion') || texto.includes('estilo') || texto.includes('look') || texto.includes('comprar')) {
    return 'Si buscas un detalle accesible y único, te sugiero el Tote Bag Naranjas en Flor ($ 75.000) o el Jean Japanese Geisha ($ 120.000). Si prefieres una pieza protagonista de alta costura artesanal, el Top Sol de Oro ($ 320.000) o la Chaqueta Denim ($ 380.000) son inolvidables.'
  }

  if (texto.includes('talla') || texto.includes('envio') || texto.includes('domicilio') || texto.includes('demora') || texto.includes('entrega') || texto.includes('pago')) {
    return 'Como trabajamos piezas hechas a mano y series 1/1, adaptamos las tallas y siluetas a tu medida. Realizamos envíos a toda Colombia desde Bogotá y calculamos el envío y la personalización al finalizar tu pedido en Contacto.'
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

  if (texto.includes('descuento') || texto.includes('codigo') || texto.includes('promo')) {
    return `Sí, puedes ingresar el código ${codigos} dentro de tu bolsa de compras antes de finalizar tu pedido.`
  }

  if (
    texto.includes('ubicacion') ||
    texto.includes('donde') ||
    texto.includes('horario') ||
    texto.includes('bogota') ||
    texto.includes('contacto') ||
    texto.includes('direccion') ||
    texto.includes('correo')
  ) {
    return 'Nuestro Atelier está en la Cra. 11 # 84-12, Bogotá, Colombia. Atendemos de martes a sábado de 10:00 a 18:00 y por correo en hola@trazoypiedra.com.'
  }

  if (
    texto.includes('precio') ||
    texto.includes('catalogo') ||
    texto.includes('prenda') ||
    texto.includes('producto') ||
    texto.includes('tienen') ||
    texto.includes('cuanto') ||
    texto.includes('valor')
  ) {
    return `En nuestro catálogo contamos con piezas hechas a mano: ${listaProductos}. Puedes agregar cualquiera a tu bolsa y usar el código ${codigos}.`
  }

  return `Como estilista de Trazo & Piedra te cuento que trabajamos piezas únicas hechas a mano entre $ 75.000 y $ 380.000 (Jeans, Tops bordados en oro, Chaquetas pintadas y Bolsos), además de servicios de personalización y restauración a medida. ¿Te gustaría que te recomiende una prenda según tu estilo o presupuesto?`
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
  const finMensajesRef = useRef(null)

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

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
