const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

//funcion para generar un token JWT
const generateToken=(payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // token valido para una hora 
}

//Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = decoded; //añade la imformacion de usuario a la peticion
        next(); // permite que la peticion continue
    } catch (error) {
        res.status(401).json({ message: 'token invalido' });
    }
};

module.exports = { 
    generateToken,
    verifyToken 
};
