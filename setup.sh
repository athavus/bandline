#!/bin/bash

cd server

# configuração da conexao com o banco de dados
DB_USER="bandline_user"
DB_PASS="1234"
DB_NAME="bandline_db"
DB_HOST="localhost"
DB_PORT="5432"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
export DATABASE_URL

# Verificar Node.js
NODE_VERSION=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VERSION" -ne 20 ]; then
    echo "⚠️  AVISO: Recomenda-se usar Node.js v20. Versão atual: $(node -v). Versões mais recentes podem ter incompatibilidade com Prisma."
fi

# Verificar e instalar pnpm se necessário
if ! command -v pnpm &> /dev/null; then
    echo "pnpm não encontrado. Instalando..."
    npm install -g pnpm
fi

# instalando dependências
pnpm install --ignore-scripts=false

# configurando postgresql
# Usuário
psql -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" \
  2>/dev/null || echo "   - Usuário já existe ou erro ignorado."

# Banco
psql -U postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" \
  2>/dev/null || echo "   - Banco já existe ou erro ignorado."

# Permissões globais
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

psql -U postgres -d "${DB_NAME}" <<EOF
GRANT USAGE ON SCHEMA public TO ${DB_USER};
GRANT CREATE ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

SCHEMA_PATH="./prisma/schema.prisma"

# configurando prisma
npx prisma generate --schema="${SCHEMA_PATH}"

npx prisma db push --schema="${SCHEMA_PATH}" --force-reset

echo -e "setup concluído"
