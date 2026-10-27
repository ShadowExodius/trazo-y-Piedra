// Validación sencilla del Portal Admin
const formularioAdmin = document.getElementById('formulario-admin');
const inputCorreo = document.getElementById('correo');
const inputPassword = document.getElementById('password');
const errorCorreo = document.getElementById('error-correo');
const errorPassword = document.getElementById('error-password');
const mensajeExito = document.getElementById('mensaje-exito');

formularioAdmin.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let valido = true;
    errorCorreo.classList.remove('activo');
    errorPassword.classList.remove('activo');
    mensajeExito.classList.remove('activo');

    // 1. Validar correo
    if (inputCorreo.value.trim() === '') {
        errorCorreo.textContent = 'Por favor, ingresa tu correo.';
        errorCorreo.classList.add('activo');
        valido = false;
    }

    // 2. Validar contraseña
    if (inputPassword.value.trim() === '') {
        errorPassword.textContent = 'Por favor, ingresa tu contraseña.';
        errorPassword.classList.add('activo');
        valido = false;
    }

    // Si ambos campos están completos
    if (valido) {
        mensajeExito.classList.add('activo');
        formularioAdmin.reset();
    }
});
