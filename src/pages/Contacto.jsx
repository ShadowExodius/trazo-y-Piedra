import { useEffect, useRef, useState } from 'react'
import FormField from '../components/FormField.jsx'

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VACIO = { nombre: '', correo: '', asunto: '', mensaje: '' }

function validar({ nombre, correo, asunto, mensaje }) {
  const errores = {}
  const n = nombre.trim()
  const c = correo.trim()
  const a = asunto.trim()
  const m = mensaje.trim()

  if (!n) errores.nombre = 'Por favor, ingresa tu nombre completo.'
  else if (n.length < 3) errores.nombre = 'El nombre debe tener mínimo 3 caracteres.'

  if (!c) errores.correo = 'Por favor, ingresa tu correo electrónico.'
  else if (!FORMATO_CORREO.test(c)) errores.correo = 'Ingresa un formato de correo válido (ej: nombre@correo.com).'

  if (!a) errores.asunto = 'Por favor, indica el asunto.'
  else if (a.length < 3) errores.asunto = 'El asunto debe tener al menos 3 caracteres.'

  if (!m) errores.mensaje = 'Por favor, escribe tu mensaje.'
  else if (m.length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'

  return errores
}

// Evidencia del proyecto: guarda los mensajes en el navegador (igual que la versión HTML).
function guardarEnLocalStorage(mensaje) {
  try {
    const guardados = JSON.parse(localStorage.getItem('mensajes_contacto')) || []
    guardados.push(mensaje)
    localStorage.setItem('mensajes_contacto', JSON.stringify(guardados))
  } catch {
    // Si el almacenamiento no está disponible, el formulario igual funciona.
  }
}

export default function Contacto() {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const cambiar = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }))
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }))
  }

  const enviar = (evento) => {
    evento.preventDefault()
    setExito(false)

    const nuevosErrores = validar(valores)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    // Simula el tiempo de respuesta del servidor (1 segundo)
    timers.current.push(
      setTimeout(() => {
        guardarEnLocalStorage({
          nombre: valores.nombre.trim(),
          correo: valores.correo.trim(),
          asunto: valores.asunto.trim(),
          mensaje: valores.mensaje.trim(),
          fecha: new Date().toLocaleString(),
        })
        setValores(VACIO)
        setEnviando(false)
        setExito(true)
        timers.current.push(setTimeout(() => setExito(false), 5000))
      }, 1000),
    )
  }

  return (
    <section className="contacto-seccion">
      <div className="contacto-contenedor">
        <div className="contacto-info">
          <span className="subtitulo">CONVERSEMOS</span>
          <h1 className="titulo-contacto">Escríbenos</h1>

          <p className="descripcion-contacto">
            Para encargos a medida, restauración o visitas al atelier.
            <br />
            Respondemos en menos de 24 horas — siempre desde la mano de una persona.
          </p>

          <div className="info-bloques">
            <div className="info-item">
              <h3>ATELIER</h3>
              <p>Cra. 11 # 84-12, Bogotá, Colombia</p>
            </div>
            <div className="info-item">
              <h3>CORREO</h3>
              <p><a href="mailto:hola@trazoypiedra.com">hola@trazoypiedra.com</a></p>
            </div>
            <div className="info-item">
              <h3>HORARIO</h3>
              <p>Mar — Sáb · 10:00 — 18:00</p>
            </div>
          </div>
        </div>

        <div className="contacto-formulario-caja">
          <form onSubmit={enviar} noValidate>
            <FormField id="nombre" label="NOMBRE" value={valores.nombre} error={errores.nombre} onChange={cambiar} />
            <FormField id="correo" label="CORREO ELECTRÓNICO" tipo="email" value={valores.correo} error={errores.correo} onChange={cambiar} />
            <FormField id="asunto" label="ASUNTO" value={valores.asunto} error={errores.asunto} onChange={cambiar} />
            <FormField id="mensaje" label="MENSAJE" tipo="textarea" rows={4} value={valores.mensaje} error={errores.mensaje} onChange={cambiar} />

            <button type="submit" className="btn-enviar" disabled={enviando}>
              {enviando ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
            </button>

            <div className={`mensaje-exito${exito ? ' activo' : ''}`} role="status">
              ¡Gracias por comunicarte! Tu mensaje ha sido enviado exitosamente. Te responderemos pronto.
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
