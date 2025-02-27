const { getBasePath, getSIDCookieName } = require('./utils');

require('dotenv').config()

function appInit() {
  const express = require("express");
  const app = express();
  const http = require('http')
  const webRouter = require("./routes/web")
  const apiRouter = require("./routes/api")

  app.set("view engine", "njk");

  app.use(express.json());
  app.use(getBasePath(), express.static("public"));
  app.use(getBasePath(), webRouter)
  app.use(getBasePath(), apiRouter)

  const port = process.env.PORT || 3000;
  const server = http.createServer(app)

  server.listen(port, () => {
    console.log(`  Listening on http://localhost:${port}`);
  });

  return [app, server];
}

function main() {
  const [app, server ]= appInit();
  viewsEngineInit(app);
  socketsInit(server);
}

function viewsEngineInit(app) {
  const nunjucks = require("nunjucks");
  nunjucks.configure("views", {
    autoescape: true,
    express: app,
    tags: {
      blockStart: "[%",
      blockEnd: "%]",
      variableStart: "[[",
      variableEnd: "]]",
      commentStart: "[#",
      commentEnd: "#]",
    },
  });
}

function socketsInit(server) {
  const socketService = require("./services/socketService")

  const WebSocket = require('ws')
  const wss = new WebSocket.Server({ noServer: true })

  server.on('upgrade', (req, socket, head) => {
    const cookie = require('cookie')

    const sessionId = cookie.parse(req.headers['cookie'])[getSIDCookieName()]
    if (!sessionId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();

      return
    }

    req.sessionId = sessionId
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    })

    return
  });

  wss.on('connection', socketService.handleSocketConnectionEvent)
}

main();
