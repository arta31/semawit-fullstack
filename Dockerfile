FROM php:8.2-apache

# Install dependencies dasar dan Node.js
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Aktifkan rewrite (HANYA INI, TIDAK ADA SETTINGAN MPM)
RUN a2enmod rewrite

# Install ekstensi database
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Atur folder kerja
WORKDIR /var/www/html

# Pindahkan semua file kodingan ke dalam server
COPY . .

# Ubah root folder Apache ke /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Build backend
RUN composer install --no-dev --optimize-autoloader

# Build frontend
RUN npm install
RUN npm run build

# Beri izin akses pada folder
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
