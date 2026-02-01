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

    Route::group(['prefix' => 'audit-logs', 'middleware' => 'admin'], function() {
        Route::get('/', [AuditLogController::class, 'index']);
        Route::post('/', [AuditLogController::class, 'store']);
        Route::get('/{auditLog}', [AuditLogController::class, 'get']);
    });
});
