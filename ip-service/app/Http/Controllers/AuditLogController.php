<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $params = $request->all();
        $sort = $params['sort'] ?? 'created_at';
        $order = $params['order'] ?? 'DESC';
        $limit = $params['limit'] ?? 10;

        return AuditLogResource::collection(
            AuditLog::with(['ipAddress'])->filter($params)
            ->orderBy($sort, $order)
            ->paginate($limit)
        );
    }

    public function get(AuditLog $auditLog)
    {
        return response()->json($auditLog);
    }
}
