# Dockerfile pour le backend Symfony (PHP)
FROM php:8.2-apache

# Install dependencies
RUN apt-get update \
    && apt-get install -y libicu-dev libzip-dev zip git unzip \
    && docker-php-ext-install intl pdo pdo_mysql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite


# Set working directory
WORKDIR /var/www/html

# Configure Apache DocumentRoot to /var/www/html/public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf


# Copy composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy app files
COPY . /var/www/html/

# Install PHP dependencies (désactive les scripts pour éviter l'erreur symfony-cmd)
RUN composer install --no-interaction --optimize-autoloader --no-scripts


# Set permissions
RUN chown -R www-data:www-data /var/www/html/var /var/www/html/public

RUN docker-php-ext-install pdo pdo_mysql

EXPOSE 80
CMD ["apache2-foreground"]
