<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::group(['middleware' => 'auth:api'], function() {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::group(['prefix' => 'users', 'middleware' => 'auth:api'], function() {
    Route::post('/', [UserController::class, 'store']);
});
