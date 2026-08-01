# Stage 1: build the Angular admin app
FROM node:22-alpine AS frontend
WORKDIR /app
COPY admin/package.json admin/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY admin/ ./
RUN npm run build:prod

# Stage 2: install PHP dependencies
FROM composer:latest AS composer
WORKDIR /var/www
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --ignore-platform-reqs \
    && rm -rf /root/.composer/cache

# Stage 3: runtime - Laravel API + Angular SPA + nginx + queue worker
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev libjpeg-turbo-dev freetype-dev \
    oniguruma-dev libxml2-dev zip unzip icu-dev \
    linux-headers autoconf gcc g++ make libzip-dev \
    nginx gettext

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_mysql mbstring exif pcntl bcmath gd xml zip intl opcache

RUN apk add --no-cache $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis

WORKDIR /var/www
COPY backend/ ./
COPY --from=composer /var/www/vendor ./vendor

RUN (php artisan package:discover --ansi || true)

RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

COPY --from=frontend /app/dist/browser /var/www/html

COPY deploy/nginx.conf /etc/nginx/http.d/default.conf.template
COPY deploy/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY deploy/import-db.php /var/www/deploy/import-db.php
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini

EXPOSE 9000
CMD ["sh", "/usr/local/bin/docker-entrypoint.sh"]
