import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import artistsRouter from './routes/artists/artists.ts';
import searchArtistsRouter from './routes/search/search.ts';
import artistAlbumsRouter from './routes/albums/albums.ts';
import albumTracksRouter from './routes/tracks/tracks.ts';
import loginRouter from './routes/login/login.ts';
import registerRouter from './routes/sign-in/sign-in.ts';

// Configurando variáveis de ambiente
dotenv.config();

// Instanciando express e configurando a porta do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas configuradas
app.use('/artistAlbums', artistAlbumsRouter);
app.use('/searchArtists', searchArtistsRouter);
app.use('/artists', artistsRouter);
app.use('/albumTracks', albumTracksRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// Criando o servidor https
app.listen(PORT, () => {
  console.log(`O servidor está rodando em: http://localhost:${PORT}`);
});
