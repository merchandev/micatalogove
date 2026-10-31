<?php

use App\Http\Controllers\AccountPasswordController;
use App\Http\Controllers\Admin\AbandonedCartController;
use App\Http\Controllers\Admin\ConversationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DatabaseAccessController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PlatformController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StoreSettingsController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\SupportController;
use App\Http\Controllers\Admin\TenantManagementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PublicPostController;
use App\Http\Controllers\Api\StorefrontLeadController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\EnsureSubscriptionAccess;
use App\Http\Middleware\ResolveSupportSession;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:public')->get('/plans', fn () => response()->json([
    'trial_days' => config('plans.trial_days'),
    'plans' => array_values(config('plans.plans')),
]));

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
Route::get('/domain-availability', [AuthController::class, 'domainAvailability'])->middleware('throttle:public');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::middleware('throttle:password')->group(function () {
    Route::post('/forgot-password', [PasswordResetController::class, 'forgot']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);
});
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['throttle:verification', 'signed:relative'])
    ->name('verification.verify');

Route::middleware(['auth:sanctum', 'active', 'throttle:api', ResolveSupportSession::class])->group(function () {
    Route::post('/support/stop', [SupportController::class, 'stop']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/account/password', AccountPasswordController::class)->middleware('throttle:password');
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'send'])
        ->middleware('throttle:verification-notice');

    Route::prefix('admin')->middleware(EnsureSubscriptionAccess::class)->group(function () {
        Route::get('/subscription', [SubscriptionController::class, 'show']);
        Route::post('/subscription/payments', [SubscriptionController::class, 'store']);
        Route::middleware('role:superadmin')->group(function () {
            Route::get('/platform', [PlatformController::class, 'index']);
            Route::post('/platform/stores/{tenant}/support', [SupportController::class, 'start']);
            Route::get('/platform/stores/{tenant}', [PlatformController::class, 'show']);
            Route::patch('/platform/stores/{tenant}', [PlatformController::class, 'update']);
            Route::post('/platform/stores/{tenant}/verification', [PlatformController::class, 'resendVerification'])->middleware('throttle:verification');
            Route::post('/platform/stores/{tenant}/activation', [PlatformController::class, 'activate']);
            Route::get('/subscriptions/payments', [SubscriptionController::class, 'index']);
            Route::put('/subscriptions/payments/{payment}', [SubscriptionController::class, 'review']);
        });
        Route::get('/dashboard', DashboardController::class);
        Route::get('/tenants', [TenantManagementController::class, 'index']);
        Route::get('/store', [StoreSettingsController::class, 'show']);
        Route::put('/store', [StoreSettingsController::class, 'update']);
        Route::apiResource('products', AdminProductController::class);

        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
        Route::put('/conversations/{conversation}', [ConversationController::class, 'update']);
        Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'storeMessage']);

        Route::get('/carts', [AbandonedCartController::class, 'index']);
        Route::put('/carts/{cart}', [AbandonedCartController::class, 'update']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::put('/orders/{order}', [OrderController::class, 'update']);

        Route::middleware('role:admin,superadmin')->group(function () {
            Route::apiResource('posts', PostController::class);
            Route::apiResource('users', UserManagementController::class)->except(['show']);
            Route::post('/users/{user}/approve', [UserManagementController::class, 'approve']);
            Route::post('/users/{user}/suspend', [UserManagementController::class, 'suspend']);
        });

        Route::middleware('role:superadmin')->get('/database', DatabaseAccessController::class);
    });
});

// Throttles run before the store lookup in EnsureSubscriptionAccess.
Route::middleware(['throttle:public', EnsureSubscriptionAccess::class])->group(function () {
    Route::get('/tenants/{domain}', [TenantController::class, 'show']);
    Route::get('/tenants/{domain}/products', [ProductController::class, 'index']);
    Route::get('/tenants/{domain}/products/{product}', [ProductController::class, 'show']);
});
Route::post('/tenants/{domain}/carts', [StorefrontLeadController::class, 'trackCart'])
    ->middleware(['throttle:carts', EnsureSubscriptionAccess::class]);
Route::post('/tenants/{domain}/checkout', [StorefrontLeadController::class, 'checkout'])
    ->middleware(['throttle:checkout', EnsureSubscriptionAccess::class]);

Route::middleware('throttle:public')->group(function () {
    Route::get('/posts', [PublicPostController::class, 'index']);
    Route::get('/posts/{slug}', [PublicPostController::class, 'show']);
});
