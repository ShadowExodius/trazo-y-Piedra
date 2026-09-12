
// PROYECTO: Trazo & Piedra -


// Esperamos a que todo el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {

    // 1. Obtenemos los elementos del formulario por su ID
    const formulario = document.getElementById('formulario-contacto');
    const inputNombre = document.getElementById('nombre');
    const inputCorreo = document.getElementById('correo');
    const inputAsunto = document.getElementById('asunto');
    const inputMensaje = document.getElementById('mensaje');
    
    const btnEnviar = document.getElementById('btn-enviar');
    const mensajeExito = document.getElementById('mensaje-exito');

    // Elementos donde se muestran los mensajes de error
    const errorNombre = document.getElementById('error-nombre');
    const errorCorreo = document.getElementById('error-correo');
    const errorAsunto = document.getElementById('error-asunto');
    const errorMensaje = document.getElementById('error-mensaje');

    // 2. Escuchamos el evento de envío del formulario
    formulario.addEventListener('submit', function (evento) {
        // Evitamos que la página se recargue automáticamente
        evento.preventDefault();

        // Variable bandera para verificar si todos los campos son válidos
        let formularioValido = true;

        // Limpiamos los errores anteriores antes de validar
        limpiarErrores();

        // --- VALIDACIÓN 1: Nombre ---
        if (inputNombre.value.trim() === '') {
            mostrarError(inputNombre, errorNombre, 'Por favor, ingresa tu nombre completo.');
            formularioValido = false;
        } else if (inputNombre.value.trim().length < 3) {
            mostrarError(inputNombre, errorNombre, 'El nombre debe tener mínimo 3 caracteres.');
            formularioValido = false;
        }

        // --- VALIDACIÓN 2: Correo electrónico ---
        // Expresión regular básica para validar el formato de correo
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (inputCorreo.value.trim() === '') {
            mostrarError(inputCorreo, errorCorreo, 'Por favor, ingresa tu correo electrónico.');
            formularioValido = false;
        } else if (!formatoCorreo.test(inputCorreo.value.trim())) {
            mostrarError(inputCorreo, errorCorreo, 'Ingresa un formato de correo válido (ej: nombre@correo.com).');
            formularioValido = false;
        }

        // --- VALIDACIÓN 3: Asunto ---
        if (inputAsunto.value.trim() === '') {
            mostrarError(inputAsunto, errorAsunto, 'Por favor, indica el asunto.');
            formularioValido = false;
        } else if (inputAsunto.value.trim().length < 3) {
            mostrarError(inputAsunto, errorAsunto, 'El asunto debe tener al menos 3 caracteres.');
            formularioValido = false;
        }

        // --- VALIDACIÓN 4: Mensaje ---
        if (inputMensaje.value.trim() === '') {
            mostrarError(inputMensaje, errorMensaje, 'Por favor, escribe tu mensaje.');
            formularioValido = false;
        } else if (inputMensaje.value.trim().length < 10) {
            mostrarError(inputMensaje, errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
            formularioValido = false;
        }

        // --- SI TODO ES CORRECTO ---
        if (formularioValido) {
            // Cambiamos el estado del botón mientras simula el envío
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'ENVIANDO...';

            // Simulamos el tiempo de respuesta del servidor (1 segundo)
            setTimeout(function () {
                
                // Guardamos los datos en un objeto
                const nuevoMensaje = {
                    nombre: inputNombre.value.trim(),
                    correo: inputCorreo.value.trim(),
                    asunto: inputAsunto.value.trim(),
                    mensaje: inputMensaje.value.trim(),
                    fecha: new Date().toLocaleString()
                };

                // Guardamos en LocalStorage para evidencia del proyecto
                guardarEnLocalStorage(nuevoMensaje);

                // Mostramos el mensaje de éxito
                mensajeExito.classList.add('activo');

                // Limpiamos los campos del formulario
                formulario.reset();

                // Restauramos el botón
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'ENVIAR MENSAJE';

                // Ocultamos el mensaje de éxito luego de 5 segundos
                setTimeout(function () {
                    mensajeExito.classList.remove('activo');
                }, 5000);

            }, 1000);
        }
    });

    // 3. Función auxiliar para mostrar un error en pantalla
    function mostrarError(input, elementoTextoError, mensaje) {
        input.classList.add('input-error');
        elementoTextoError.textContent = mensaje;
        elementoTextoError.classList.add('activo');
    }

    // 4. Función auxiliar para limpiar todos los errores
    function limpiarErrores() {
        const inputs = [inputNombre, inputCorreo, inputAsunto, inputMensaje];
        const spanErrores = [errorNombre, errorCorreo, errorAsunto, errorMensaje];

        inputs.forEach(function (campo) {
            campo.classList.remove('input-error');
        });

        spanErrores.forEach(function (span) {
            span.textContent = '';
            span.classList.remove('activo');
        });

        mensajeExito.classList.remove('activo');
    }

    // 5. Limpieza automática del error cuando el usuario escribe en el campo
    const camposFormulario = [inputNombre, inputCorreo, inputAsunto, inputMensaje];
    
    camposFormulario.forEach(function (campo) {
        campo.addEventListener('input', function () {
            if (campo.classList.contains('input-error')) {
                campo.classList.remove('input-error');
                
                // Buscamos el span de error correspondiente por ID
                const spanCorrespondiente = document.getElementById('error-' + campo.id);
                if (spanCorrespondiente) {
                    spanCorrespondiente.textContent = '';
                    spanCorrespondiente.classList.remove('activo');
                }
            }
        });
    });

    // 6. Guardar mensaje en el almacenamiento local del navegador (LocalStorage)
    function guardarEnLocalStorage(mensaje) {
        let mensajesGuardados = JSON.parse(localStorage.getItem('mensajes_contacto')) || [];
        mensajesGuardados.push(mensaje);
        localStorage.setItem('mensajes_contacto', JSON.stringify(mensajesGuardados));
        console.log('Mensaje registrado con éxito:', mensaje);
    }

});
