# Bandline

Guia rápido para configurar e rodar o projeto (Todo o projeto foi feito no ambiente linux e configurado para também ser compatível nativamente com o Windows).

## Requisitos do Sistema
- **Node.js**: Versão 20 (LTS) recomendada.
- **PostgreSQL**: Instalado e rodando.
- **Gestor de Pacotes**: O projeto usa `pnpm`. Os scripts tentarão instalar se não tiver.

## Como Configurar e Rodar o Projeto (Server)

Para configurar o banco de dados principal e instalar dependências, execute o script de setup na **raiz do projeto**:

### Windows
```cmd
.\setup.cmd
```

### Linux / Mac
```bash
./setup.sh
```
*(Se precisar, dê permissão de execução: `chmod +x setup.sh`)*

---

### Rodando o Servidor
Após o setup, entre na pasta do servidor e inicie:

```bash
cd server
pnpm dev
```
O servidor rodará em `http://localhost:3000`.

---

## Como Rodar os Testes

Para rodar a suíte de testes automatizados:

1. Entre na pasta de testes:
   ```bash
   cd tests
   ```

2. Execute o script de configuração de testes (cria um banco separado para não limpar seus dados reais):
   - **Windows**: `.\setup-tests.cmd`
   - **Linux**: `./setup-tests.sh`

3. Rode os testes:
   ```bash
   pnpm test
   ```

## Notas para Avaliação
- Se encontrar erros de "File Parallelism" nos testes, o script de teste já está configurado para evitá-los (`--no-file-parallelism`).
