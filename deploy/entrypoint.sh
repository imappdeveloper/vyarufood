#!/bin/sh
set -u

cd /var/www

echo "==> [entrypoint] boot: creating .env if missing"
if [ ! -f .env ]; then
    printf 'APP_KEY=\n' > .env
fi

echo "==> [entrypoint] boot: generating app key"
php artisan key:generate --force --no-interaction || echo "!! key:generate failed (continuing)"

echo "==> [entrypoint] boot: running migrations (retry x30)"
for i in $(seq 1 30); do
    if php artisan migrate --force --no-interaction; then
        echo "==> [entrypoint] migrations ok"
        break
    fi
    echo "!! waiting for database... ($i/30)"
    sleep 3
done

echo "==> [entrypoint] boot: storage link"
php artisan storage:link --force --no-interaction || echo "!! storage:link failed (continuing)"

echo "==> [entrypoint] boot: package discovery"
php artisan package:discover --ansi || echo "!! package:discover failed (continuing)"

echo "==> [entrypoint] boot: config cache"
php artisan config:cache || echo "!! config:cache failed (continuing)"

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

export PORT="${PORT:-8080}"
echo "==> [entrypoint] boot: nginx on port ${PORT}"
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

echo "==> [entrypoint] starting php-fpm"
php-fpm &

echo "==> [entrypoint] starting queue worker"
php artisan queue:work --sleep=3 --tries=3 --max-time=3600 2>&1 &

echo "==> [entrypoint] starting nginx"
exec nginx -g 'daemon off;'
