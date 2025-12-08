# Definições do Sistema e Arquitetura

## Visão Geral
- **Propósito**: permitir que usuários busquem artistas no Spotify, consultem detalhes enriquecidos com Last.fm, naveguem por álbuns e faixas, gerenciem favoritos, histórico e álbuns concluídos, além de manter perfil.
- **Domínio**: consumo de APIs de música (Spotify e Last.fm) com camada de autenticação própria e gerenciamento de sessão via cookies.

## Principais Funcionalidades
- Cadastro, login, logout e verificação de sessão (`/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout`), com opção de OAuth Google.
- Busca de artistas (`/searchArtists`) e detalhes de artista com descrição traduzida e artistas relacionados (`/artists/:id` + `lang`).
- Listagem de álbuns de um artista ordenados por data (`/artistAlbums/:id`) e faixas de um álbum (`/albumTracks/:id`).
- Histórico de buscas de artistas (criação e listagem limitadas a 50 registros) em `/history`.
- Favoritos de álbuns (criar, listar, verificar, remover) em `/favorites`.
- Álbuns concluídos (criar, listar, verificar, remover) em `/completedAlbums`.
- Perfil do usuário (consulta e atualização de username, email, avatar e bio) em `/profile`.
- Documentação interativa da API servida em `/docs` (OpenAPI + Scalar).

## Arquitetura Lógica
- **Frontend**: SPA em Svelte consumindo a API HTTP. Roteamento feito a mão, componentes para favoritos, histórico, playlists e perfil.
- **Backend**: API REST em Express, com sessões em `express-session` e autenticação via Passport (local + Google OAuth).
- **Persistência**: PostgreSQL via Prisma; modelos `User`, `History`, `Favorites`, `completedAlbums`.
- **Integrações externas**: Spotify Web API e Last.fm (descrições e artistas similares). Tokens e chaves são guardados em variáveis de ambiente.
- **Sessão/Segurança**: cookies `httpOnly`, `sameSite=lax`, senha com hash `bcryptjs`.
- **Documentação**: OpenAPI em `server/openapi.yaml`, servida pela rota `/openapi.yaml` e visualizada em `/docs`.

## Fluxo de Dados (resumo)
1. Cliente SPA chama endpoints REST com cookies de sessão.
2. Rotas autenticadas verificam `req.isAuthenticated()`; usuários são geridos pelo Passport.
3. Dados de domínio são persistidos no PostgreSQL via Prisma.
4. Dados de catálogo (artistas, álbuns, faixas) são lidos sob demanda das APIs Spotify/Last.fm e retornados já filtrados/mapeados.

## Tecnologias e Pilares
- **Linguagens/Runtime**: Node.js 20, TypeScript.
- **Backend**: Express 5, Passport (local, Google), bcryptjs.
- **Dados**: PostgreSQL, Prisma ORM.
- **Frontend**: Svelte.
- **Configuração**: pnpm.
- **Documentação**: OpenAPI + Scalar.
- **Testes**: Vitest  + Prisma Client apontando para banco de teste (scripts em `tests/` com mocks).
