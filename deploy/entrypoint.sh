#!/bin/sh
set -u

export APP_DEBUG=true

cd /var/www

echo "==> [entrypoint] boot: creating .env if missing"
if [ ! -f .env ]; then
    printf 'APP_KEY=\nAPP_ENV=production\nAPP_DEBUG=true\n' > .env
    if [ -n "${MYSQLHOST:-}" ]; then
        export DB_CONNECTION=mysql
        export DB_HOST="$MYSQLHOST"
        export DB_PORT="${MYSQLPORT:-3306}"
        export DB_DATABASE="$MYSQLDATABASE"
        export DB_USERNAME="$MYSQLUSER"
        export DB_PASSWORD="$MYSQLPASSWORD"
        printf 'DB_CONNECTION=mysql\nDB_HOST=%s\nDB_PORT=%s\nDB_DATABASE=%s\nDB_USERNAME=%s\nDB_PASSWORD=%s\n' \
            "$DB_HOST" "$DB_PORT" "$DB_DATABASE" "$DB_USERNAME" "$DB_PASSWORD" >> .env
        echo "==> [entrypoint] mapped MYSQL* vars to Laravel DB_* (mysql)"
    else
        printf 'DB_CONNECTION=sqlite\n' >> .env
        echo "!! no MYSQL* vars found, falling back to sqlite"
    fi
fi

if [ "${DB_CONNECTION:-}" = "mysql" ]; then
    echo "==> [entrypoint] ensuring database schema (dump import)"
    php /var/www/deploy/import-db.php || echo "!! import-db failed (continuing)"
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
nginx -g 'daemon off;' &

echo "==> [entrypoint] waiting for web server, then probing /up"
for i in $(seq 1 15); do
    sleep 2
    code=$(curl -s -o /tmp/up.out -w "%{http_code}" http://127.0.0.1:${PORT}/up 2>/dev/null || echo "000")
    echo "==> [entrypoint] /up probe #${i}: HTTP ${code}"
    if [ "$code" = "200" ] || [ "$code" = "500" ]; then
        echo "==> [entrypoint] /up body:"
        cat /tmp/up.out
        echo ""
        echo "==> [entrypoint] last laravel log lines:"
        tail -n 60 /var/www/storage/logs/laravel.log 2>/dev/null || echo "(no laravel.log)"
        if [ "$code" != "200" ]; then
            echo "==> [entrypoint] HTTP boot diagnostic:"
            php -r '
                require "vendor/autoload.php";
                $app = require "bootstrap/app.php";
                $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
                echo "cached app.debug: ".var_export(config("app.debug"), true).PHP_EOL;
                config(["app.debug" => true]);
                try {
                    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
                    $response = $kernel->handle(Illuminate\Http\Request::create("http://localhost/up", "GET"));
                    echo "diag status: ".$response->getStatusCode().PHP_EOL;
                    echo "diag body:".PHP_EOL.substr($response->getContent(), 0, 4000).PHP_EOL;
                } catch (\Throwable $e) {
                    echo "DIAG EXCEPTION ".get_class($e).": ".$e->getMessage().PHP_EOL;
                    echo $e->getTraceAsString().PHP_EOL;
                }
            ' 2>&1 || echo "!! php diag failed"
        fi
        break
    fi
done

wait
