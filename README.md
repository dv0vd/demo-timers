# Timers

## Live demo: https://dv0vd.dev/demo/timers 
## Podman/Docker image: https://hub.docker.com/r/dv0vd/demo-timers

A timer management website built with Node.js, Express, the service-repository pattern, and WebSockets.

## Getting started

### Podman Compose (includes a built-in database)
1) Configure the `.env` file.
2) Run the command `make init`.
3) Start the project with: `make start`.
4) To stop or restart the project, use `make stop` and `make restart`, respectively.

### Podman image (use your own MongoDB)
Run the container with your MongoDB:
```
podman run \
  -d \
  -e DB_HOST=<your-mongodb-host> \
  -e DB_PORT=<your-mongodb-port> \
  -e DB_NAME=<database-name> \
  -e BASE_PATH='/' \
  --name demo-timers \
  --restart unless-stopped \
  --memory=128M \
  --cpus=0.25  \
  docker.io/dv0vd/demo-timers
```

