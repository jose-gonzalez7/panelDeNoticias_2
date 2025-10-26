const { authenticateUser } = require('../services/autenticacion.service');

async function login(req, res) {
  const { email, password } = req.body;
  // 🔹 Debug: mostrar datos de la solicitud
  console.log('=== Nueva solicitud de login ===');
  console.log('IP del cliente:', req.ip || req.connection.remoteAddress);
  console.log('Headers:', req.headers);
  console.log('Email recibido:', email);
  console.log('Password recibido:', password ? '*****' : '(vacío)'); // nunca imprimir passwords reales en producción
  console.log('===============================');
  try {
    const {token, user} = await authenticateUser(email, password);
    res.json({ success: true, token , user});
  } catch (err) {
    console.error('Error de autenticación:', err.message);
    res.status(401).json({ success: false, message: err.message });
  }
}

module.exports = { login };
