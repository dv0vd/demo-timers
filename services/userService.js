const userRepository = require('../repositories/mongo/userRepository')
const { getSIDCookieName } = require('../utils');

module.exports = {
  auth: async function (req, res, next) {
    const sessionId = req.cookies[getSIDCookieName()];
    if (sessionId === undefined) {
      return next();
    }

    const userId = await userRepository.getUserIdBySessionId(sessionId)
    if (!userId) {
      return next();
    }

    const user = await userRepository.getUserById(userId)
    if (!user) {
      return next();
    }

    req.user = user;

    return next();
  },

  authApi: function (req, res, next) {
    if (!req?.user) {
      return res.sendStatus(401);
    }

    next();
  },

  checkPassword: function (requestPassword, encryptedPassword) {
    const { hash } = require("sha-256");

    return hash(requestPassword) === encryptedPassword;
  },

  createSession: async function (userId) {
    const sessionId = await userRepository.createSession(userId)

    return sessionId;
  },

  deleteSession: async function (sessionId) {
    await userRepository.deleteSession(sessionId)
  },

  getUserIdBySessionId: async function (sessionId) {
    const userId = await userRepository.getUserIdBySessionId(sessionId)
    if (!userId) {
      return null
    }

    return userId;
  },

  isRegistered: async function (username) {
    const user = await userRepository.getUserByUsername(username)
    if (!user) {
      return false
    }

    return user;
  },

  register: async function (username, password) {
    const { hash } = require("sha-256");

    const user = await userRepository.createUser(username, hash(password))

    return user;
  },
};
