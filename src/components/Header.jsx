import { useBolsa } from '../hooks/useBolsa.js'

export default function Header({ ruta }) {
  const { cantidadTotal, abrirBolsa } = useBolsa()
  const activo = (r) => (ruta === r ? 'active' : undefined)

  return (
    <header className="main-header">
      <ul className="nav-links">
        <li><a href="#/" className={activo('/')}>Home</a></li>
        <li><a href="#/catalogo" className={activo('/catalogo')}>Catálogo</a></li>
        <li><a href="#/">Servicios</a></li>
      </ul>

      <div className="logo">
        <a href="#/"><img src="/imagenes/trazo-piedra-logo.png" alt="Trazo & Piedra Logo" /></a>
      </div>

      <ul className="nav-links">
        <li><a href="#/contacto" className={activo('/contacto')}>Contacto</a></li>
        <li><a href="#/">Admin</a></li>
        <li>
          <button type="button" className="nav-bolsa" onClick={abrirBolsa}>
            Bolsa ({cantidadTotal})
          </button>
        </li>
      </ul>
    </header>
  )
}
