# Trazo & Piedra (React + Vite)

Sitio Full Stack en React y Express: Home, Catálogo (con filtros y bolsa de compras), Servicios, Contacto (conectado a MongoDB Atlas), Panel Admin y Estilista IA (Aurora).

## Uso

```bash
npm install
npm run dev      # frontend en desarrollo
npm run backend  # servidor backend (puerto 3000)
npm run build    # producción (carpeta dist/)
```

## Estructura

- `src/pages/` Home, Catalogo, Servicios, Contacto, Admin
- `src/components/` Header, Footer, ProductCard, Bolsa, BolsaProvider, Chatbot, AccessibilityWidget
- `src/data/productos.js` productos, categorías y códigos de descuento
- `src/hooks/` `useBolsa.js`, `bolsaContext.js` y `useHashRoute.js`
- `src/styles/global.css` estilos unificados y responsive
- `public/imagenes/` recursos gráficos del Atelier
- `backend/formulario.js` servidor Express, autenticación Admin, conexión a MongoDB y ruta de IA (`/chat`)
