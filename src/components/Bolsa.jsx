import { useEffect, useRef, useState } from 'react'
import { formatoPrecio } from '../data/productos.js'
import { useBolsa } from '../hooks/useBolsa.js'

const IconoCerrar = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
)

export default function Bolsa() {
  const {
    abierta, cerrarBolsa, items, codigo, subtotal, descuento, total,
    cambiarCantidad, eliminar, vaciar, aplicarCodigo,
  } = useBolsa()

  const [texto, setTexto] = useState('')
  const [respuesta, setRespuesta] = useState(null)
  const botonCerrar = useRef(null)

  // Escape cierra, el scroll de la página se bloquea y el foco pasa al panel
  useEffect(() => {
    if (!abierta) return
    const alTeclear = (e) => e.key === 'Escape' && cerrarBolsa()
    window.addEventListener('keydown', alTeclear)
    document.body.style.overflow = 'hidden'
    botonCerrar.current?.focus()
    return () => {
      window.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = ''
    }
  }, [abierta, cerrarBolsa])

  const aplicar = () => {
    if (!texto.trim()) return
    const r = aplicarCodigo(texto)
    setRespuesta(r)
    if (r.ok) setTexto('')
  }

  const vaciarTodo = () => {
    vaciar()
    setRespuesta(null)
  }

  // Aún no hay checkout: lleva al formulario de contacto, donde se coordinan envío y personalización
  const finalizar = () => {
    cerrarBolsa()
    window.location.hash = '#/contacto'
  }

  return (
    <>
      <div className={`bolsa-overlay${abierta ? ' abierto' : ''}`} onClick={cerrarBolsa} />

      <aside
        className={`bolsa-panel${abierta ? ' abierto' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tu bolsa"
        aria-hidden={!abierta}
        inert={!abierta}
      >
        <header className="bolsa-header">
          <h2>Tu bolsa</h2>
          <button ref={botonCerrar} type="button" className="bolsa-icon-btn" onClick={cerrarBolsa} aria-label="Cerrar bolsa">
            <IconoCerrar />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="bolsa-vacia">
            <em>Vacía</em>
            <p>Tu bolsa espera su primera pieza hecha a mano.</p>
            <a href="#/catalogo" className="btn-secondary" onClick={cerrarBolsa}>Ver el catálogo</a>
          </div>
        ) : (
          <>
            <div className="bolsa-items">
              {items.map((item) => (
                <article className="bolsa-item" key={item.id}>
                  <img className="bolsa-item-img" src={item.imagen} alt={item.alt} />

                  <div>
                    <h3 className="bolsa-item-nombre">{item.nombre}</h3>
                    <p className="bolsa-item-precio">{formatoPrecio(item.precio)}</p>
                    <div className="bolsa-cantidad">
                      <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1} aria-label="Disminuir cantidad">−</button>
                      <span aria-live="polite">{item.cantidad}</span>
                      <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} aria-label="Aumentar cantidad">+</button>
                    </div>
                  </div>

                  <div className="bolsa-item-lateral">
                    <button type="button" className="bolsa-icon-btn" onClick={() => eliminar(item.id)} aria-label={`Quitar ${item.nombre}`}>
                      <IconoCerrar size={14} />
                    </button>
                    <span className="bolsa-item-total">{formatoPrecio(item.precio * item.cantidad)}</span>
                  </div>
                </article>
              ))}
            </div>

            <footer className="bolsa-pie">
              <label className="bolsa-etiqueta" htmlFor="codigo-descuento">Código de descuento</label>
              <div className="bolsa-descuento">
                <input
                  id="codigo-descuento"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && aplicar()}
                  placeholder="Ej. TRAZO10"
                />
                <button type="button" className="bolsa-btn-aplicar" onClick={aplicar}>Aplicar</button>
              </div>
              {respuesta && (
                <p className={`bolsa-mensaje${respuesta.ok ? '' : ' error'}`} role="status">{respuesta.mensaje}</p>
              )}

              <div className="bolsa-fila">
                <span className="bolsa-etiqueta">Subtotal</span>
                <span className="bolsa-valor">{formatoPrecio(subtotal)}</span>
              </div>
              {descuento > 0 && (
                <div className="bolsa-fila">
                  <span className="bolsa-etiqueta">Descuento ({codigo})</span>
                  <span className="bolsa-valor ahorro">− {formatoPrecio(descuento)}</span>
                </div>
              )}
              <div className="bolsa-fila">
                <span className="bolsa-etiqueta">Total</span>
                <span className="bolsa-valor total">{formatoPrecio(total)}</span>
              </div>

              <p className="bolsa-nota">Envío y personalización se calculan al finalizar la compra.</p>

              <button type="button" className="bolsa-btn-finalizar" onClick={finalizar}>Finalizar compra</button>
              <button type="button" className="bolsa-btn-vaciar" onClick={vaciarTodo}>Vaciar bolsa</button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
