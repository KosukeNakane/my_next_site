FROM php:8.2-apache

RUN apt-get update && apt-get install -y unzip git libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

COPY . /var/www/html/
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 10000
CMD ["apache2-foreground"]
