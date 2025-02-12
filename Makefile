.DEFAULT_GOAL := help

init:
	podman run \
  --rm \
  -v ./:/app \
  docker.io/node:20.18.1-bookworm \
  sh -c 'cd /app && npm ci --verbose'

start:
	podman-compose up -d

start-app:
	podman-compose up -d app

stop:
	podman-compose down

restart: stop start


GREEN='\033[1;32m'
WHITE='\033[1;37m'
help:
	@echo ${GREEN}'	'init${WHITE}'                               '—' 'инициализация' 'проекта;
	@echo ${GREEN}'	'start${WHITE}'                               '—' 'запуск' 'БД' 'и' 'бэкэнда;
	@echo ${GREEN}'	'start-app${WHITE}'                               '—' 'запуск' 'бэкэнда;
	@echo ${GREEN}'	'stop${WHITE}'                                '—' 'остановка' 'БД' 'и' 'бэкэнда;
	@echo ${GREEN}'	'restart${WHITE}'                             '—' 'рестарт' 'БД' 'и' 'бэкэнда;
