const express = require("express");
require("express-group-routes");

const router = express.Router();

const timerService = require("../services/timerService")
const userService = require("../services/userService")

router.group("/api/timers", (router) => {
  router
    .route("/")
    .get(userService.authApi, async (req, res) => {
      let isActive = req.query.isActive;
      if (isActive === undefined) {
        return res.status(400).json({ message: "isActive parameter is required" });
      }
      isActive = isActive === "true" ? true : false;

      return res.status(200).json(
        timerService.normalizeTimersForOutput(
          await timerService.getAllUserTimers(req.user.id),
          isActive,
        )
      );
    })
    .post(userService.authApi, async (req, res) => {
      if (req.body.description) {
        const description = req.body.description;

        const timer = await timerService.createTimer(description, req.user.id)
        return res.status(201).location(`/api/timers/${timer.id}`).json({ description, id: timer.id, progress: 0 });
      } else {
        return res.status(400).json({ message: "No description" });
      }
    });

  router.post("/:id/stop", userService.authApi, async (req, res) => {
    const id = req.params.id;
    const timer = await timerService.getTimerById(id);

    if (!timer) {
      return res.status(404).json({ message: `Timer with id='${id}' not found` });
    }

    if (!timer.is_active) {
      return res.status(400).json({ message: `Timer with id='${id}' was already disabled` });
    }

    await timerService.disableTimer(timer.id);

    return res.sendStatus(204);
  });
});

module.exports = router;
