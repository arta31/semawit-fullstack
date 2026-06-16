<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Tentukan jika aplikasi sedang dalam mode perbaikan (maintenance)...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Daftarkan Autoloader Composer...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel dan tangani request aktif...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());