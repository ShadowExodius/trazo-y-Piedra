# Trazo & Piedra (React + Vite)

Versión en React del sitio: Home, Catálogo (con filtros) y Contacto (con validación).

## Uso

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción (carpeta dist/)
```

## Estructura

- `src/pages/` Home, Catalogo, Contacto
- `src/components/` Header, Footer, ProductCard, FormField, Bolsa (panel lateral del carrito)
- `src/data/productos.js` productos y categorías y códigos de descuento (edita aquí para agregar prendas o códigos)
- `src/hooks/useBolsa.js` hook de la bolsa; el estado vive en `src/components/BolsaProvider.jsx` (conectado al catálogo, se guarda en localStorage)
- `src/hooks/useHashRoute.js` router mínimo por hash (`#/catalogo`), sin dependencias
- `src/styles/global.css` estilos unificados (misma paleta y tipografías originales)
- `public/imagenes/` imágenes (nombres en minúscula y sin espacios)
