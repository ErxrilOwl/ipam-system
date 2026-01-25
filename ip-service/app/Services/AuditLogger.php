<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogger
{
    public static function log(
        Request $request,
        $action,
        $resourceType,
        $resourceId = null,
        $before = null,
        $after = null
    ) {
        AuditLog::create([
            'user_id' => $request->header('x-user-id'),
            'user_name' => $request->header('x-user-name'),
            'user_role' => $request->header('x-user-role'),
            'session_id' => $request->header('x-session-id'),
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'before' => $before,
            'after' => $after,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);
    }
}
