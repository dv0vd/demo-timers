function getBasePath() {
  return '/demo/timers';
}

function getMongoConnectionString() {
  return `mongodb://${process.env.TIMERS_DB_USERNAME}:${process.env.TIMERS_DB_PASSWORD}@${process.env.TIMERS_DB_HOST}:27017`;
}

module.exports = {
  getMongoConnectionString,
  getBasePath,
}
