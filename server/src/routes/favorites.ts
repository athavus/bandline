import { Router, Request, Response } from "express";
import { prisma } from "@config/prisma";

const router = Router();

function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (typeof req.isAuthenticated === "function" && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Não Autenticado" });
}

router.post("/", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Não Autenticado" });
    }
    const user = req.user as { id: number };
    const { albumId, albumName, albumImage, albumTracks } = req.body;

    if (!albumId || !albumName) {
      return res.status(400).json({
        error: "albumId e albumName são obrigatórios",
      });
    }

    // Verificar se já existe
    const existing = await prisma.favorites.findFirst({
      where: {
        userId: user.id,
        albumId: albumId,
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Álbum já está nos favoritos",
        favorite: existing,
      });
    }

    // Converter albumTracks para string (número de faixas)
    const trackCount = Array.isArray(albumTracks)
      ? albumTracks.length.toString()
      : (albumTracks || "0").toString();

    // Criar novo favorito
    const favorite = await prisma.favorites.create({
      data: {
        userId: user.id,
        albumId,
        albumName,
        albumImage: albumImage || null,
        albumTracks: trackCount,
      },
    });

    res.json({ favorite, message: "Álbum favoritado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar favorito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post(
  "/check",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Não Autenticado" });
      }
      const user = req.user as { id: number };
      const { albumIds } = req.body;

      if (!albumIds || !Array.isArray(albumIds)) {
        return res.status(400).json({
          error: "albumIds é obrigatório e deve ser um array",
        });
      }

      const favorites = await prisma.favorites.findMany({
        where: {
          userId: user.id,
          albumId: { in: albumIds },
        },
        select: { albumId: true },
      });

      const favoriteIds = favorites.map((f) => f.albumId);
      res.json({ favoriteIds });
    } catch (error) {
      console.error("Erro ao verificar favoritos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

router.delete("/", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Não Autenticado" });
    }
    const user = req.user as { id: number };
    const { albumId } = req.body;

    if (!albumId) {
      return res.status(400).json({
        error: "albumId é obrigatório",
      });
    }

    const deleted = await prisma.favorites.deleteMany({
      where: {
        userId: user.id,
        albumId: albumId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        error: "Favorito não encontrado",
      });
    }

    res.json({ message: "Favorito removido com sucesso", deleted });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Listar favoritos
router.get("/", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number };

    const favorites = await prisma.favorites.findMany({
      where: { userId: user.id },
      orderBy: { favoritedAt: "desc" },
      take: 50,
    });

    res.json({ favorites });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
