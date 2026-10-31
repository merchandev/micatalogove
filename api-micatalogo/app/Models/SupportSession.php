<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SupportSession extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['expires_at' => 'datetime', 'ended_at' => 'datetime'];
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function context(): array
    {
        return ['id' => $this->id, 'tenant_name' => $this->tenant?->name, 'expires_at' => $this->expires_at->toIso8601String()];
    }
}
