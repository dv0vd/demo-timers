.DEFAULT_GOAL := help
.ONESHELL:

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
	@echo ${GREEN}init'             '${WHITE}— initialize the project
	@echo ${GREEN}start'            '${WHITE}— start the project
	@echo ${GREEN}start-app'        '${WHITE}— start the project without a database
	@echo ${GREEN}stop'             '${WHITE}— stop the project
	@echo ${GREEN}restart'          '${WHITE}— restart the project
