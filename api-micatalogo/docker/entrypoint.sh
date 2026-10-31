#!/bin/sh
set -eu

if [ "${1:-}" = "php-fpm" ]; then
    php artisan migrate --force --no-interaction
    php artisan optimize --no-interaction
fi

exec docker-php-entrypoint "$@"
