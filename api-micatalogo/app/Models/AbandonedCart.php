<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbandonedCart extends Model
{
    protected $fillable = [
        'tenant_id',
        'session_id',
        'customer_name',
        'customer_phone',
        'status',
        'total_amount',
        'items',
        'source',
        'last_activity_at',
        'converted_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'items' => 'array',
        'last_activity_at' => 'datetime',
        'converted_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
