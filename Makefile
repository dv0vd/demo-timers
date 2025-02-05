.DEFAULT_GOAL := help

init:
	podman-compose run backend sh -c 'cd /app && npm i --verbose'
	podman-compose run frontend sh -c 'cd /app && npm i --verbose'
	$(MAKE) restart


start:
	podman-compose up -d

stop:
	podman-compose down

restart: stop start


GREEN='\033[1;32m'
WHITE='\033[1;37m'
help:
	@echo ${GREEN}'	'init${WHITE}'                               '—' 'инициализация' 'проекта;
	@echo ${GREEN}'	'start${WHITE}'                               '—' 'запуск' 'БД' 'и' 'бэкэнда;
	@echo ${GREEN}'	'stop${WHITE}'                                '—' 'остановка' 'БД' 'и' 'бэкэнда;
	@echo ${GREEN}'	'restart${WHITE}'                             '—' 'рестарт' 'БД' 'и' 'бэкэнда;
