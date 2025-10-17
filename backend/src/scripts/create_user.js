const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
require('dotenv').config();

async function main() {
  const email = process.env.CREATE_USER_EMAIL || 'admin@example.com';
  const password = process.env.CREATE_USER_PASSWORD || 'password123';
  const nombre = process.env.CREATE_USER_NOMBRE || 'Administrador';
  const rol = process.env.CREATE_USER_ROL || 'admin';

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    console.log('Usuario ya existe:', email);
    return;
  }

  const user = await prisma.usuario.create({
    data: {
      email,
      passwordHash,
      nombre,
      rol,
    },
  });

  console.log('Usuario creado:', { id: user.id, email: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
