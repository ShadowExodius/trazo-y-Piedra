export default function Servicios() {
  return (
    <main className="servicios-contenedor">
      {/* Título y subtítulo */}
      <section className="servicios-encabezado">
        <div className="header-tag">Atelier</div>
        <h1 className="title">Servicios</h1>
        <p className="subtitle-cat">
          Cuatro oficios que transforman cada pieza en algo profundamente tuyo.
        </p>
      </section>

      {/* Cuadrícula con las 4 tarjetas de servicios */}
      <section className="servicios-grid">
        {/* 1. Pintura a mano */}
        <article className="servicio-card">
          <div className="icono-circulo">
            <img src="imagenes/pincel.svg" alt="Icono Pintura a mano" />
          </div>
          <h2 className="servicio-titulo">Pintura a mano</h2>
          <p className="servicio-descripcion">
            Diseñamos contigo el motivo floral o figurativo y lo pintamos sobre tu denim — único,
            irrepetible.
          </p>
          <a href="#/contacto" className="btn-agendar">AGENDAR CONSULTA &rarr;</a>
        </article>

        {/* 2. Bordado en oro */}
        <article className="servicio-card">
          <div className="icono-circulo">
            <img src="imagenes/bordado.svg" alt="Icono Bordado en oro" />
          </div>
          <h2 className="servicio-titulo">Bordado en oro</h2>
          <p className="servicio-descripcion">
            Aplicaciones de mostacilla, cristal y hilo dorado. Acabados de alta costura sobre piezas
            de uso diario.
          </p>
          <a href="#/contacto" className="btn-agendar">AGENDAR CONSULTA &rarr;</a>
        </article>

        {/* 3. Modificación a medida */}
        <article className="servicio-card">
          <div className="icono-circulo">
            <img src="imagenes/tijeras.svg" alt="Icono Modificación a medida" />
          </div>
          <h2 className="servicio-titulo">Modificación a medida</h2>
          <p className="servicio-descripcion">
            Adaptamos talles, largos y siluetas. Cada cuerpo merece su corte exacto.
          </p>
          <a href="#/contacto" className="btn-agendar">AGENDAR CONSULTA &rarr;</a>
        </article>

        {/* 4. Restauración */}
        <article className="servicio-card">
          <div className="icono-circulo">
            <img src="imagenes/restauracion.svg" alt="Icono Restauración" />
          </div>
          <h2 className="servicio-titulo">Restauración</h2>
          <p className="servicio-descripcion">
            Devolvemos vida a piezas heredadas con técnicas de zurcido visible y bordado de
            conservación.
          </p>
          <a href="#/contacto" className="btn-agendar">AGENDAR CONSULTA &rarr;</a>
        </article>
      </section>
    </main>
  )
}
