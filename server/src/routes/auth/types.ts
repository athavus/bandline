// routes/auth/types.ts
import { User as PrismaUser } from '@prisma/client';

// Todos os tipos da rota auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: PublicUser;
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
}

// Extensão global do Express
declare global {
  namespace Express {
    interface User extends PrismaUser { }
  }
}

export { };
