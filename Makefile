.PHONY: install dev build start docker-dev

install:
	pnpm install --frozen-lockfile

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

docker-dev:
	docker compose up --build
