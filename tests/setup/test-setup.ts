import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

// Garantir ambiente de teste
process.env.NODE_ENV = "test";

// Criar instância do Prisma para testes
// Usa DATABASE_URL do ambiente ou padrão de teste
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        process.env.TEST_DATABASE_URL ||
        "postgresql://test:test@localhost:5432/test",
    },
  },
});

// Substitui o prisma do servidor pelo prisma de teste em todos os módulos
vi.mock("../../server/src/config/prisma", () => ({
  prisma: testPrisma,
}));

// Limpar banco antes de cada teste

// Limpar banco antes de cada teste
beforeEach(async () => {
  // Deletar em ordem para respeitar constraints de foreign key via transação
  await testPrisma.$transaction([
    testPrisma.history.deleteMany(),
    testPrisma.favorites.deleteMany(),
    testPrisma.completedAlbums.deleteMany(),
    testPrisma.user.deleteMany(),
  ]);
});

// Fechar conexão após todos os testes
afterAll(async () => {
  await testPrisma.$disconnect();
});
