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

  const profile = await prisma.user.findMany({
    whe,
  });

  res.json({ profile });
});

export default router;
