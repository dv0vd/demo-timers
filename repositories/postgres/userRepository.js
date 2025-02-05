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
  createSession: async function (userId) {
    const [session] = await knex('sessions').insert({ user_id: userId }).returning('id')

    return session.id;
  },

  createUser: async function (username, password) {
    const [user] = await knex('users').insert({ username, password }).returning('*');

    return user;
  },

  deleteSession: async function (id) {
    return await knex('sessions').where({ id }).delete();
  },

  getUserById: async function (id) {
    const [user] = await knex('users').where({ id });

    return user;
  },

  getUserByUsername: async function (username) {
    const [user] = await knex('users').where({ username }).limit(1);

    return user
  },

  getUserIdBySessionId: async function (sessionId) {
    const [session] = await knex('sessions').where({ id: sessionId }).returning('user_id');

    return session.user_id
  },
};
