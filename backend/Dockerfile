# Dockerfile simple pour backend Symfony
FROM php:8.2-apache

# Extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_mysql zip

# Apache configuration
RUN a2enmod rewrite
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy et install
COPY . .
RUN composer install --no-interaction --optimize-autoloader

# Permissions
RUN chown -R www-data:www-data var/ public/

EXPOSE 80
