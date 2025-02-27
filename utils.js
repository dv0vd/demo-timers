function getBasePath() {
  return '/demo/timers/';
}

function getMongoConnectionString() {
  return `mongodb://${process.env.TIMERS_DB_HOST}:27017`;
}

function getSIDCookieName() {
  return 'SID_timers';
}

module.exports = {
  getMongoConnectionString,
  getBasePath,
  getSIDCookieName,
}
