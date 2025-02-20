/*global UIkit, Vue */

(() => {
  let websocketClient = null

  const notification = (config) =>
    UIkit.notification({
      pos: "top-right",
      timeout: 5000,
      ...config,
    });

  const alert = (message) =>
    notification({
      message,
      status: "danger",
    });

  const info = (message) =>
    notification({
      message,
      status: "success",
    });

  const fetchJson = (...args) =>
    fetch(...args)
      .then((res) =>
        res.ok
          ? res.status !== 204
            ? res.json()
            : null
          : res.text().then((text) => {
              throw new Error(text);
            })
      )
      .catch((err) => {
        alert(err.message);
      });

  new Vue({
    el: "#app",
    data: {
      desc: "",
      activeTimers: [],
      oldTimers: [],
    },
    methods: {
      createTimer() {
        const description = this.desc;
        this.desc = "";
        fetchJson(`${basePath}/api/timers`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        }).then(({ id }) => {
          info(`Created new timer "${description}" [${id}]`);
        });
      },
      stopTimer(id) {
        fetchJson(`${basePath}/api/timers/${id}/stop`, {
          method: "post",
        }).then(() => {
          info(`Stopped the timer [${id}]`);
          websocketClient.send(JSON.stringify({
            type: 'old_timers'
          }))
        });
      },
      formatTime(ts) {
        return new Date(ts).toTimeString().split(" ")[0];
      },
      formatDuration(d) {
        d = Math.floor(d / 1000);
        const s = d % 60;
        d = Math.floor(d / 60);
        const m = d % 60;
        const h = Math.floor(d / 60);
        return [h > 0 ? h : null, m, s]
          .filter((x) => x !== null)
          .map((x) => (x < 10 ? "0" : "") + x)
          .join(":");
      },
      initWebSockets() {
        try {
          websocketClient = new WebSocket(`wss://${location.host}${basePath}`)
        } catch (err) {
          console.error(err)
        }

        websocketClient.addEventListener('message', (msg) => {
          const data = JSON.parse(msg.data)
          const messageType = data?.type;
          const message = data?.message ?? {};

          switch (messageType) {
            case 'all_timers':
              this.activeTimers = message?.timers?.active ?? [];
              this.oldTimers = message?.timers?.old ?? [];
              break;
            case 'active_timers':
                this.activeTimers = message?.timers ?? [];
                break;
            case 'old_timers':
                this.oldTimers = message?.timers ?? [];
                break;
            default:
              break;
          }
        })
      },
    },
    created() {
      this.initWebSockets()
    },
  });
})();
