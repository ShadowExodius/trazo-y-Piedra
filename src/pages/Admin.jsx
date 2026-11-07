import { useState } from 'react'

export default function Admin() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errorCorreo, setErrorCorreo] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')

  const ingresar = (evento) => {
    evento.preventDefault()

    let valido = true
    setErrorCorreo('')
    setErrorPassword('')

    if (correo.trim() === '') {
      setErrorCorreo('Por favor, ingresa tu correo.')
      valido = false
    }

    if (password.trim() === '') {
      setErrorPassword('Por favor, ingresa tu contraseña.')
      valido = false
    }

    if (!valido) return

    // Validar que sea el usuario y contraseña de Dafne o de Angel
    const correoLimpio = correo.trim().toLowerCase()
    const esDafne = correoLimpio === 'dafne@trazoypiedra.com' && password === 'dafne1234'
    const esAngel = correoLimpio === 'angel@trazoypiedra.com' && password === 'angel1234'

    if (!esDafne && !esAngel) {
      setErrorPassword('Correo o contraseña incorrectos.')
      return
    }

    setAutenticado(true)
    setCargando(true)
    setErrorCarga('')

    fetch('https://trazo-y-piedra.onrender.com/contacto')
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Error al consultar')
        return respuesta.json()
      })
      .then((datos) => setMensajes(datos))
      .catch(() => {
        setErrorCarga('No se pudieron cargar los mensajes. Verifica que el servidor esté encendido.')
      })
      .finally(() => {
        setCargando(false)
      })
  }

  return (
    <main className="admin-seccion">
      {!autenticado ? (
        <div className="admin-caja">
          <div className="admin-encabezado">
            <div className="icono-circulo icono-centrado">
              <img src="imagenes/candado.svg" alt="Icono Candado" />
            </div>
            <h1 className="admin-titulo">Portal del Atelier</h1>
            <p className="admin-subtitulo">Acceso restringido al equipo de Trazo &amp; Piedra.</p>
          </div>

          <form onSubmit={ingresar} noValidate>
            <div className="campo">
              <label htmlFor="correo-admin">CORREO</label>
              <input
                type="email"
                id="correo-admin"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="off"
              />
              {errorCorreo && <span className="error-texto activo">{errorCorreo}</span>}
            </div>

            <div className="campo">
              <label htmlFor="password-admin">CONTRASEÑA</label>
              <input
                type="password"
                id="password-admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword && <span className="error-texto activo">{errorPassword}</span>}
            </div>

            <button type="submit" className="btn-ingresar">INGRESAR</button>
          </form>
        </div>
      ) : (
        <div className="panel-mensajes">
          <h2 className="admin-titulo">Mensajes Recibidos (MongoDB)</h2>
          <p className="admin-subtitulo">Consultas enviadas desde el formulario de contacto.</p>

          {cargando && <p className="admin-subtitulo">Cargando mensajes...</p>}
          {errorCarga && <span className="error-texto activo">{errorCarga}</span>}

          <div className="lista-mensajes">
            {!cargando && !errorCarga && mensajes.length === 0 && (
              <p className="admin-subtitulo">Aún no hay mensajes registrados.</p>
            )}
            {mensajes.map((item, index) => (
              <div className="item-mensaje" key={item._id || index}>
                <h3>{item.asunto}</h3>
                <span>{item.nombre} · {item.correo}</span>
                <p>{item.mensaje}</p>

                {item.bolsa && item.bolsa.length > 0 && (
                  <p>
                    <strong>Pedido en bolsa:</strong>{' '}
                    {item.bolsa.map((p) => `${p.nombre} (x${p.cantidad})`).join(', ')} —{' '}
                    <strong>Total: $ {item.total}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
