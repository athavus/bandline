import bcrypt from "bcryptjs";
import { testPrisma } from "./test-setup";
import type { Request } from "express";

export interface TestUser {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  provider: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

/**
 * Cria um usuário de teste no banco de dados
 */
export async function createTestUser(
  data: {
    username: string;
    email: string;
    password?: string;
    provider?: string;
    avatarUrl?: string | null;
    bio?: string | null;
  },
): Promise<TestUser> {
  const passwordHash = data.password
    ? await bcrypt.hash(data.password, 10)
    : "";

  return await testPrisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      provider: data.provider || "local",
      avatarUrl: data.avatarUrl || null,
      bio: data.bio || null,
    },
  });
}

/**
 * Cria um mock de request autenticado
 */
export function createAuthenticatedRequest(user: TestUser): Partial<Request> {
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    isAuthenticated: () => true,
  } as Partial<Request>;
}

/**
 * Cria um mock de request não autenticado
 */
export function createUnauthenticatedRequest(): Partial<Request> {
  return {
    user: undefined,
    isAuthenticated: () => false,
  } as Partial<Request>;
}
