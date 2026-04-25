# Serves pre-built React frontend and PHP API from the same process
FROM php:7-apache

# sqlite3 CLI for migration scripts; enable mod_rewrite for SPA routing and headers for cache control
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-enable opcache \
    && a2enmod rewrite headers \
    && echo 'opcache.validate_timestamps=0' > /usr/local/etc/php/conf.d/opcache-prod.ini

COPY docker/app/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY assets/db/ /db/
COPY build/ /var/www/html/
RUN mkdir -p /var/www/html/database

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["apache2-foreground"]

