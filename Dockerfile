FROM php:8.2-apache

# Install dependencies dasar dan Node.js (buat React/Inertia)
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Aktifkan mod_rewrite Apache untuk Laravel
RUN a2enmod rewrite

# Install ekstensi database (MySQL wajib untuk TiDB)
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Atur folder kerja
WORKDIR /var/www/html

# Pindahkan semua file kodingan ke dalam server
COPY . .

# Ubah root folder Apache ke /public (wajib buat Laravel)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Build backend (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Build frontend (React/Inertia)
RUN npm install
RUN npm run build

# Beri izin akses pada folder storage & cache (biar ga error Permission Denied)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80