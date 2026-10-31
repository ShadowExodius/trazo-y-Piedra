import { useCallback, useEffect, useMemo, useState } from 'react'
import { productos, codigosDescuento } from '../data/productos.js'
import { BolsaContext } from '../hooks/bolsaContext.js'

// Estado global de la bolsa. Solo guarda { id, cantidad } y resuelve nombre, precio e imagen
// desde el catálogo (src/data/productos.js), así que si cambias un precio allí, la bolsa se actualiza.

const CLAVE = 'trazo-y-piedra:bolsa'

const leerGuardado = () => {
  try {
    const data = JSON.parse(localStorage.getItem(CLAVE))
    return {
      lineas: (data?.lineas ?? []).filter((l) => productos.some((p) => p.id === l.id)),
      codigo: data?.codigo && codigosDescuento[data.codigo] ? data.codigo : null,
    }
  } catch {
    return { lineas: [], codigo: null }
  }
}

export default function BolsaProvider({ children }) {
  const [{ lineas, codigo }, setEstado] = useState(leerGuardado)
  const [abierta, setAbierta] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ lineas, codigo }))
    } catch {
      /* almacenamiento no disponible: la bolsa funciona igual en memoria */
    }
  }, [lineas, codigo])

  const abrirBolsa = useCallback(() => setAbierta(true), [])
  const cerrarBolsa = useCallback(() => setAbierta(false), [])

  const agregar = useCallback((id) => {
    setEstado((e) => {
      const existe = e.lineas.some((l) => l.id === id)
      const lineas = existe
        ? e.lineas.map((l) => (l.id === id ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...e.lineas, { id, cantidad: 1 }]
      return { ...e, lineas }
    })
    setAbierta(true)
  }, [])

  const cambiarCantidad = useCallback((id, cantidad) => {
    setEstado((e) => ({
      ...e,
      lineas: e.lineas.map((l) => (l.id === id ? { ...l, cantidad: Math.max(1, cantidad) } : l)),
    }))
  }, [])

  const eliminar = useCallback((id) => {
    setEstado((e) => ({ ...e, lineas: e.lineas.filter((l) => l.id !== id) }))
  }, [])

  const vaciar = useCallback(() => setEstado({ lineas: [], codigo: null }), [])

  const aplicarCodigo = useCallback((texto) => {
    const limpio = texto.trim().toUpperCase()
    if (!codigosDescuento[limpio]) {
      return { ok: false, mensaje: 'Este código no es válido.' }
    }
    setEstado((e) => ({ ...e, codigo: limpio }))
    return { ok: true, mensaje: `Código ${limpio} aplicado: ${codigosDescuento[limpio]} % de descuento.` }
  }, [])

  const valor = useMemo(() => {
    const items = lineas.map((l) => ({ ...productos.find((p) => p.id === l.id), cantidad: l.cantidad }))
    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
    const porcentaje = codigo ? codigosDescuento[codigo] : 0
    const descuento = Math.round((subtotal * porcentaje) / 100)
    return {
      items,
      codigo,
      subtotal,
      descuento,
      total: subtotal - descuento,
      cantidadTotal: items.reduce((acc, i) => acc + i.cantidad, 0),
      abierta,
      abrirBolsa,
      cerrarBolsa,
      agregar,
      cambiarCantidad,
      eliminar,
      vaciar,
      aplicarCodigo,
    }
  }, [lineas, codigo, abierta, abrirBolsa, cerrarBolsa, agregar, cambiarCantidad, eliminar, vaciar, aplicarCodigo])

  return <BolsaContext.Provider value={valor}>{children}</BolsaContext.Provider>
}
