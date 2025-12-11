@echo off
REM ==============================================================================
REM SCRIPT PARA CONFIGURAÇÃO DO BANCO REAL E PRISMA (WINDOWS) - SAÍDA COMPLETA
REM ==============================================================================

SETLOCAL ENABLEDELAYEDEXPANSION

REM -------------------------------------------------------------------------------
REM 0. IR PARA A PASTA SERVER
REM -------------------------------------------------------------------------------
IF NOT EXIST "server" (
    echo Pasta 'server' nao encontrada
    exit /b 1
)

cd /d server
echo Entrando na pasta server...

REM -------------------------------------------------------------------------------
REM Configurações do banco real
REM -------------------------------------------------------------------------------
SET DB_USER=bandline_user
SET DB_PASS=1234
SET DB_NAME=bandline_db
SET DB_HOST=localhost
SET DB_PORT=5432

SET DATABASE_URL=postgresql://%DB_USER%:%DB_PASS%@%DB_HOST%:%DB_PORT%/%DB_NAME%

echo Iniciando setup completo para o banco real...

node -v > temp_node_version.txt
set /p NODE_VER=<temp_node_version.txt
del temp_node_version.txt
echo Node version: %NODE_VER% (Recomendado: v20)


where psql
IF %ERRORLEVEL% NEQ 0 (
    echo Erro: psql nao encontrado
    exit /b 1
)

REM -------------------------------------------------------------------------------
REM  1. CONFIGURAÇÃO DO POSTGRESQL
REM -------------------------------------------------------------------------------
echo PostgreSQL: criando usuario e banco...

psql -U postgres -c "CREATE USER %DB_USER% WITH PASSWORD '%DB_PASS%';"
IF %ERRORLEVEL% NEQ 0 echo Usuario %DB_USER% ja existe ou erro ignorado

psql -U postgres -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;"
IF %ERRORLEVEL% NEQ 0 echo Banco %DB_NAME% ja existe ou erro ignorado

psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE %DB_NAME% TO %DB_USER%;"

echo Aplicando permissoes no schema public...
psql -U postgres -d %DB_NAME% -c "GRANT USAGE ON SCHEMA public TO %DB_USER%;"
psql -U postgres -d %DB_NAME% -c "GRANT CREATE ON SCHEMA public TO %DB_USER%;"
psql -U postgres -d %DB_NAME% -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO %DB_USER%;"
psql -U postgres -d %DB_NAME% -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO %DB_USER%;"


REM -------------------------------------------------------------------------------
REM 2. DEPENDÊNCIAS
REM -------------------------------------------------------------------------------
REM Verificar pnpm
where pnpm >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo pnpm nao encontrado. Instalando via npm...
    npm install -g pnpm
    IF %ERRORLEVEL% NEQ 0 (
        echo Falha ao instalar pnpm. Instale manualmente.
        exit /b 1
    )
)

echo Instalando dependencias via pnpm...
pnpm install --ignore-scripts=false
IF %ERRORLEVEL% NEQ 0 (
    echo Falha ao instalar dependencias
    exit /b 1
)

REM -------------------------------------------------------------------------------
REM 3. SINCRONIZAÇÃO DO PRISMA
REM -------------------------------------------------------------------------------
IF EXIST ".\prisma\schema.prisma" (
    SET SCHEMA_PATH=.\prisma\schema.prisma
) ELSE (
    echo Arquivo schema.prisma nao encontrado
    exit /b 1
)

echo Usando schema em: %SCHEMA_PATH%
SET DATABASE_URL=%DATABASE_URL%

echo Gerando client do Prisma...
npx prisma generate --schema="%SCHEMA_PATH%"
IF %ERRORLEVEL% NEQ 0 (
    echo Erro ao gerar Prisma Client
    exit /b 1
)

echo Aplicando migrations via Prisma DB Push...
npx prisma db push --schema="%SCHEMA_PATH%" --force-reset
IF %ERRORLEVEL% NEQ 0 (
    echo Erro ao sincronizar Prisma
    exit /b 1
)

echo Setup concluido! Tudo rodou e voce deve ver toda a saída acima.
pause
