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
        $after = null,
        $user_id = null,
        $user_name = null,
        $user_role = null,
        $session_id = null
    ) {
        AuditLog::create([
            'user_id' => $user_id ? $user_id : $request->header('x-user-id'),
            'user_name' => $user_name ? $user_name : $request->header('x-user-name'),
            'user_role' => $user_role ? $user_role : $request->header('x-user-role'),
            'session_id' => $session_id ? $session_id : $request->header('x-session-id'),
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
