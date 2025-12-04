
@echo off
start cmd /c "cd server && pnpm install && pnpm dev"

cd client
pnpm install
pnpm dev
