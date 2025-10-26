const prisma = require("../prisma/client");

async function listUsers() {
  return await prisma.usuario.findMany({
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      rol: true
    }
  });
}

module.exports = { listUsers };
