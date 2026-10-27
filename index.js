const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Permitir que el formulario HTML envíe datos al servidor
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const url = "mongodb+srv://dafnealvearm_db_user:dafnealvearpasswordkey_123@cluster0.nkozj8q.mongodb.net/?AppName=Cluster0";

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Not connected to MongoDB', error.message));

app.listen(3000, () => console.log('Server is running on port 3000'));

// 1. Definir el esquema (la estructura que tendrán tus documentos)
const usuarioSchema = new mongoose.Schema({
    email: String,
    puntos: Number
});

// 2. Crear el modelo basado en el esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

async function probar() {
    try {
        await Usuario.create({
            email: 'dafnealvearm@gmail.com', 
            puntos: -5
        });
        console.log('¡Usuario guardado con éxito!');
    } catch (err) {
        console.log('No se guardó:', err.message);
    }
}

probar();

// 3. Esquema y modelo para el formulario de contacto
const contactoSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    asunto: String,
    mensaje: String
});

const Contacto = mongoose.model('Contacto', contactoSchema);

// 4. Ruta para recibir los datos del formulario y guardarlos en MongoDB
app.post('/contacto', async (req, res) => {
    try {
        await Contacto.create(req.body);
        console.log('¡Mensaje guardado con éxito!');
        res.send('Guardado');
    } catch (err) {
        console.log('No se guardó:', err.message);
    }
});