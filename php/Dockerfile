FROM php:8.2-apache

COPY . /var/www/html/

RUN apt-get update && apt-get install -y unzip git \
    && docker-php-ext-install pdo pdo_mysql