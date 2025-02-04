<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-email', [AuthController::class, 'verifyAccount']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/authenticated', [AuthController::class, 'authenticated']);
Route::post('/forgot-password', [ResetPasswordController::class, 'forgotPassword']);
Route::post('/reset-password/{token}', [ResetPasswordController::class, 'resetPassword']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/count/users', [UserController::class, 'count']);
    Route::resource('/users', UserController::class);
});
