<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'user_role',
        'user_name',
        'session_id',
        'action',
        'resource_type',
        'resource_id',
        'before',
        'after',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'before' => 'array',
        'after' => 'array'
    ];

    public static function booted()
    {
        static::updating(function() {
            abort(403);
        });

        static::deleting(function() {
            abort(403);
        });
    }

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['user_id'] ?? null, function($q, $userId) {
                $q->where('user_id', $userId);
            })
            ->when($filters['resource_id'] ?? null, function($q, $resourceId) {
                $q->where('resource_id', $resourceId);
            });
    }
}
