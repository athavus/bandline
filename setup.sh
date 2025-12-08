#!/bin/bash

# ==============================================================================
# SCRIPT PARA CONFIGURAÇÃO DO BANCO REAL E PRISMA (LINUX)
# ==============================================================================

# Cores
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'

# ------------------------------------------------------------------------------
# 0. IR PARA A PASTA SERVER
# ------------------------------------------------------------------------------
echo -e "${YELLOW}Verificando pasta 'server'...${NC}"

if [ ! -d "server" ]; then
    echo -e "${RED}Erro: pasta 'server' não encontrada.${NC}"
    exit 1
fi

cd server || exit 1
echo -e "${GREEN}Entrando na pasta server...${NC}"

# ------------------------------------------------------------------------------
# Configurações do Banco Real
# ------------------------------------------------------------------------------
DB_USER="bandline_user"
DB_PASS="1234"
DB_NAME="bandline_db"
DB_HOST="localhost"
DB_PORT="5432"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
export DATABASE_URL

echo -e "${YELLOW}Iniciando setup completo para o banco real...${NC}"

# ------------------------------------------------------------------------------
# 1. DEPENDÊNCIAS
# ------------------------------------------------------------------------------
echo -e "${YELLOW}(pnpm install)${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Erro: 'pnpm' não encontrado.${NC}"
    exit 1
fi

pnpm install --ignore-scripts=false
if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao instalar dependências.${NC}"
    exit 1
fi
echo -e "${GREEN}Dependências instaladas!${NC}"

# ------------------------------------------------------------------------------
# 2. POSTGRESQL
# ------------------------------------------------------------------------------
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Erro: 'psql' não instalado.${NC}"
    exit 1
fi

echo -e "${YELLOW}Configurando PostgreSQL...${NC}"

# Usuário
psql -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" \
  2>/dev/null || echo "   - Usuário já existe ou erro ignorado."

# Banco
psql -U postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" \
  2>/dev/null || echo "   - Banco já existe ou erro ignorado."

# Permissões globais
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

echo -e "${YELLOW}Aplicando permissões no schema public...${NC}"
psql -U postgres -d "${DB_NAME}" <<EOF
GRANT USAGE ON SCHEMA public TO ${DB_USER};
GRANT CREATE ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao configurar permissões.${NC}"
    exit 1
fi

echo -e "${GREEN}Banco configurado!${NC}"

# ------------------------------------------------------------------------------
# 3. SINCRONIZAÇÃO DO PRISMA
# ------------------------------------------------------------------------------
echo -e "${YELLOW}Sincronizando Prisma...${NC}"

if [ -f "./prisma/schema.prisma" ]; then
    SCHEMA_PATH="./prisma/schema.prisma"
else
    echo -e "${RED}schema.prisma não encontrado na pasta prisma/.${NC}"
    exit 1
fi

echo -e "   - Usando schema: ${SCHEMA_PATH}"

echo -e "${YELLOW}Gerando Prisma Client...${NC}"
npx prisma generate --schema="${SCHEMA_PATH}"

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao gerar Prisma Client.${NC}"
    exit 1
fi

echo -e "${YELLOW}Aplicando db push...${NC}"
npx prisma db push --schema="${SCHEMA_PATH}" --force-reset

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao aplicar db push.${NC}"
    exit 1
fi

echo -e "${GREEN}Prisma sincronizado com sucesso!${NC}"
echo -e "${GREEN}Setup concluído! Pode rodar pnpm dev agora.${NC}"
