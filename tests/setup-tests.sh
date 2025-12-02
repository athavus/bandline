#!/bin/bash

# ==============================================================================
# SCRIPT PARA CONFIGURAÇÃO DE TESTES
# ==============================================================================

# Definições de Cores para Logs
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'

# Configurações do Banco de Teste
DB_USER="test"
DB_PASS="test"
DB_NAME="test"
DB_HOST="localhost"
DB_PORT="5432"

# URL de Conexão
TEST_DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo -e "${YELLOW}Iniciando setup completo e execução de testes..."

# ------------------------------------------------------------------------------
# 1. DEPENDÊNCIAS
# ------------------------------------------------------------------------------
echo -e "${YELLOW}(pnpm install)"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Erro: 'pnpm' não encontrado."
    exit 1
fi

pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Dependências instaladas com sucesso!"
else
    echo -e "${RED}Falha ao instalar dependências. Verifique seu pnpm e package.json."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo -e "${RED}Erro: 'psql' (cliente PostgreSQL) não encontrado. É necessário para configurar o banco."
    exit 1
fi

# ------------------------------------------------------------------------------
# 2. CONFIGURAÇÃO DO POSTGRESQL
# ------------------------------------------------------------------------------
echo -e "${YELLOW}PostgreSQL"

# Tenta criar o usuário (ignora erro se já existir)
psql -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || echo -e "   - Usuário '${DB_USER}' já existe ou erro ignorado."

# Tenta criar o banco de dados
psql -U postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" 2>/dev/null || echo -e "   - Banco '${DB_NAME}' já existe ou erro ignorado."

# Garante privilégios no banco
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" > /dev/null

echo -e "${YELLOW}Aplicando permissões cruciais no schema 'public' para o usuário '${DB_USER}'..."
# Esta parte resolve o erro "permission denied for schema public"
psql -U postgres -d ${DB_NAME} <<EOF
    GRANT USAGE ON SCHEMA public TO ${DB_USER};
    GRANT CREATE ON SCHEMA public TO ${DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Permissões aplicadas com sucesso!"
else
    echo -e "${RED}Falha ao aplicar permissões. Verifique se o serviço do Postgres está rodando e se o usuário 'postgres' tem privilégios."
    exit 1
fi

# ------------------------------------------------------------------------------
# 3. SINCRONIZAÇÃO DO PRISMA (DB PUSH)
# ------------------------------------------------------------------------------
echo -e "${YELLOW}Sincronizando Schema do Prisma com o banco de teste..."

# Localiza o arquivo schema.prisma (prioriza server/prisma, depois tests/prisma)
if [ -f "./server/prisma/schema.prisma" ]; then
    SCHEMA_PATH="./server/prisma/schema.prisma"
elif [ -f "./tests/prisma/schema.prisma" ]; then
    SCHEMA_PATH="./tests/prisma/schema.prisma"
elif [ -f "./prisma/schema.prisma" ]; then
    SCHEMA_PATH="./prisma/schema.prisma"
else
    echo -e "${RED}Arquivo schema.prisma não encontrado nas pastas padrão."
    exit 1
fi

echo -e "   - Usando schema em: ${SCHEMA_PATH}"

# Exporta a variável para o db push
export DATABASE_URL="${TEST_DATABASE_URL}"

# Executa o db push forçando o reset para limpar dados antigos
npx prisma db push --schema="${SCHEMA_PATH}" --force-reset

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Banco de dados de teste sincronizado e pronto!"
else
    echo -e "${RED}Erro ao sincronizar o Prisma. A saída foi: $?."
    exit 1
fi

echo "agora basta rodar pnpm test para ver o resultado do servidor de testes"
