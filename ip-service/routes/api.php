<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\IpAddressController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'gateway.auth'], function() {
    Route::group(['prefix' => 'ip-addresses'], function() {
        Route::get('/', [IpAddressController::class, 'index']);
        Route::post('/', [IpAddressController::class, 'store']);
        Route::put('/{ipAddress}', [IpAddressController::class, 'update']);
        Route::delete('/{ipAddress}', [IpAddressController::class, 'destroy']);
    });

    Route::get('audit-logs', [AuditLogController::class, 'index']);
});
