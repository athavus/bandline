
@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: SCRIPT PARA CONFIGURAÇÃO DE TESTES 
:: ==============================================================================

:: Configurações do Banco de Teste
set DB_USER=test
set DB_PASS=test
set DB_NAME=test
set DB_HOST=localhost
set DB_PORT=5432

set TEST_DATABASE_URL=postgresql://%DB_USER%:%DB_PASS%@%DB_HOST%:%DB_PORT%/%DB_NAME%

echo Iniciando setup completo e execução de testes...

:: ------------------------------------------------------------------------------
:: 1. DEPENDÊNCIAS
:: ------------------------------------------------------------------------------
echo (pnpm install)

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: 'pnpm' não encontrado no PATH.
    exit /b 1
)

pnpm install
if %errorlevel% neq 0 (
    echo Falha ao instalar dependências. Verifique seu pnpm e package.json.
    exit /b 1
)
echo Dependências instaladas com sucesso!

where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: 'psql' (cliente PostgreSQL) não encontrado. Instale o PostgreSQL ou adicione ao PATH.
    exit /b 1
)

:: ------------------------------------------------------------------------------
:: 2. CONFIGURAÇÃO DO POSTGRESQL
:: ------------------------------------------------------------------------------
echo Configurando PostgreSQL...

:: Criar usuário (ignora erro)
psql -U postgres -c "CREATE USER %DB_USER% WITH PASSWORD '%DB_PASS%';" 2>nul
echo    - Tentativa de criar usuário concluída.

:: Criar banco (ignora erro)
psql -U postgres -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;" 2>nul
echo    - Tentativa de criar banco concluída.

:: Garantir privilégios
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE %DB_NAME% TO %DB_USER%;" >nul

echo Aplicando permissões no schema 'public'...

psql -U postgres -d %DB_NAME% -c "GRANT USAGE ON SCHEMA public TO %DB_USER%;" 
psql -U postgres -d %DB_NAME% -c "GRANT CREATE ON SCHEMA public TO %DB_USER%;" 
psql -U postgres -d %DB_NAME% -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO %DB_USER%;" 
psql -U postgres -d %DB_NAME% -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO %DB_USER%;" 

echo Permissões aplicadas com sucesso!

:: ------------------------------------------------------------------------------
:: 3. SINCRONIZAÇÃO DO PRISMA (DB PUSH)
:: ------------------------------------------------------------------------------
echo Sincronizando Schema do Prisma...

set SCHEMA_PATH=

if exist "server\prisma\schema.prisma" (
    set SCHEMA_PATH=server\prisma\schema.prisma
) else if exist "tests\prisma\schema.prisma" (
    set SCHEMA_PATH=tests\prisma\schema.prisma
) else if exist "prisma\schema.prisma" (
    set SCHEMA_PATH=prisma\schema.prisma
) else (
    echo Arquivo schema.prisma não encontrado.
    exit /b 1
)

echo    - Usando schema em: %SCHEMA_PATH%

set DATABASE_URL=%TEST_DATABASE_URL%

npx prisma db push --schema="%SCHEMA_PATH%" --force-reset
if %errorlevel% neq 0 (
    echo Erro ao sincronizar o Prisma.
    exit /b 1
)

echo Banco de dados de teste sincronizado e pronto!
echo Agora basta rodar: pnpm test

endlocal
