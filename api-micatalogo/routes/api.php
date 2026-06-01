<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::apiResource('products', AdminProductController::class);
    });
});

// Rutas Públicas (Catálogo del vendedor)
Route::get('/tenants/{domain}', [TenantController::class, 'show']);
Route::get('/tenants/{domain}/products', [ProductController::class, 'index']);
