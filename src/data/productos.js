export const categorias = ['Todo', 'Jeans', 'Tops', 'Chaquetas', 'Bolsos', 'Cuidado']

export const productos = [
  { id: 1, nombre: 'Jean vintage Japanese Geisha', categoria: 'Jeans', precio: 120000, imagen: '/imagenes/jean-geisha.jpg', alt: 'Jean vintage Japanese Geisha', custom: true },
  { id: 2, nombre: 'Top Sol de Oro', categoria: 'Tops', precio: 320000, imagen: '/imagenes/camisetasol.jpg', alt: 'Top Sol de Oro', custom: false },
  { id: 3, nombre: 'Chaqueta Denim Spider-Man', categoria: 'Chaquetas', precio: 380000, imagen: '/imagenes/chaqueta-jean-pintada.jpg', alt: 'Chaqueta Denim Spider-Man', custom: true },
  { id: 4, nombre: 'Kit Cuidado Ecológico', categoria: 'Cuidado', precio: 85000, imagen: '/imagenes/kit-cuidado.jpg', alt: 'Kit de Cuidado de Prendas Biogar', custom: false },
  { id: 5, nombre: 'Tote Bag Naranjas en Flor', categoria: 'Bolsos', precio: 75000, imagen: '/imagenes/bolso-pintado.jpg', alt: 'Bolso Pintado Naranjas', custom: true },
]

// Códigos de descuento: CÓDIGO EN MAYÚSCULAS -> porcentaje. Edita aquí para crear nuevos.
export const codigosDescuento = {
  TRAZO10: 10,
}

export const categoriasHome = [
  { label: 'NEW', imagen: '/imagenes/new.jpg', alt: 'New' },
  { label: 'JEANS', imagen: '/imagenes/jeans.jpg', alt: 'Jeans' },
  { label: 'TOPS', imagen: '/imagenes/tops.jpg', alt: 'Tops' },
  { label: 'SHORTS', imagen: '/imagenes/shorts.jpeg', alt: 'Shorts' },
  { label: 'CHAQUETAS', imagen: '/imagenes/chaqueta.jpg', alt: 'Chaquetas' },
  { label: 'KIT DE CUIDADO', imagen: '/imagenes/kit.jpg', alt: 'Kit de Cuidado' },
]

export const formatoPrecio = (n) => `$ ${n.toLocaleString('es-CO')}`
