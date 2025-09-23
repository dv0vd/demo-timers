const socketRepository = require('../repositories/mongo/socketRepository')
const timerService = require('./timerService')

async function createSocket (sessionId) {
  const socket = await socketRepository.createSocket(sessionId)

  return socket;
}

function sendSocketMessage(socket, message) {
  try {
    socket.send(JSON.stringify(message))
  } catch (err) {
    //
  }
}

module.exports = {
  createSocket,

  deleteSocketBySessionId: async function (sessionId) {
    const socket = await socketRepository.deleteSocketBySessionId(sessionId)

    return socket;
  },

  handleSocketConnectionEvent: async function (ws, req) {
    const userService = require('./userService')

    const sessionId = req.sessionId;
    if (!sessionId) {
      await this.deleteSocketBySessionId(sessionId)

      return
    }

    const userId = await userService.getUserIdBySessionId(sessionId)
    if (!userId) {
      //
      return
    }

    await createSocket(sessionId, ws)

    let allTimers = await timerService.getAllUserTimers(userId)

    await sendSocketMessage(
      ws,
      {
        type: 'all_timers',
        message: {
          timers: {
            active: timerService.normalizeTimersForOutput(allTimers, true),
            old: timerService.normalizeTimersForOutput(allTimers, false),
          }
        }
      }
    );

    setInterval(async () => {
      // TODO optimize
      allTimers = await timerService.getAllUserTimers(userId)
      await sendSocketMessage(
        ws,
        {
          type: 'active_timers',
          message: {
            timers: timerService.normalizeTimersForOutput(allTimers, true),
          }
        }
      );
    }, 1000)

    ws.on('message', (msg) => {
      handleSocketMessageEvent(ws, msg, userId)
    });

    ws.on('close', handleSocketCloseEvent)
  },
};

async function handleSocketCloseEvent(ws, req) {
  const sessionId = req.sessionId

  if (sessionId) {
    await this.deleteSocketBySessionId(sessionId)
  }
}

async function handleSocketMessageEvent(ws, msg, userId) {
  const message = JSON.parse(msg)
  const messageType = message?.type
  let allTimers = [];

  switch (messageType) {
    case 'old_timers':
      // TODO optimize
      allTimers = await timerService.getAllUserTimers(userId)
      await sendSocketMessage(
        ws,
        {
          type: 'old_timers',
          message: {
            timers: timerService.normalizeTimersForOutput(allTimers, false),
          }
        }
      );
      break;
    default:
      break;
  }
}

