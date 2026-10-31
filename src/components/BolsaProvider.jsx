import { useState } from 'react'
import { productos, codigosDescuento } from '../data/productos.js'
import { BolsaContext } from '../hooks/bolsaContext.js'

export default function BolsaProvider({ children }) {
  const [items, setItems] = useState([])
  const [codigo, setCodigo] = useState(null)
  const [abierta, setAbierta] = useState(false)

  const abrirBolsa = () => setAbierta(true)
  const cerrarBolsa = () => setAbierta(false)

  // Agregar un producto a la bolsa
  const agregar = (id) => {
    const producto = productos.find((p) => p.id === id)
    const existe = items.find((i) => i.id === id)

    if (existe) {
      setItems(items.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i)))
    } else {
      setItems([...items, { ...producto, cantidad: 1 }])
    }
    setAbierta(true)
  }

  // Cambiar la cantidad de un producto (+ / -)
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return
    setItems(items.map((i) => (i.id === id ? { ...i, cantidad: nuevaCantidad } : i)))
  }

  // Quitar un producto de la bolsa
  const eliminar = (id) => {
    setItems(items.filter((i) => i.id !== id))
  }

  // Vaciar toda la bolsa
  const vaciar = () => {
    setItems([])
    setCodigo(null)
  }

  // Aplicar cupón de descuento
  const aplicarCodigo = (texto) => {
    const limpio = texto.trim().toUpperCase()
    if (!codigosDescuento[limpio]) {
      return { ok: false, mensaje: 'Este código no es válido.' }
    }
    setCodigo(limpio)
    return { ok: true, mensaje: `Código ${limpio} aplicado: ${codigosDescuento[limpio]} % de descuento.` }
  }

  // Cálculos de totales
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const porcentaje = codigo ? codigosDescuento[codigo] : 0
  const descuento = Math.round((subtotal * porcentaje) / 100)
  const total = subtotal - descuento
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0)

  const valor = {
    items,
    codigo,
    subtotal,
    descuento,
    total,
    cantidadTotal,
    abierta,
    abrirBolsa,
    cerrarBolsa,
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar,
    aplicarCodigo,
  }

  return <BolsaContext.Provider value={valor}>{children}</BolsaContext.Provider>
}
