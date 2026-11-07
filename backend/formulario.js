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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

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
const mensajesRespaldo = [];

// 2. Ruta para recibir los datos del formulario y guardarlos en MongoDB
app.post('/contacto', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            await Contacto.create(req.body);
        } else {
            mensajesRespaldo.push({ _id: Date.now().toString(), ...req.body });
        }
        console.log('¡Mensaje guardado con éxito!');
        res.send('Guardado');
    } catch (err) {
        mensajesRespaldo.push({ _id: Date.now().toString(), ...req.body });
        console.log('Guardado en respaldo local:', err.message);
        res.send('Guardado');
    }
});

// 3. Ruta para consultar los mensajes guardados desde el panel Admin
app.get('/contacto', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const mensajes = await Contacto.find();
            return res.json(mensajes);
        }
    } catch {}
    res.json(mensajesRespaldo);
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
    const texto = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|quien eres)/.test(texto)) {
        return '¡Hola! Soy Aurora, estilista de Trazo & Piedra. Estoy aquí para ayudarte a elegir una pieza pintada o bordada a mano, recomendarte un regalo o contarte sobre nuestros servicios de taller. ¿Qué estás buscando hoy?';
    }
    if (texto.includes('gracias') || texto.includes('adios') || texto.includes('chao') || texto.includes('perfecto') || texto.includes('genial')) {
        return 'Con todo el gusto. Recuerda que en Trazo & Piedra cada pieza nace para una sola persona. Si deseas encargar o personalizar la tuya, te esperamos en la sección Contacto o con el código TRAZO10 en tu bolsa.';
    }
    if (texto.includes('chaqueta') || texto.includes('spider')) {
        return 'Nuestra Chaqueta Denim Spider-Man tiene un valor de $ 380.000 COP. Es una pieza intervenida a mano y 100% personalizable; podemos adaptarle detalles o crear un motivo exclusivo para ti.';
    }
    if (texto.includes('jean') || texto.includes('geisha') || texto.includes('pantalon')) {
        return 'El Jean vintage Japanese Geisha cuesta $ 120.000 COP. Es un denim intervenido a mano con inspiración japonesa y admite personalización en el taller.';
    }
    if (texto.includes('top') || texto.includes('sol de oro') || texto.includes('blusa') || texto.includes('camiseta')) {
        return 'El Top Sol de Oro tiene un precio de $ 320.000 COP. Lleva bordado artesanal con hilo dorado, mostacilla y cristal hecho por nuestras artesanas.';
    }
    if (texto.includes('bolso') || texto.includes('tote') || texto.includes('naranja')) {
        return 'El Tote Bag Naranjas en Flor cuesta $ 75.000 COP. Es pintado a mano, ligero, resistente y personalizable; una opción encantadora para uso diario o para regalar.';
    }
    if (texto.includes('recomienda') || texto.includes('regalo') || texto.includes('ocasion') || texto.includes('estilo') || texto.includes('look') || texto.includes('comprar')) {
        return 'Si buscas un detalle accesible y único, te sugiero el Tote Bag Naranjas en Flor ($ 75.000) o el Jean Japanese Geisha ($ 120.000). Si prefieres una pieza protagonista de alta costura artesanal, el Top Sol de Oro ($ 320.000) o la Chaqueta Denim ($ 380.000) son inolvidables.';
    }
    if (texto.includes('talla') || texto.includes('envio') || texto.includes('domicilio') || texto.includes('demora') || texto.includes('entrega') || texto.includes('pago')) {
        return 'Como trabajamos piezas hechas a mano y series 1/1, adaptamos las tallas y siluetas a tu medida. Realizamos envíos a toda Colombia desde Bogotá y calculamos el envío y la personalización al finalizar tu pedido en Contacto.';
    }
    if (texto.includes('cuidado') || texto.includes('cuido') || texto.includes('lavar') || texto.includes('kit') || texto.includes('conservar')) {
        return 'Para conservar el trazo y el bordado de tus piezas recomendamos lavarlas a mano con agua fría y sin frotar la pintura. Nuestro Kit Cuidado Ecológico ($ 85.000) está formulado especialmente para proteger estas prendas.';
    }
    if (texto.includes('servicio') || texto.includes('personaliza') || texto.includes('pint') || texto.includes('bordad') || texto.includes('restaura') || texto.includes('medida')) {
        return 'En nuestro Atelier ofrecemos cuatro oficios artesanales: Pintura a mano sobre denim, Bordado en oro con mostacilla y cristal, Modificación a medida y Restauración de prendas heredadas. Puedes agendar tu consulta desde la sección Contacto.';
    }
    if (texto.includes('descuento') || texto.includes('codigo') || texto.includes('promo')) {
        return 'Puedes aplicar el código TRAZO10 en tu bolsa de compras para obtener un 10% de descuento en toda tu orden.';
    }
    if (texto.includes('ubicacion') || texto.includes('donde') || texto.includes('horario') || texto.includes('bogota') || texto.includes('contacto') || texto.includes('direccion') || texto.includes('correo')) {
        return 'Nuestro Atelier está ubicado en la Cra. 11 # 84-12 en Bogotá, Colombia. Te esperamos de martes a sábado entre las 10:00 y las 18:00, o escríbenos a hola@trazoypiedra.com.';
    }
    if (texto.includes('precio') || texto.includes('catalogo') || texto.includes('prenda') || texto.includes('producto') || texto.includes('tienen') || texto.includes('cuanto') || texto.includes('valor')) {
        return 'En nuestro catálogo contamos con el Jean vintage Japanese Geisha ($ 120.000), Top Sol de Oro ($ 320.000), Chaqueta Denim Spider-Man ($ 380.000), Kit Cuidado Ecológico ($ 85.000) y el Tote Bag Naranjas en Flor ($ 75.000). Además, puedes usar el código TRAZO10 en tu bolsa para un 10% de descuento.';
    }
    return `Como estilista de Trazo & Piedra te cuento que trabajamos piezas únicas hechas a mano entre $ 75.000 y $ 380.000 (Jeans, Tops bordados en oro, Chaquetas pintadas y Bolsos), además de servicios de personalización y restauración a medida. ¿Te gustaría que te recomiende una prenda según tu estilo o presupuesto?`;
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
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
    ];

    if (API_KEY) {
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
                } else {
                    const detalle = await respuesta.text();
                    console.log(`Aviso API IA (${respuesta.status}):`, detalle.slice(0, 180));
                }
            } catch (err) {
                console.log('Intento IA fallido:', err.message);
            }
        }
    }

    // Si la llave no está activa o la red externa falla, responde con el motor del Atelier
    return res.json({ respuesta: respuestaLocalAtelier(mensaje) });
});
