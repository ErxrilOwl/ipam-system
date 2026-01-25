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

    public function scopeFilter($query, $filters)
    {
        if ($filters['user_id'] ?? false) {
            $query->where('user_id', $filters['user_id']);
        }

        if ($filters['resource_id'] ?? false) {
            $query->where('resource_id', $filters['resource_id']);
        }
    }
}
