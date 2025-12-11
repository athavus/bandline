@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: SCRIPT PARA CONFIGURAÇÃO DE TESTES (SEM BANCO DE DADOS)
:: ==============================================================================
:: Este script prepara o ambiente para rodar APENAS os testes que não dependem do Postgres.

echo Iniciando setup para testes SEM banco de dados...

:: ------------------------------------------------------------------------------
:: 1. VERIFICAÇÃO DE DEPENDÊNCIAS
:: ------------------------------------------------------------------------------

:: Verificar Node.js
node -v > temp_node_version.txt
set /p NODE_VER=<temp_node_version.txt
del temp_node_version.txt
echo Node version: %NODE_VER% (Recomendado: v20)

:: Verificar pnpm
where pnpm >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo pnpm nao encontrado. Instalando via npm...
    npm install -g pnpm
    IF %ERRORLEVEL% NEQ 0 (
        echo Falha ao instalar pnpm. Instale manualmente.
        exit /b 1
    )
)

:: ------------------------------------------------------------------------------
:: 2. INSTALAÇÃO DE PACOTES
:: ------------------------------------------------------------------------------
echo Instalando dependencias (pnpm install)...
pnpm install
if %errorlevel% neq 0 (
    echo Falha ao instalar dependencias.
    exit /b 1
)

echo Setup concluido!
echo Para rodar os testes sem banco, use:
echo pnpm run test:nodb
echo.
pause
