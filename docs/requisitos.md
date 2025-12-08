# Requisitos do Sistema

## 1. Requisitos Funcionais
- RF01 — Permitir cadastro de usuário com username, email e senha; rejeitar duplicados e campos faltantes.
- RF02 — Realizar login e manter sessão via cookie; expor usuário autenticado em `/auth/me`; realizar logout.
- RF03 — Oferecer login via OAuth Google (redirecionamento e callback).
- RF04 — Buscar artistas no Spotify a partir de query (`/searchArtists`), retornando lista básica limitada a 10 itens.
- RF05 — Exibir detalhes de artista (`/artists/:id`) com descrição localizada (en/pt/es) e artistas relacionados do Last.fm.
- RF06 — Listar álbuns de um artista (`/artistAlbums/:id`) ordenados por data de lançamento.
- RF07 — Listar faixas de um álbum (`/albumTracks/:id`) com metadados essenciais.
- RF08 — Registrar histórico de buscas de artistas e listar últimos 50 itens do usuário (`/history`).
- RF09 — Gerenciar favoritos de álbuns: criar, listar (máx. 50), verificar vários IDs e remover (`/favorites`).
- RF10 — Gerenciar álbuns concluídos: criar, listar (máx. 50), verificar vários IDs e remover (`/completedAlbums`).
- RF11 — Permitir consulta e atualização de perfil (username, email, bio, avatar) em `/profile`.
- RF12 — Disponibilizar documentação da API via `/docs` e especificação OpenAPI em `/openapi.yaml`.

## 2. Requisitos Não Funcionais
- RNF01 — Plataforma em Node.js 20 com TypeScript; dependências gerenciadas por pnpm.
- RNF02 — Persistência em PostgreSQL via Prisma; hashes de senha com bcrypt; dados de catálogo não são persistidos (vêm das APIs externas).
- RNF03 — Autenticação baseada em sessão (Passport + express-session); cookies `httpOnly` e `sameSite=lax`.
- RNF04 — Limites defensivos: buscas de artista exigem query ≥2 caracteres; listas de histórico/favoritos/completos são limitadas a 50 itens; busca de artistas limitada a 10 resultados.
- RNF05 — Tratamento de falhas: respostas 4xx para validações e 5xx para erros internos/external APIs; logging simples em console para diagnósticos.
- RNF06 — Testabilidade: suíte de testes com Vitest + Supertest usando banco de teste isolado e mocks das integrações Spotify/Last.fm.
- RNF07 — Documentação atualizada em OpenAPI 3.1 servida pelo próprio backend; interface visual via Scalar.
- RNF08 — Configuração por ambiente: variáveis `DATABASE_URL`, `SESSION_SECRET`, credenciais Spotify/Last.fm e Google OAuth.

## 3. Requisitos Legais/Compulsórios
- RL01 — Conformidade com LGPD: coletar apenas dados necessários (username, email, avatar opcional, bio, histórico/favoritos do próprio usuário); oferecer meios para atualização e exclusão via endpoints de perfil e exclusões específicas.
- RL02 — Senhas devem ser armazenadas exclusivamente como hash (bcrypt) e nunca em texto plano; sessão mantida por cookie não exposto a scripts (`httpOnly`).
- RL03 — Uso de APIs de terceiros deve seguir os Termos de Uso do Spotify Web API e da Last.fm (inclui limites de rate, proibição de redistribuição não autorizada e requisitos de atribuição).
- RL04 — Login OAuth Google deve obedecer políticas da Google (escopos mínimos, tratamento de erro de callback).
- RL05 — Cookies de sessão exigem aviso de uso ao usuário final e aderência às políticas de privacidade aplicáveis.
