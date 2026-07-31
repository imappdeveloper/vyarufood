#!/bin/sh
set -e

cd /var/www

if [ ! -f .env ]; then
    printf 'APP_KEY=\n' > .env
fi

if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" ]; then
    php artisan key:generate --force --no-interaction
fi

for i in $(seq 1 30); do
    if php artisan migrate --force --no-interaction; then
        break
    fi
    echo "Waiting for database... ($i/30)"
    sleep 3
done

php artisan storage:link --force --no-interaction || true

php artisan package:discover --ansi || true

php artisan config:cache || true

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

php-fpm &

php artisan queue:work --sleep=3 --tries=3 --max-time=3600 &

exec nginx -g 'daemon off;'
