<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

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

    public function ipAddress()
    {
        return $this->belongsTo(IpAddress::class, 'resource_id', 'id');
    }

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['user_name'] ?? null, function($q, $userName) {
                $q->where('user_name', 'LIKE', "%{$userName}%");
            })
            ->when($filters['action'] ?? null, function($q, $action) {
                $q->where('action', $action);
            })
            ->when($filters['resource_type'] ?? null, function($q, $resource_type) {
                $q->where('resource_type', $resource_type);
            })
            ->when($filters['ip_address'] ?? null, function($q, $ipAddress) {
                $q->whereHas('ipAddress', function ($qq) use($ipAddress) {
                    $qq->where('ip_address', 'LIKE', "%{$ipAddress}%");
                });
            })
            ->when($filters['search'] ?? null, function($q, $search) {
                $q->whereHas('ipAddress', function ($qq) use($search) {
                    $qq->where('ip_address', 'LIKE', "%{$search}%");
                })
                ->orWhere('user_name', 'LIKE', "%{$search}%")
                ->orWhere('action', $search);
            });
    }
}
