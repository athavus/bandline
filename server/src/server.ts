import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport";
import artistsRouter from "./routes/artists";
import searchArtistsRouter from "./routes/search";
import artistAlbumsRouter from "./routes/albums";
import albumTracksRouter from "./routes/tracks";
import historyRouter from "./routes/history";
import favoritesRouter from "./routes/favorites";
import authRouter from "./routes/auth";
import { apiReference } from "@scalar/express-api-reference";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/openapi.yaml", (req, res) => {
  const openApiSpec = readFileSync(join(__dirname, "../openapi.yaml"), "utf-8");
  res.setHeader("Content-Type", "text/yaml");
  res.send(openApiSpec);
});

// Rota de documentação com Scalar
app.use(
  "/docs",
  apiReference({
    spec: {
      url: "/openapi.yaml",
    },
    theme: "purple",
  }),
);

// Rotas relacionadas a artistas
app.use("/artists", artistsRouter);

// Rotas relacionadas a busca de artistas
app.use("/searchArtists", searchArtistsRouter);

// Rotas relacionadas a álbuns de artistas
app.use("/artistAlbums", artistAlbumsRouter);

// Rotas relacionadas a músicas de álbuns
app.use("/albumTracks", albumTracksRouter);

// Rotas relacionadas ao histórico de buscas do usuário
app.use("/history", historyRouter);

// Rotas relacionadas a autenticação e gerenciamento de usuários
app.use("/auth", authRouter);

// Rotas relacionadas a álbuns favoritos do usuário
app.use("/favorites", favoritesRouter);

app.listen(PORT, () => {
  console.log("\n=======================================================");
  console.log(`Server http://localhost:${PORT}`);
  console.log("=======================================================");
  console.log(`Docs: http://localhost:${PORT}/docs`);
  console.log("=======================================================");
});
