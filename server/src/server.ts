import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport';
import artistsRouter from './routes/artists';
import searchArtistsRouter from './routes/search';
import artistAlbumsRouter from './routes/albums';
import albumTracksRouter from './routes/tracks';
import authRouter from './routes/auth';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

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


app.use(passport.initialize());
app.use(passport.session());

app.use('/artists', artistsRouter);
app.use('/searchArtists', searchArtistsRouter);
app.use('/artistAlbums', artistAlbumsRouter);
app.use('/albumTracks', albumTracksRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
