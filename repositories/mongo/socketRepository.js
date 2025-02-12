require('dotenv').config()

const { getMongoConnectionString } = require('../../utils')
const { MongoClient, ObjectId } = require('mongodb')
const client = new MongoClient(getMongoConnectionString())
const db = client.db(process.env.TIMERS_DB_NAME)

module.exports = {
  createSocket: async function (sessionId) {
    const { insertedId } = await db.collection('sockets').insertOne({ sessionId })

    const socket = await this.getSocketBySessionId(insertedId)

    return socket;
  },

  deleteSocketBySessionId: async function (sessionId) {
      const { deletedCount } = await db.collection('sockets').deleteOne({ sessionId })

      return deletedCount;
    },

  getSocketBySessionId: async function (sessionId) {
    const socket = await db.collection('sockets').findOne({ sessionId })

    if (!socket) {
      return null
    }

    return socket?.socket
  },
};
