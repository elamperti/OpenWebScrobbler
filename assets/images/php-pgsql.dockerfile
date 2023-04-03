FROM php:7-apache
RUN apt-get update && apt-get install -y libpq-dev
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql
RUN docker-php-ext-install pgsql
RUN docker-php-ext-enable pgsql
CMD ["apache2-foreground"]
