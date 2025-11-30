import { Router, Request, Response } from "express";
import { prisma } from "@config/prisma";
import { create } from "node:domain";

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

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      histories: true,
      favorites: true,
    },
  });

  res.json({ profile });
});

router.put("/", ensureAuthenticated, async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  const { username, email, avatarUrl } = req.body;

  try {
    const profile = await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        email,
        avatarUrl,
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
