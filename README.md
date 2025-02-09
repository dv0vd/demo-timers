# Timers
A timer management website built with Node.js, Express, the service-repository pattern, and WebSockets.

## Getting started  
1) Configure the `.env` file.
2) In `./public/main.js`, set the `basePath` constant to `''`.
3) In `utils.js`, set the `basePath` constant to `''`.
4) In `podman-compose.yml`, uncomment the ports and the bridged network.
2) Run the command `make init`.
3) Start the project with: `make start`.
4) To stop or restart the project, use `make stop` and `make restart`, respectively.
