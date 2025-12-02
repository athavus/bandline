import { vi } from "vitest";
import { testPrisma } from "./test-setup";

/**
 * Mock do módulo @config/prisma para usar testPrisma nos testes
 */
export function setupPrismaMock() {
  vi.mock("../../server/src/config/prisma", () => ({
    prisma: testPrisma,
  }));
}
