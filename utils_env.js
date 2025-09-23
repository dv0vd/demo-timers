function getBasePath() {
  return '$BASE_PATH';
}

function getMongoConnectionString() {
  return `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
}

function getSIDCookieName() {
  return 'SID_timers';
}

module.exports = {
  getMongoConnectionString,
  getBasePath,
  getSIDCookieName,
}
