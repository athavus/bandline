import { User as PrismaUser } from '@prisma/client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string | null; // Adiciona avatarUrl
}

export interface AuthResponse {
  message?: string;
  user?: PublicUser;
  error?: string;
}

// Extensão global do Express
declare global {
  namespace Express {
    interface User extends PrismaUser { }
  }
}

export { };
