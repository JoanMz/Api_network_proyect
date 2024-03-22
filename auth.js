// middleware/auth.js

const jwt = require('jsonwebtoken');
const secretKey = 'admin'; // Aquí deberías utilizar una clave secreta segura

function verificarToken(req, res, next) {
    // Obtener el token JWT de las cabeceras de autorización
    const token = req.headers.authorization;

    // Verificar si el token no está presente
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso no autorizado. Token no proporcionado.' });
    }

    // Verificar la validez del token
    jwt.verify(token, secretKey, (err, decoded) => {
        // Si hay un error en la verificación del token
        if (err) {
            return res.status(401).json({ mensaje: 'Acceso no autorizado. Token inválido.' });
        }
        // Si el token es válido, almacenar los datos decodificados en el objeto 'administrador' en la solicitud
        req.administrador = decoded.administrador;
        // Continuar con el siguiente middleware o controlador
        next();
    });
}

module.exports = verificarToken;
