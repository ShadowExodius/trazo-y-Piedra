import { useState } from 'react'
import { useBolsa } from '../hooks/useBolsa.js'

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contacto() {
  const { items, total, vaciar } = useBolsa()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(false)

  const enviar = (evento) => {
    evento.preventDefault()
    setExito(false)

    const nuevosErrores = {}

    if (nombre.trim() === '') {
      nuevosErrores.nombre = 'Por favor, ingresa tu nombre completo.'
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener mínimo 3 caracteres.'
    }

    if (correo.trim() === '') {
      nuevosErrores.correo = 'Por favor, ingresa tu correo electrónico.'
    } else if (!FORMATO_CORREO.test(correo.trim())) {
      nuevosErrores.correo = 'Ingresa un formato de correo válido (ej: nombre@correo.com).'
    }

    if (asunto.trim() === '') {
      nuevosErrores.asunto = 'Por favor, indica el asunto.'
    } else if (asunto.trim().length < 3) {
      nuevosErrores.asunto = 'El asunto debe tener al menos 3 caracteres.'
    }

    if (mensaje.trim() === '') {
      nuevosErrores.mensaje = 'Por favor, escribe tu mensaje.'
    } else if (mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    }

    setErrores(nuevosErrores)

    // Si hay errores, detenemos el envío
    if (Object.keys(nuevosErrores).length > 0) return

    // Si todo es válido, enviamos a MongoDB (incluyendo la bolsa si tiene productos)
    const nuevoMensaje = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
      bolsa: items,
      total: total,
    }

    fetch('http://localhost:3000/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoMensaje),
    })

    // Limpiamos los campos, vaciamos la bolsa y mostramos el mensaje de éxito
    setNombre('')
    setCorreo('')
    setAsunto('')
    setMensaje('')
    vaciar()
    setExito(true)
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
            {/* Campo Nombre */}
            <div className="campo">
              <label htmlFor="nombre">NOMBRE</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="off"
              />
              {errores.nombre && <span className="error-texto activo">{errores.nombre}</span>}
            </div>

            {/* Campo Correo */}
            <div className="campo">
              <label htmlFor="correo">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="off"
              />
              {errores.correo && <span className="error-texto activo">{errores.correo}</span>}
            </div>

            {/* Campo Asunto */}
            <div className="campo">
              <label htmlFor="asunto">ASUNTO</label>
              <input
                type="text"
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                autoComplete="off"
              />
              {errores.asunto && <span className="error-texto activo">{errores.asunto}</span>}
            </div>

            {/* Campo Mensaje */}
            <div className="campo">
              <label htmlFor="mensaje">MENSAJE</label>
              <textarea
                id="mensaje"
                rows="4"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
              {errores.mensaje && <span className="error-texto activo">{errores.mensaje}</span>}
            </div>

            <button type="submit" className="btn-enviar">
              ENVIAR MENSAJE
            </button>

            <div className={`mensaje-exito${exito ? ' activo' : ''}`}>
              ¡Gracias por comunicarte! Tu mensaje ha sido enviado exitosamente. Te responderemos pronto.
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
