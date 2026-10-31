import { useEffect, useState } from 'react'

// Router mínimo por hash (#/catalogo). Sin dependencias y funciona en cualquier hosting estático.
const RUTAS = ['/', '/catalogo', '/contacto']

function leerRuta() {
  const ruta = window.location.hash.replace(/^#/, '') || '/'
  return RUTAS.includes(ruta) ? ruta : '/'
}

export function useHashRoute() {
  const [ruta, setRuta] = useState(leerRuta)

  useEffect(() => {
    const alCambiar = () => {
      setRuta(leerRuta())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  return ruta
}
