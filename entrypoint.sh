BASE_PATH="${BASE_PATH:-/}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-27017}"
DB_NAME="${DB_NAME:-dbname}"
DB_USER="${DB_USER:-user}"
DB_PASSWORD="${DB_PASSWORD:-pasword}"
export DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD BASE_PATH

envsubst < ./utils_env.js > ./utils.js
envsubst < ./views/index_env.njk > ./views/index.njk

exec npm start
