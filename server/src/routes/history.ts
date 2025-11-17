import { Router, Request, Response } from "express";
import { prisma } from "@config/prisma";

const router = Router();

function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "Não Autenticado" });
  }
}

router.post("/", ensureAuthenticated, async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  const { artistId, artistName } = req.body;

  if (!artistId || !artistName) {
    return res
      .status(400)
      .json({ error: "artistId e artistName são obrigatórios" });
  }

  const history = await prisma.history.create({
    data: {
      userId: user.id,
      artistId,
      artistName,
    },
  });

  res.json({ history });
});

router.get("/", ensureAuthenticated, async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  const histories = await prisma.history.findMany({
    where: { userId: user.id },
    orderBy: { searchedAt: "desc" },
    take: 50,
  });

  res.json({ histories });
});

export default router;
