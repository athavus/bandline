# Guia de Configuração dos Testes

## Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **PostgreSQL** (para banco de dados de testes)
3. **pnpm** (gerenciador de pacotes)

## Configuração do Ambiente

### 1. Instalar Dependências

Na raiz do projeto (ou na pasta `tests/`):

```bash
cd tests
pnpm install
```

### 2. Configurar Banco de Dados de Teste

Você precisa de um banco de dados PostgreSQL separado para os testes. Você pode:

**Opção A: Usar o mesmo banco (não recomendado para produção)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bandline_test"
```

**Opção B: Usar variável de ambiente de teste**
```env
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/bandline_test"
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `tests/` com:

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/bandline_test"
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/bandline_test"

# Sessão
SESSION_SECRET="test-secret-key-change-in-production"

# APIs Externas (os testes mockam essas, mas podem ser necessárias para alguns testes)
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
LASTFM_API_KEY="your-lastfm-api-key"

# Google OAuth (para testes de autenticação Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

### 4. Executar Migrações do Prisma

Antes de executar os testes pela primeira vez, você precisa executar as migrações no banco de teste:

```bash
cd ../server
TEST_DATABASE_URL="postgresql://test:test@localhost:5432/test" pnpm prisma migrate deploy
```

Ou criar o schema diretamente:

```bash
cd ../server
TEST_DATABASE_URL="postgresql://test:test@localhost:5432/test" pnpm prisma db push
```

## Executando os Testes

### Executar todos os testes:
```bash
cd tests
pnpm test
```

### Executar em modo watch:
```bash
pnpm test:watch
```

### Executar com cobertura:
```bash
pnpm test:coverage
```

### Executar um arquivo específico:
```bash
pnpm test auth.test.ts
```

### Executar testes que correspondem a um padrão:
```bash
pnpm test -t "register"
```

## Estrutura dos Testes

Cada arquivo de teste (`*.test.ts`) contém:

- **describe**: Agrupa testes relacionados
- **it/test**: Testes individuais
- **beforeEach**: Executado antes de cada teste (limpa o banco)
- **expect**: Asserções

## Notas Importantes

1. **Limpeza de Banco**: Cada teste limpa o banco de dados antes de executar para garantir isolamento.

2. **Mocks**: As APIs externas (Spotify, Last.fm) são mockadas para evitar chamadas reais durante os testes.

3. **Autenticação**: Os testes de rotas protegidas usam cookies de sessão obtidos através do login.

4. **Isolamento**: Cada teste é independente e não depende de outros testes.

## Solução de Problemas

### Erro: "Cannot find module '@config/prisma'"
- Verifique se o `tsconfig.json` tem os paths corretos
- Certifique-se de que o alias está configurado no `vitest.config.ts`

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Verifique se a `DATABASE_URL` está correta
- Verifique se as migrações foram executadas

### Erros de importação
- Certifique-se de que todas as dependências estão instaladas
- Verifique se os paths no `tsconfig.json` estão corretos
- Tente remover `node_modules` e reinstalar: `rm -rf node_modules && pnpm install`

## Próximos Passos

Após os testes estarem funcionando, você pode:

1. Adicionar mais casos de teste
2. Melhorar a cobertura de código
3. Adicionar testes de performance
4. Adicionar testes de integração end-to-end
