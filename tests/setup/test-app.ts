import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { testPrisma } from "./test-setup";

// Importar as rotas
import artistsRouter from "../../server/src/routes/artists";
import searchArtistsRouter from "../../server/src/routes/search";
import artistAlbumsRouter from "../../server/src/routes/albums";
import albumTracksRouter from "../../server/src/routes/tracks";
import historyRouter from "../../server/src/routes/history";
import favoritesRouter from "../../server/src/routes/favorites";
import authRouter from "../../server/src/routes/auth";
import profileRouter from "../../server/src/routes/profile";

/**
 * Cria uma instância do app Express para testes
 */
export function createTestApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "test-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Montar as rotas
  app.use("/artists", artistsRouter);
  app.use("/searchArtists", searchArtistsRouter);
  app.use("/artistAlbums", artistAlbumsRouter);
  app.use("/albumTracks", albumTracksRouter);
  app.use("/history", historyRouter);
  app.use("/favorites", favoritesRouter);
  app.use("/auth", authRouter);
  app.use("/profile", profileRouter);

  return app;
}

/**
 * Mock do Prisma para usar nos testes
 */
export { testPrisma as prisma };
