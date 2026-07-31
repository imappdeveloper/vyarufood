#!/bin/sh
set -e

export PORT="${PORT:-80}"
: "${API_BACKEND_URL:?API_BACKEND_URL env var is required, e.g. https://your-backend.up.railway.app}"

envsubst '$PORT $API_BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
