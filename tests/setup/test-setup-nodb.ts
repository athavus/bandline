import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";

// Garantir ambiente de teste
process.env.NODE_ENV = "test";

// Mock do Objecto Prisma (Dummy)
// Isso evita que o PrismaClient tente conectar ao banco
const mockPrisma = {
    $transaction: vi.fn(),
    $disconnect: vi.fn(),
    history: { deleteMany: vi.fn() },
    favorites: { deleteMany: vi.fn() },
    completedAlbums: { deleteMany: vi.fn() },
    user: { deleteMany: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    // Adicione outros modelos conforme necessário para evitar crash
} as any;

export const testPrisma = mockPrisma;

// Substitui o prisma do servidor pelo mock
vi.mock("../../server/src/config/prisma", () => ({
    prisma: mockPrisma,
}));

// Mock do passport para não estourar session sem banco
vi.mock("../../server/src/config/passport", () => {
    return {
        default: {
            initialize: () => (req, res, next) => next(),
            session: () => (req, res, next) => next(),
            authenticate: () => (req, res, next) => next(),
            use: () => { },
            serializeUser: () => { },
            deserializeUser: () => { },
        }
    }
});

beforeEach(() => {
    vi.clearAllMocks();
});
