
const mongoose = require('mongoose');
const usuarioEsquema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [3, 'El nombre debe tener al menos 3 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Por favor ingrese un email válido'
            ]
        },
        rol: {
            type: String,
            enum: {
                values: ['admin', 'usuario'],
                message: 'El rol debe ser admin o usuario'
            },
            default: 'usuario',
            required: true
        },
               puntos: {
            type: Number,
            min: [0, 'Los puntos no pueden ser negativos'],
            default: 0
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);
const Usuario = mongoose.model('Usuario', usuarioEsquema);
module.exports = Usuario;