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

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist \
    && rm -rf /root/.composer/cache

COPY . .

RUN composer dump-autoload --no-dev --optimize --no-scripts \
    && (php artisan package:discover --ansi || true)

RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

COPY docker/nginx.conf /etc/nginx/http.d/default.conf.template
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini

EXPOSE 9000
CMD ["sh", "/usr/local/bin/docker-entrypoint.sh"]
