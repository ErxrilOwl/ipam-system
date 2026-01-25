<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        return AuditLog::filter($request->only(['user_id', 'resource_id']))
            ->orderByDesc('created_at')
            ->paginate(10);
    }
}
