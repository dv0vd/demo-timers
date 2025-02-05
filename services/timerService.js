const timerRepository = require('../repositories/mongo/timerRepository')

function getDuration(start, end) {
  return end - start;
}

function getProgress(startTime, endTime) {
  if (!endTime) {
    return getDuration(startTime, Date.now());
  }

  return getDuration(startTime, endTime);
}

module.exports = {
  authApi: function (req, res, next) {
    if (!req?.user) {
      return res.sendStatus(401);
    }

    return next();
  },

  createTimer: async function (description, userId) {
    return await timerRepository.createTimer(description, userId)
  },

  disableTimer: async function (timerId) {
    await timerRepository.stopTimer(timerId, Date.now())
  },

  getAllUserTimers: async function (userId) {
    return await timerRepository.getTimersByUserId(userId)
  },

  getTimerById: async function (timerId) {
    return await timerRepository.getTimerById(timerId)
  },

  normalizeTimersForOutput: function (userTimers, isActive) {
    const timers = [];

    userTimers.forEach((timer, timerId) => {
      if (timer.is_active === isActive) {
        if (isActive) {
          timer.progress = getProgress(timer.start, null);
        } else {
          timer.duration = getDuration(timer.start, timer.end);
        }

        timers.push(timer);
      }
    });

    return timers
  },
};
