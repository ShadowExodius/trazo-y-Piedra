// Filtro de productos por categoría en el catálogo
const botones = document.querySelectorAll('.filter-btn');
const productos = document.querySelectorAll('.product-card');

botones.forEach(function (boton) {
  boton.addEventListener('click', function () {
    // 1. Marcar como activo solo el botón presionado
    botones.forEach(function (b) { b.classList.remove('active'); });
    boton.classList.add('active');

    const categoriaElegida = boton.textContent.trim();

    // 2. Mostrar u ocultar cada tarjeta según su categoría
    productos.forEach(function (producto) {
      const categoriaProducto = producto.querySelector('.category-label').textContent.trim();

      if (categoriaElegida === 'Todo' || categoriaProducto === categoriaElegida) {
        producto.style.display = 'flex';
      } else {
        producto.style.display = 'none';
      }
    });
  });
});
