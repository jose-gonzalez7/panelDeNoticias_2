const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

async function authenticateUser(email, password) {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Contraseña incorrecta');

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return token;
}

module.exports = { authenticateUser };
