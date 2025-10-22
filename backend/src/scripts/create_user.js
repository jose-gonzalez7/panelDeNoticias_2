const bcrypt = require('bcrypt');
const prisma = require('../prisma/client'); // ajusta la ruta si es distinta
require('dotenv').config();

async function main() {
  const saltRounds = 10;

  const users = [
    {
      id_usuario: 'admin_01',
      nombre: 'administrador_1',
      email: 'admin@gmail.com',
      rol: 'administrador',
      password: '12345678',
    },
    {
      id_usuario: 'editor_01',
      nombre: 'editor_1',
      email: 'editor@gmail.com',
      rol: 'editor',
      password: '12345678',
    },
    {
      id_usuario: 'profesor_01',
      nombre: 'profesor_1',
      email: 'profesor@gmail.com',
      rol: 'profesor',
      password: '12345678',
    },
  ];

  for (const u of users) {
    const existing = await prisma.usuario.findUnique({
      where: { id_usuario: u.id_usuario },
    });

    if (existing) {
      console.log(`⚠️  El usuario ${u.nombre} (${u.email}) ya existe.`);
      continue;
    }

    const password_hash = await bcrypt.hash(u.password, saltRounds);

    const user = await prisma.usuario.create({
      data: {
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        password_hash,
      },
    });

    console.log(`✅ Usuario creado: ${user.nombre} (${user.email})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
