FROM php:7-apache
RUN docker-php-ext-install mysqli
RUN docker-php-ext-enable mysqli
CMD ["apache2-foreground"]
