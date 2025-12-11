# Como Rodar os Testes

Este documento explica como configurar e rodar a suíte de testes do projeto.

## Passo a Passo

### 1. Configurar Ambiente de Teste

Você deve rodar o script de configuração correspondente ao seu sistema operacional **dentro desta pasta `tests/`**.

**Windows (.cmd):**
Abra o terminal (CMD ou PowerShell) na pasta `tests` e rode:
```cmd
.\setup-tests.cmd
```

**Linux/Mac (.sh):**
Abra o terminal na pasta `tests` e rode:
```bash
./setup-tests.sh
```

> **O que isso faz?**
> - Instala dependências (pnpm install).
> - Cria um banco de dados de teste (`test`) no PostgreSQL.
> - Configura as permissões necessárias.
> - Sincroniza o schema do Prisma com o banco de teste.

### 2. Rodar os Testes

Após a configuração, execute o comando de teste:

```bash
pnpm test
```

Para ver a coberturaTo check coverage:
```bash
npm run test:coverage
```

### 3. Rodar Testes Sem Banco de Dados (API Mockada)

Se você não tiver o PostgreSQL instalado ou quiser apenas testar a integração com APIs externas (Spotify), pode rodar a suíte "No-DB":

1. Rode o setup simplificado:
   - **Windows**: `.\setup-tests-nodb.cmd`
   - **Linux**: `./setup-tests-nodb.sh`

2. Execute os testes:
   ```bash
   pnpm run test:nodb
   ```

## Solução de Problemas

- **Erro de Permissão (Linux/Mac):** Se o script `.sh` não rodar, dê permissão de execução com `chmod +x setup-tests.sh`.
- **Versão do Node:** Se tiver problemas com o Prisma, verifique se está usando Node v20 (`node -v`).
