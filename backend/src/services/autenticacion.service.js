const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

async function authenticateUser(email, password) {
  //console.log('Datos enviados por el usuario:', email , password );
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Contraseña o usuario incorrecto');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Contraseña o usuario incorrecto');

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    token,
    user: {
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  };
}

module.exports = { authenticateUser };
