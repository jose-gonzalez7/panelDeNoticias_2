const usuarioService = require("../services/usuarioService");

async function getAllUsers(req, res) {
  console.log('=== 🔹 Solicitud GET /usuarios 🔹 ===');
  console.log('Usuario que hace la petición:', req.user); // del middleware verifyToken

  try {
    const users = await usuarioService.listUsers();

    // 🔹 Debug: mostrar lista de usuarios obtenida
    console.log('Usuarios obtenidos:', users);

    res.json({ success: true, users });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
}

async function getAllUsersAdmin(req, res) {
  console.log('=== 🔹 Solicitud GET /usuarios/admin 🔹 ===');
  console.log('Usuario que hace la petición (admin):', req.user);

  try {
    const users = await usuarioService.listUsers();
    console.log('Usuarios obtenidos (admin):', users);

    res.json({ success: true, users });
  } catch (err) {
    console.error('Error al obtener usuarios admin:', err);
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
}

module.exports = { getAllUsers, getAllUsersAdmin };
