import { formatoPrecio } from '../data/productos.js'
import { useBolsa } from '../hooks/useBolsa.js'

export default function ProductCard({ producto }) {
  const { agregar } = useBolsa()

  return (
    <article className="product-card">
      <div className="image-container">
        <img src={producto.imagen} alt={producto.alt} />
        {producto.custom && <span className="badge-custom">★ Custom</span>}
      </div>
      <div className="product-info">
        <span className="category-label">{producto.categoria}</span>
        <div className="product-footer">
          <span className="product-name">{producto.nombre}</span>
          <span className="product-price">{formatoPrecio(producto.precio)}</span>
        </div>
        <button type="button" className="btn-agregar" onClick={() => agregar(producto.id)}>
          Agregar a la bolsa
        </button>
      </div>
    </article>
  )
}
