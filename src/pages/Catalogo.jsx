import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { categorias, productos } from '../data/productos.js'

export default function Catalogo() {
  const [filtro, setFiltro] = useState('Todo')

  const visibles =
    filtro === 'Todo' ? productos : productos.filter((p) => p.categoria === filtro)

  return (
    <div className="container">
      <section className="catalog-hero">
        <div className="header-tag">Atelier</div>
        <h1 className="title">El catálogo</h1>
        <p className="subtitle-cat">
          Piezas únicas o personalizables. Cada artículo cuenta una historia.
        </p>
      </section>

      <nav className="filters" aria-label="Filtrar por categoría">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={`filter-btn${filtro === c ? ' active' : ''}`}
            aria-pressed={filtro === c}
            onClick={() => setFiltro(c)}
          >
            {c}
          </button>
        ))}
      </nav>

      <main className="catalog-grid">
        {visibles.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </main>
    </div>
  )
}
