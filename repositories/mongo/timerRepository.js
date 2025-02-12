require('dotenv').config()

const { getMongoConnectionString } = require('../../utils')
const { MongoClient, ObjectId } = require('mongodb')
const client = new MongoClient(getMongoConnectionString())
const db = client.db(process.env.TIMERS_DB_NAME)

module.exports = {
  createTimer: async function (description, userId) {
    const { insertedId } = await db.collection('timers').insertOne({
      description: description,
      user_id: userId,
      is_active: true,
      start: Date.now()
    });

    const timer = await this.getTimerById(insertedId)

    return timer;
  },

  getTimerById: async function (timerId) {
    const timer = await db.collection('timers').findOne({ _id: new ObjectId(timerId) })
    if (!timer) {
      return null
    }
    timer.id = timer._id

    return timer
  },

  getTimersByUserId: async function (userId) {
    const timers = await db.collection('timers').find({ user_id: new ObjectId(userId) }).toArray(0)
    if (!timers) {
      return null
    }

    timers.forEach((timer) => {
      timer.id = timer._id
    });

    return timers
  },

  stopTimer: async function (timerId, endTime) {
    await db.collection('timers').updateOne(
      { _id: new ObjectId(timerId) },
      { $set: { is_active: false, end: endTime } }
    )
    const timer = await this.getTimerById(timerId)

    return timer
  },
};
