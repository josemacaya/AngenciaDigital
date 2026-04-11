const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = "mi_clave_secreta_aiep"; // Clave para firmar los tokens

// Middlewares necesarios
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(cookieParser()); // Permite manejar las Cookies en el servidor

// 1. REQUISITO: Usuarios ficticios para validar credenciales
const usuarios = [
    { username: 'luciano', password: '123' },
    { username: 'aiep', password: '456' }
];


// 2. RUTA DE LOGIN (Pégalo aquí)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usuarioValido = usuarios.find(u => u.username === username && u.password === password);

    if (usuarioValido) {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token_aiep', token, {
            httpOnly: true,
            maxAge: 3600000 
        });
        return res.json({ mensaje: 'Login exitoso', token });
    } else {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
});

// ... (lo que ya tienes abajo)
// Ruta base para probar que el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor Backend AIEP - Activo');
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
