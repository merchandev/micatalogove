<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'tenant_id',
        'customer_name',
        'customer_phone',
        'subject',
        'message',
        'source',
        'status',
        'last_contact_at',
        'metadata',
    ];

    protected $casts = [
        'last_contact_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function messages()
    {
        return $this->hasMany(ConversationMessage::class);
    }

    public function order()
    {
        return $this->hasOne(Order::class);
    }
}
