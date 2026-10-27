// Validación sencilla del Portal Admin y carga de datos desde MongoDB
const formularioAdmin = document.getElementById('formulario-admin');
const inputCorreo = document.getElementById('correo');
const inputPassword = document.getElementById('password');
const errorCorreo = document.getElementById('error-correo');
const errorPassword = document.getElementById('error-password');

const cajaLogin = document.getElementById('caja-login');
const panelMensajes = document.getElementById('panel-mensajes');
const listaMensajes = document.getElementById('lista-mensajes');

formularioAdmin.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let valido = true;
    errorCorreo.classList.remove('activo');
    errorPassword.classList.remove('activo');

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

    // 3. Si es válido, ocultamos el login y pedimos los mensajes a MongoDB
    if (valido) {
        cajaLogin.style.display = 'none';
        panelMensajes.style.display = 'block';

        fetch('http://localhost:3000/contacto')
            .then(function (respuesta) {
                return respuesta.json();
            })
            .then(function (mensajes) {
                listaMensajes.innerHTML = '';

                mensajes.forEach(function (item) {
                    listaMensajes.innerHTML += `
                        <div class="item-mensaje">
                            <h3>${item.asunto}</h3>
                            <span>${item.nombre} · ${item.correo}</span>
                            <p>${item.mensaje}</p>
                        </div>
                    `;
                });
            });
    }
});
