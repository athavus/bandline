import { Router, Request, Response } from "express";
import { prisma } from "@config/prisma";

const router = Router();

function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "Não autenticado, ação não permitida" });
  }
}

router.get("/", ensureAuthenticated, async (req: Request, res: Response) => {
  const user = req.user as { id: number };

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        histories: {
          orderBy: { searchedAt: "desc" },
          take: 10,
        },
        favorites: {
          orderBy: { favoritedAt: "desc" },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json({ profile });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao buscar perfil",
      details: err?.message,
    });
  }
});

router.put("/", ensureAuthenticated, async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  const { username, email, avatarUrl, bio } = req.body;

  try {
    const profile = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bio !== undefined && { bio }),
      },
    });

    res.json({ message: "Perfil atualizado com sucesso", user: profile });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({
      error: "Falha ao atualizar perfil",
      details: err?.message,
    });
  }
});

export default router;
