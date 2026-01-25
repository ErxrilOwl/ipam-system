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

    public function scopeFilter($query, $filters)
    {
        if ($filters['ip_address'] ?? false) {
            $query->where('ip_address', 'LIKE', "%{$filters['ip_address']}%");
        }

        if ($filters['label'] ?? false) {
            $query->where('label', 'LIKE', "%{$filters['label']}%");
        }
    }
}
