import { useState } from 'react'
import { formatoPrecio } from '../data/productos.js'
import { useBolsa } from '../hooks/useBolsa.js'

export default function Bolsa() {
  const {
    abierta, cerrarBolsa, items, codigo, subtotal, descuento, total,
    cambiarCantidad, eliminar, vaciar, aplicarCodigo,
  } = useBolsa()

  const [texto, setTexto] = useState('')
  const [respuesta, setRespuesta] = useState(null)

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

  const finalizar = () => {
    cerrarBolsa()
    window.location.hash = '#/contacto'
  }

  return (
    <>
      <div className={`bolsa-overlay${abierta ? ' abierto' : ''}`} onClick={cerrarBolsa} />

      <aside className={`bolsa-panel${abierta ? ' abierto' : ''}`}>
        <header className="bolsa-header">
          <h2>Tu bolsa</h2>
          <button type="button" className="bolsa-icon-btn" onClick={cerrarBolsa}>
            ✕
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
                      <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>−</button>
                      <span>{item.cantidad}</span>
                      <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                    </div>
                  </div>

                  <div className="bolsa-item-lateral">
                    <button type="button" className="bolsa-icon-btn" onClick={() => eliminar(item.id)}>
                      ✕
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
                  placeholder="Ej. TRAZO10"
                />
                <button type="button" className="bolsa-btn-aplicar" onClick={aplicar}>Aplicar</button>
              </div>
              {respuesta && (
                <p className={`bolsa-mensaje${respuesta.ok ? '' : ' error'}`}>{respuesta.mensaje}</p>
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
