import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport/passport';  // ajuste de import
import artistsRouter from './routes/artists/artists';
import searchArtistsRouter from './routes/search/search';
import artistAlbumsRouter from './routes/albums/albums';
import albumTracksRouter from './routes/tracks/tracks';
import authRouter from './routes/auth/auth';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Sessão
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // mudar para true em HTTPS
    sameSite: 'lax'     // ou 'none' + secure:true
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use('/artists', artistsRouter);
app.use('/search', searchArtistsRouter);
app.use('/artistAlbums', artistAlbumsRouter);
app.use('/albumTracks', albumTracksRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
