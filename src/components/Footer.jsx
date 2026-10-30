export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>Trazo &amp; Piedra</h2>
          <p>
            Moda artesanal de lujo. Denim pintado a mano y piezas bordadas, hechas en pequeñas
            series por nuestras artesanas.
          </p>
        </div>

        <div className="footer-nav-col">
          <h3>Atelier</h3>
          <ul>
            <li><a href="#/catalogo">Catálogo</a></li>
            <li><a href="#/contacto">Personalización</a></li>
            <li><a href="#/">Cuidado de la prenda</a></li>
            <li><a href="#/">Historia</a></li>
          </ul>
        </div>

        <div className="footer-nav-col">
          <h3>Contacto</h3>
          <ul>
            <li><a href="mailto:contactotrazoypiedra@gmail.com">contactotrazoypiedra@gmail.com</a></li>
            <li>+57 311 000 0000</li>
            <li>Barranquilla · Colombia</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 TRAZO &amp; PIEDRA · HECHO A MANO</p>
      </div>
    </footer>
  )
}
