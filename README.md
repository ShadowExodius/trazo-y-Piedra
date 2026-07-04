# trazo-y-piedra

## Descripcion
 
 Somos una marca exclusiva de moda artística dedicada al diseño y confección de prendas ready-to-wear (listas para usar), donde cada pieza se transforma en una obra de arte portable. Nuestro concepto fusiona la moda urbana y la alta costura a través de dos líneas distintivas: por un lado, diseños de autor pintados minuciosamente a mano con pintura textil de alta calidad; por el otro, meticulosas intervenciones con pedrería y bordados en piedra que aportan relieve, brillo y texturas únicas. Esta combinación de técnicas artesanales da como resultado colecciones irrepetibles y con carácter, ideales para quienes buscan vestir con autenticidad, elegancia y un marcado sentido artístico.

## Flujo Principal
1. El usuario ingresa a la pagina web
2. usuario ve el catalogo
3. usuario ingresa (dato)
4. el sistema verifica si hay stock
5. Si Hay Stock: Stock disponible
6. Si No Hay Stock: pedir encargo 

## Pseudocodigo

INICIO

    // 1 y 2. El usuario ingresa y ve el catálogo
    MOSTRAR "Bienvenido a la página web"
    MOSTRAR catalogo_productos
    
    // 3. El usuario ingresa un dato (por ejemplo, el producto que quiere comprar)
    MOSTRAR "Por favor, ingrese el producto que desea:"
    LEER producto_seleccionado
    
    // 4. El sistema verifica si hay stock
    cantidad_disponible = consultar_stock(producto_seleccionado)
    
    // 5 y 6. Condicional para verificar el stock
    SI cantidad_disponible > 0 ENTONCES
        MOSTRAR "Stock disponible. Puede proceder con la compra."
    SINO
        MOSTRAR "No hay stock de este artículo. ¿Desea pedir un encargo?"
        LEER respuesta_usuario
        
        SI respuesta_usuario == "si" ENTONCES
            EJECUTAR registrar_encargo(producto_seleccionado)
            MOSTRAR "Encargo registrado con éxito."
        SINO
            MOSTRAR "Proceso cancelado."
        FIN_SI
    FIN_SI

FIN
