# Testes do Backend - Bandline

Este diretório contém os testes de controle para todas as rotas do backend do Bandline.

## Estrutura

```
tests/
├── setup/               # Configuração e helpers de testes
│   ├── test-setup.ts   # Setup global dos testes
│   ├── test-app.ts     # Criação da instância Express para testes
│   ├── test-helpers.ts # Funções auxiliares para criar dados de teste
│   └── mocks.ts        # Mocks para APIs externas (Spotify, Last.fm)
├── routes/             # Testes para cada rota
│   ├── auth.test.ts
│   ├── artists.test.ts
│   ├── search.test.ts
│   ├── albums.test.ts
│   ├── tracks.test.ts
│   ├── history.test.ts
│   ├── favorites.test.ts
│   └── profile.test.ts
├── package.json
├── vitest.config.ts
└── README.md
```

## Instalação

1. Instale as dependências (isso também gerará o Prisma Client automaticamente):

```bash
cd tests
pnpm install
```

Se o Prisma Client não for gerado automaticamente, execute:

```bash
pnpm prisma:generate
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na pasta `tests/` ou configure as variáveis de ambiente:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/test_db"
SESSION_SECRET="test-secret-key"
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
LASTFM_API_KEY="your-lastfm-api-key"
```

## Executando os Testes

### Executar todos os testes:

```bash
pnpm test
```

### Executar em modo watch (desenvolvimento):

```bash
pnpm test:watch
```

### Executar com interface visual:

```bash
pnpm test:ui
```

### Executar com cobertura de código:

```bash
pnpm test:coverage
```

## Cobertura dos Testes

Os testes cobrem:

### Autenticação (`/auth`)
- ✅ POST /auth/register - Registro de novo usuário
- ✅ POST /auth/login - Login de usuário
- ✅ GET /auth/me - Obter usuário atual
- ✅ POST /auth/logout - Logout

### Artistas (`/artists`)
- ✅ GET /artists/:id - Obter detalhes do artista

### Busca (`/searchArtists`)
- ✅ GET /searchArtists - Buscar artistas

### Álbuns (`/artistAlbums`)
- ✅ GET /artistAlbums/:id - Obter álbuns do artista

### Músicas (`/albumTracks`)
- ✅ GET /albumTracks/:id - Obter faixas do álbum

### Histórico (`/history`)
- ✅ POST /history - Adicionar ao histórico
- ✅ GET /history - Obter histórico do usuário

### Favoritos (`/favorites`)
- ✅ POST /favorites - Adicionar favorito
- ✅ GET /favorites - Listar favoritos
- ✅ DELETE /favorites - Remover favorito
- ✅ POST /favorites/check - Verificar favoritos

### Perfil (`/profile`)
- ✅ GET /profile - Obter perfil do usuário
- ✅ PUT /profile - Atualizar perfil

## Observações

- Os testes usam um banco de dados de teste separado (configure via `DATABASE_URL`)
- As APIs externas (Spotify, Last.fm) são mockadas nos testes
- Cada teste limpa o banco de dados antes de executar
- Os testes de autenticação usam cookies de sessão para simular sessões reais

## Próximos Passos

Para melhorar ainda mais a cobertura:

1. Adicionar testes de edge cases
2. Adicionar testes de performance
3. Adicionar testes de integração end-to-end
4. Adicionar testes de segurança (SQL injection, XSS, etc.)
