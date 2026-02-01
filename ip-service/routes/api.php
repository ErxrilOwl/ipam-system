<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\IpAddressController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'gateway.auth'], function() {
    Route::group(['prefix' => 'ip-addresses'], function() {
        Route::get('/', [IpAddressController::class, 'index']);
        Route::post('/', [IpAddressController::class, 'store']);
        Route::get('/{ipAddress}', [IpAddressController::class, 'get']);
        Route::put('/{ipAddress}', [IpAddressController::class, 'update']);
        Route::delete('/{ipAddress}', [IpAddressController::class, 'destroy']);
    });

    Route::group(['prefix' => 'audit-logs'], function() {
        Route::get('/', [AuditLogController::class, 'index']);
        Route::get('/{auditLog}', [AuditLogController::class, 'get']);
    });
});

Route::post('/audit-logs', [AuditLogController::class, 'store']);
