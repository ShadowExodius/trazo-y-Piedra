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

const url = "mongodb+srv://shadowexodius:1130270945@cluster0.akadhof.mongodb.net/";

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Not connected to MongoDB', error.message));

app.listen(3000, () => console.log('Server is running on port 3000'));

// 1. Esquema y modelo para el formulario de contacto
const contactoSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    asunto: String,
    mensaje: String
});

const Contacto = mongoose.model('Contacto', contactoSchema);

// 2. Ruta para recibir los datos del formulario y guardarlos en MongoDB
app.post('/contacto', async (req, res) => {
    try {
        await Contacto.create(req.body);
        console.log('¡Mensaje guardado con éxito!');
        res.send('Guardado');
    } catch (err) {
        console.log('No se guardó:', err.message);
    }
});

// 3. Ruta para consultar los mensajes guardados desde el panel Admin
app.get('/contacto', async (req, res) => {
    const mensajes = await Contacto.find();
    res.json(mensajes);
});
