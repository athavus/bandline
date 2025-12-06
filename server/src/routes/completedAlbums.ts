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
  try {
    const user = req.user as { id: number };
    const { albumId, albumName, albumImage, albumTracks } = req.body;

    if (!albumId || !albumName) {
      return res.status(400).json({
        error: "albumId e albumName são obrigatórios",
      });
    }

    // Verificar se já existe
    const existing = await prisma.completedAlbums.findFirst({
      where: {
        userId: user.id,
        albumId: albumId,
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Álbum já está nos completos",
        favorite: existing,
      });
    }

    // Converter albumTracks para string (número de faixas)
    const trackCount = Array.isArray(albumTracks)
      ? albumTracks.length.toString()
      : (albumTracks || "0").toString();

    // Criar novo favorito
    const completedAlbum = await prisma.completedAlbums.create({
      data: {
        userId: user.id,
        albumId,
        albumName,
        albumImage: albumImage || null,
        albumTracks: trackCount,
      },
    });

    res.json({
      completedAlbum,
      message: "Álbum marcado como concluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao marcar como concluído:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post(
  "/check",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const user = req.user as { id: number };
      const { albumIds } = req.body;

      if (!albumIds || !Array.isArray(albumIds)) {
        return res.status(400).json({
          error: "albumIds é obrigatório e deve ser um array",
        });
      }

      const completedAlbums = await prisma.completedAlbums.findMany({
        where: {
          userId: user.id,
          albumId: { in: albumIds },
        },
        select: { albumId: true },
      });

      const completedIds = completedAlbums.map((c) => c.albumId);
      res.json({ completedIds });
    } catch (error) {
      console.error("Erro ao verificar como concluído:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
);

router.delete("/", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number };
    const { albumId } = req.body;

    if (!albumId) {
      return res.status(400).json({
        error: "albumId é obrigatório",
      });
    }

    const deleted = await prisma.completedAlbums.deleteMany({
      where: {
        userId: user.id,
        albumId: albumId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        error: "Álbum não encontrado",
      });
    }

    res.json({
      message: "Álbum desmarcado como concluído com sucesso",
      deleted,
    });
  } catch (error) {
    console.error("Erro ao desmarcar favorito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Listar favoritos
router.get("/", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number };

    const completedAlbums = await prisma.completedAlbums.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
      take: 50,
    });

    res.json({ completedAlbums });
  } catch (error) {
    console.error("Erro ao buscar Álbuns Concluídos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
