require('dotenv').config()

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
})

module.exports = {
  createTimer: async function (description, userId) {
    const [timer] = await knex('timers').insert({
      description: description,
      user_id: userId,
    }).returning('*')

    return timer;
  },

  getTimerById: async function (timerId) {
    const [timer] = await knex('timers').where({ id: timerId })

    return timer
  },

  getTimersByUserId: async function (userId) {
    return await knex('timers').where({ user_id: userId})
  },

  stopTimer: async function (timerId, endTime) {
    await knex('timers').where({ id: timerId }).update({ is_active: false, end: endTime });
  },
};
