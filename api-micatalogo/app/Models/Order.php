<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'tenant_id',
        'conversation_id',
        'customer_name',
        'customer_phone',
        'status',
        'source',
        'total_amount',
        'notes',
        'completed_at',
        'stock_applied_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'completed_at' => 'datetime',
        'stock_applied_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
