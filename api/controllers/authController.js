import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                nombre: user.username,
                correo: user.email,
                roles: user.roles,
                token: generateToken(user._id, user.roles),
            });
        } else {
            res.status(400).json({ mensaje: 'Credenciales incorrectas. ¡Intenta de nuevo! 😅' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.', error: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { username, email, password, roles } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ mensaje: '¡Este usuario ya existe! Prueba con otro correo.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            roles: roles || ['contributor']
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                nombre: user.username,
                correo: user.email,
                roles: user.roles,
                token: generateToken(user._id, user.roles),
            });
        } else {
            res.status(400).json({ mensaje: 'Datos de usuario inválidos. Revisa e intenta de nuevo.' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.', error: error.message });
    }
};

// Generate JWT
const generateToken = (id, roles) => {
    return jwt.sign({ id, roles }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
