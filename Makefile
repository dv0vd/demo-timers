.DEFAULT_GOAL := help
.ONESHELL:

init:
	podman run \
  --rm \
  -v ./:/app \
  docker.io/node:24.5.0-alpine \
  sh -c 'cd /app && npm ci --verbose'

start:
	set -a; . ./.env; set +a; envsubst < ./utils_env.js > ./utils.js; envsubst < ./views/index_env.njk > ./views/index.njk
	podman-compose up -d

stop:
	podman-compose down

restart: stop start


GREEN='\033[1;32m'
WHITE='\033[1;37m'
RESET='\033[0m'
help:
	@echo ${GREEN}init'             '${WHITE}— initialize the project${RESET}
	@echo ${GREEN}start'            '${WHITE}— start the project${RESET}
	@echo ${GREEN}stop'             '${WHITE}— stop the project${RESET}
	@echo ${GREEN}restart'          '${WHITE}— restart the project${RESET}
