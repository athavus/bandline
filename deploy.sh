#!/bin/bash

cd server
pnpm install
pnpm dev &

cd ../client
pnpm install
pnpm dev
