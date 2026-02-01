<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateAuditLogRequest;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use App\Services\AuditLogger;
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

    public function store(CreateAuditLogRequest $request)
    {
        $auditLog = AuditLogger::log(
            $request,
            $request->action,
            $request->resource_type,
            $request->resource_id,
            $request->before ?? null,
            $request->after ?? null
        );

        return response()->json([
            'message' => 'Audit log successfully saved',
            'data' => $auditLog
        ], 201);
    }

    public function get(AuditLog $auditLog)
    {
        return response()->json($auditLog);
    }
}
