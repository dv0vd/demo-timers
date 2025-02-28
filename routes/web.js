const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");

const userService = require("../services/userService")
const socketService = require("../services/socketService");
const { getBasePath, getSIDCookieName } = require("../utils");

const router = express.Router();
router.use(cookieParser());
router.use(userService.auth);

router.get("/", (req, res) => {
  res.render("index", { activeTimers: [], oldTimers: [], user: req.user, basePath: getBasePath() });
});

router.post("/login", bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await userService.isRegistered(username);

  if (!user || !userService.checkPassword(password, user.password)) {
    return res.render("index", { authError: "Invalid username or password", basePath: getBasePath() });
  }

  const sessionId = await userService.createSession(user.id);

  return res.cookie(getSIDCookieName(), sessionId, { httpOnly: true }).redirect(getBasePath());
});

router.get("/logout", async (req, res) => {
  const sessionId = req.cookies[getSIDCookieName()]

  if (sessionId) {
    await userService.deleteSession(sessionId);
    await socketService.deleteSocketBySessionId(sessionId);
  }

  return res.clearCookie(getSIDCookieName()).redirect(getBasePath());
});

router.post("/signup", bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const username = req.body.username;
  const isRegistered  = await userService.isRegistered(username)

  if (isRegistered) {
    return res.render("index", {
        authError: `Username '${username}' is already exists`,
        basePath: getBasePath(),
    });
  }

  const user = await userService.register(username, req.body.password);
  const sessionId = await userService.createSession(user.id);

  return res.cookie(getSIDCookieName(), sessionId, { httpOnly: true }).redirect(getBasePath());
});

module.exports = router;
