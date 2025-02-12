require('dotenv').config()

const { getMongoConnectionString } = require('../../utils')
const { MongoClient, ObjectId } = require('mongodb')
const client = new MongoClient(getMongoConnectionString())
const db = client.db(process.env.TIMERS_DB_NAME)

module.exports = {
  createSession: async function (userId) {
    const { insertedId } = await db.collection('sessions').insertOne({ user_id: userId })

    return insertedId.toString();
  },

  createUser: async function (username, password) {
    const { insertedId } = await db.collection('users').insertOne({ username, password })

    const user = await this.getUserById(insertedId)
    user.id = user._id;

    return user;
  },

  deleteSession: async function (id) {
    const { deletedCount } = await db.collection('sessions').deleteOne({ _id: new ObjectId(id) })

    return deletedCount;
  },

  getUserById: async function (id) {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) })
    if (!user) {
      return null
    }

    user.id = user._id;

    return user;
  },

  getUserByUsername: async function (username) {
    const user = await db.collection('users').findOne({ username })

    if (!user) {
      return null
    }

    user.id = user._id;

    return user
  },

  getUserIdBySessionId: async function (sessionId) {
    const session = await db.collection('sessions').findOne({ _id: new ObjectId(sessionId) })

    return session?.user_id.toString()
  },
};
