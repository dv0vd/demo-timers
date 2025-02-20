# Timers
## https://dv0vd.xyz/demo/timers 
A timer management website built with Node.js, Express, the service-repository pattern, and WebSockets.

## Getting started  
1) Configure the `.env` file.
2) In `./public/main.js`, set the `basePath` constant to `''`.
3) In `utils.js`, set the `basePath` constant to `''`.
4) In `podman-compose.yml`, uncomment the ports, the bridged network and the depends_on section.
5) Run the command `make init`.
6) Start the project with: `make start`.
7) To stop or restart the project, use `make stop` and `make restart`, respectively.
