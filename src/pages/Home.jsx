import { categoriasHome } from '../data/productos.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="subtitle">EDICIÓN PRIMAVERA · 2026</span>
          <h2 className="hero-title">
            El trazo de la mano, <em>la piedra</em> que perdura
          </h2>
          <p className="hero-description">
            Denim pintado a mano y piezas bordadas en oro, hechas en pequeñas series por nuestras
            artesanas. Cada prenda nace para una sola persona.
          </p>

          <div className="cta-container">
            <a href="#/catalogo" className="btn-primary">Ver el catálogo &rarr;</a>
            <a href="#/contacto" className="btn-secondary">Personaliza tu pieza</a>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Años de oficio</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1 / 1</span>
              <span className="stat-label">Piezas únicas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Hecho a mano</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img src="/imagenes/imagen1.jpg" alt="Trazo & Piedra - Look 03 Jardín de Rosa" />
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-header">
          <h2>Compra por categoría</h2>
          <a href="#/catalogo" className="view-all-link">VER TODO &rarr;</a>
        </div>

        <div className="categories-grid">
          {categoriasHome.map((c) => (
            <a href="#/catalogo" className="category-item" key={c.label}>
              <div className="category-circle">
                <img src={c.imagen} alt={c.alt} />
              </div>
              <span className="category-label-home">{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="promise-section">
        <span className="promise-subtitle">NUESTRA PROMESA</span>
        <blockquote className="promise-quote">
          “Una pieza no se compra, <span className="gold-text">se hereda.</span>”
        </blockquote>
        <p className="promise-description">
          Cada jean lleva el trazo de la mano que lo pintó. Cada bordado, la firma silenciosa de la
          artesana. No producimos en masa — producimos para ti.
        </p>
      </section>
    </>
  )
}
