FROM php:8.3-cli-alpine

# Install system dependencies and build packages
RUN apk add --no-cache \
    curl \
    git \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    bash

# Install PHP extensions required by Laravel & PostgreSQL
RUN docker-php-ext-install pdo pdo_pgsql pgsql bcmath zip

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000

CMD ["sh", "-c", "composer install --no-interaction && php artisan serve --host=0.0.0.0 --port=8000"]
