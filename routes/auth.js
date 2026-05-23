const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../Utils/auth');

// Login
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    // Consulta correcta según tu BD
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error del servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = results[0];

        // Comparar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Token
        const token = generateToken({
            id: user.id_usuario,
            usuario: user.usuario
        });

        res.json({
            message: 'Login exitoso' , id_usuario : user.id_usuario, 

            token
        });
    });
});

module.exports = router;