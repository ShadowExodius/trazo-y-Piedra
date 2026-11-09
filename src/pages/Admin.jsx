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

    setCargando(true)
    setErrorCarga('')

    // Validar las credenciales en el servidor Backend
    fetch('https://trazo-y-piedra.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Credenciales inválidas')
        setAutenticado(true)
        return fetch('https://trazo-y-piedra.onrender.com/contacto')
      })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Error al consultar')
        return respuesta.json()
      })
      .then((datos) => setMensajes(datos))
      .catch((err) => {
        if (err.message === 'Credenciales inválidas') {
          setErrorPassword('Correo o contraseña incorrectos.')
        } else {
          setErrorPassword('No se pudo conectar con el servidor.')
        }
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

            <button type="submit" className="btn-ingresar" disabled={cargando}>
              {cargando ? 'VALIDANDO...' : 'INGRESAR'}
            </button>
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
