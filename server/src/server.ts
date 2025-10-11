import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import artistsRouter from './routes/artists/artists.ts';
import searchArtistsRouter from './routes/search/search.ts';
import artistAlbums from './routes/albums/albums.ts';
import albumTracks from './routes/tracks/tracks.ts';

// Configurando variáveis de ambiente
dotenv.config();

// Instanciando express e configurando a porta do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas configuradas
app.use('/artistAlbums', artistAlbums);
app.use('/searchArtists', searchArtistsRouter);
app.use('/artists', artistsRouter);
app.use('/albumTracks', albumTracks);


// Criando o servidor https
app.listen(PORT, () => {
  console.log(`O servidor está rodando em: http://localhost:${PORT}`);
});
