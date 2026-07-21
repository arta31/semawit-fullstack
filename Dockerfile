FROM php:8.2-cli

# Install dependencies dasar dan Node.js
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install ekstensi database
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Atur folder kerja
WORKDIR /app

# Pindahkan semua file kodingan ke dalam server
COPY . .

# Build backend
RUN composer install --no-dev --optimize-autoloader

# Build frontend
RUN npm install
RUN npm run build

# Beri izin akses folder
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Buka port standar (Railway akan mengatur ini otomatis)
EXPOSE 8000

# JURUS PAMUNGKAS: Jalankan server langsung dari Laravel, abaikan Apache!
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
