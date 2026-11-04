import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// Permitir que el formulario envíe datos al servidor
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
    mensaje: String,
    bolsa: Array,
    total: Number
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
        res.status(500).send('Error al guardar');
    }
});

// 3. Ruta para consultar los mensajes guardados desde el panel Admin
app.get('/contacto', async (req, res) => {
    const mensajes = await Contacto.find();
    res.json(mensajes);
});

// 4. Contexto e instrucciones de marca para el asistente IA de Trazo & Piedra
if (typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile('.env'); } catch {
        try { process.loadEnvFile('../.env'); } catch {}
    }
}
const API_KEY = process.env.GEMINI_API_KEY || "";

const CONTEXTO_MARCA = `Te llamas Aurora y eres la estilista virtual del Atelier "Trazo & Piedra" en Bogotá, Colombia.
Responde siempre en español, de forma breve (máximo 3 o 4 oraciones), cálida, elegante y artesanal.
Lema de la marca: "Una pieza no se compra, se hereda."

Catálogo de productos (precios en pesos colombianos COP):
- Jean vintage Japanese Geisha: $ 120.000 (Categoría: Jeans, personalizable)
- Top Sol de Oro: $ 320.000 (Categoría: Tops, bordado en oro)
- Chaqueta Denim Spider-Man: $ 380.000 (Categoría: Chaquetas, pintada a mano, personalizable)
- Kit Cuidado Ecológico: $ 85.000 (Categoría: Cuidado, para lavar y conservar prendas pintadas o bordadas)
- Tote Bag Naranjas en Flor: $ 75.000 (Categoría: Bolsos, pintado a mano, personalizable)

Servicios del Atelier (se agendan en la sección Contacto):
1. Pintura a mano: motivos florales o figurativos sobre denim.
2. Bordado en oro: aplicaciones de mostacilla, cristal e hilo dorado.
3. Modificación a medida: ajuste de talles, largos y siluetas.
4. Restauración: zurcido visible y bordado de conservación para piezas heredadas.

Información de contacto y beneficios:
- Dirección: Cra. 11 # 84-12, Bogotá, Colombia.
- Horario: Martes a Sábado de 10:00 a 18:00.
- Correo: hola@trazoypiedra.com
- Código de descuento activo en la bolsa de compras: TRAZO10 (10% de descuento).`;

// Respuesta de respaldo basada en las reglas del negocio si la red falla
export function respuestaLocalAtelier(pregunta = '') {
    const texto = pregunta.toLowerCase();

    if (texto.includes('precio') || texto.includes('catalogo') || texto.includes('catálogo') || texto.includes('prenda') || texto.includes('producto') || texto.includes('tienen')) {
        return 'En nuestro catálogo contamos con el Jean vintage Japanese Geisha ($ 120.000), Top Sol de Oro ($ 320.000), Chaqueta Denim Spider-Man ($ 380.000), Kit Cuidado Ecológico ($ 85.000) y el Tote Bag Naranjas en Flor ($ 75.000). Además, puedes usar el código TRAZO10 en tu bolsa para un 10% de descuento.';
    }
    if (texto.includes('servicio') || texto.includes('personaliza') || texto.includes('pint') || texto.includes('bordad') || texto.includes('restaura') || texto.includes('medida')) {
        return 'En nuestro Atelier ofrecemos cuatro oficios artesanales: Pintura a mano sobre denim, Bordado en oro con mostacilla y cristal, Modificación a medida y Restauración de prendas heredadas. Puedes agendar tu consulta desde la sección Contacto.';
    }
    if (texto.includes('cuidado') || texto.includes('lavar') || texto.includes('kit') || texto.includes('conservar')) {
        return 'Para conservar el trazo y el bordado de tus piezas recomendamos lavarlas a mano con agua fría y sin frotar la pintura. Nuestro Kit Cuidado Ecológico ($ 85.000) está formulado especialmente para proteger estas prendas.';
    }
    if (texto.includes('descuento') || texto.includes('codigo') || texto.includes('código') || texto.includes('promo')) {
        return 'Puedes aplicar el código TRAZO10 en tu bolsa de compras para obtener un 10% de descuento en toda tu orden.';
    }
    if (texto.includes('ubicacion') || texto.includes('ubicación') || texto.includes('donde') || texto.includes('dónde') || texto.includes('horario') || texto.includes('bogota') || texto.includes('bogotá') || texto.includes('contacto')) {
        return 'Nuestro Atelier está ubicado en la Cra. 11 # 84-12 en Bogotá, Colombia. Te esperamos de martes a sábado entre las 10:00 y las 18:00, o escríbenos en la sección Contacto.';
    }
    return 'Bienvenido al Atelier Trazo & Piedra, donde cada pieza se pinta y borda a mano para perdurar. Puedo asesorarte sobre nuestro catálogo de denim y prendas ($ 75.000 a $ 380.000), nuestros 4 servicios de personalización y restauración, o el cuidado de tus piezas. ¿Qué te gustaría explorar hoy?';
}

// 5. Ruta para el Chatbot con IA personalizada
app.post('/chat', async (req, res) => {
    const { mensaje } = req.body || {};

    if (!mensaje || !mensaje.trim()) {
        return res.status(400).json({ error: 'Por favor escribe una consulta para el Atelier.' });
    }

    const payload = {
        contents: [
            {
                role: 'user',
                parts: [{ text: `${CONTEXTO_MARCA}\n\nConsulta del cliente: ${mensaje.trim()}` }]
            }
        ]
    };

    const urls = [
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
    ];

    for (const endpoint of urls) {
        try {
            const respuesta = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                const textoIA = datos?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textoIA) {
                    return res.json({ respuesta: textoIA });
                }
            }
        } catch (err) {
            console.log('Intento IA fallido:', err.message);
        }
    }

    // Si la red externa no responde, responde con el conocimiento del Atelier
    return res.json({ respuesta: respuestaLocalAtelier(mensaje) });
});
