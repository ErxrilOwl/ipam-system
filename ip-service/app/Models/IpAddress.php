<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IpAddress extends Model
{
    protected $fillable = [
        'ip_address',
        'label',
        'comment',
        'created_by',
        'user_name'
    ];

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['ip_address'] ?? null, function($q, $ipAddress) {
                $q->where('ip_address', 'LIKE', "%{$ipAddress}%");
            })
            ->when($filters['label'] ?? null, function($q, $label) {
                $q->where('label', 'LIKE', "%{$label}%");
            })
            ->when($filters['search'] ?? null, function($q, $search) {
                $q
                    ->where('ip_address', 'LIKE', "%{$search}%")
                    ->where('label', 'LIKE', "%{$search}%");
            });
    }
}
