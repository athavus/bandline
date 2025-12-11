#!/bin/bash

# ==============================================================================
# SCRIPT PARA CONFIGURAÇÃO DE TESTES (SEM BANCO DE DADOS)
# ==============================================================================
# Este script prepara o ambiente para rodar APENAS os testes que não dependem do Postgres.

# Definições de Cores para Logs
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'

echo -e "${YELLOW}Iniciando setup para testes SEM banco de dados..."

# ------------------------------------------------------------------------------
# 1. VERIFICAÇÃO DE DEPENDÊNCIAS
# ------------------------------------------------------------------------------

# Verificar Node.js
NODE_VERSION=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VERSION" -ne 20 ]; then
    echo "⚠️  AVISO: Recomenda-se usar Node.js v20. Versão atual: $(node -v)."
fi

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm não encontrado. Instalando...${RESET}"
    npm install -g pnpm
fi

# ------------------------------------------------------------------------------
# 2. INSTALAÇÃO DE PACOTES
# ------------------------------------------------------------------------------
echo -e "${YELLOW}Instalando dependências (pnpm install)..."

pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Dependências instaladas com sucesso!"
else
    echo -e "${RED}Falha ao instalar dependências."
    exit 1
fi

echo -e "${GREEN}Setup concluído!"
echo -e "Para rodar os testes sem banco, use:"
echo -e "${YELLOW}pnpm run test:nodb${RESET}"
