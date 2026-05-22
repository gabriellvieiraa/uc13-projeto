import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@admin.com";

  // Verifica se o usuário administrador já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log("Usuário administrador já existe no banco de dados. Ignorando criação...");
    return;
  }

  // Gera o hash da senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  // Cria o administrador
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      cpf: "12345678901",
      email: adminEmail,
      password: hashedPassword,
      type: "ADMIN",
      status: "ATIVO",
      birthDate: new Date("1991-03-15T00:00:00.000Z")
    }
  });

  console.log(`Usuário administrador criado com sucesso! Email: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("Erro durante o processo de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
