import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { PrismaClient } from "@prisma/client";

// Criar instância do Prisma para testes
// Usa DATABASE_URL do ambiente ou padrão de teste
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || "postgresql://test:test@localhost:5432/test",
    },
  },
});

// Limpar banco antes de cada teste
beforeEach(async () => {
  // Deletar em ordem para respeitar constraints de foreign key
  await testPrisma.history.deleteMany();
  await testPrisma.favorites.deleteMany();
  await testPrisma.completedAlbums.deleteMany();
  await testPrisma.user.deleteMany();
});

// Fechar conexão após todos os testes
afterAll(async () => {
  await testPrisma.$disconnect();
});
