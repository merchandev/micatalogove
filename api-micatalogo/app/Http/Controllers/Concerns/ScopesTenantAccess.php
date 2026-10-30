<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait ScopesTenantAccess
{
    protected function applyTenantScope(Builder $query, User $user, string $column = 'tenant_id'): Builder
    {
        if ($user->isPlatformAdmin()) {
            return $query;
        }

        $tenantId = $user->tenant?->id;

        if (!$tenantId) {
            abort(403, 'No hay una tienda asociada a esta cuenta.');
        }

        return $query->where($column, $tenantId);
    }

    protected function tenantForWrite(User $user, ?int $tenantId = null): Tenant
    {
        if ($user->isPlatformAdmin()) {
            if (!$tenantId) {
                abort(422, 'Debes indicar la tienda.');
            }

            return Tenant::query()->findOrFail($tenantId);
        }

        $tenant = $user->tenant;

        if (!$tenant) {
            abort(403, 'No hay una tienda asociada a esta cuenta.');
        }

        if ($tenantId && (int) $tenantId !== (int) $tenant->id) {
            abort(403, 'No puedes gestionar otra tienda.');
        }

        return $tenant;
    }

    protected function tenantIdsFor(User $user): array
    {
        if ($user->isPlatformAdmin()) {
            return Tenant::query()->pluck('id')->all();
        }

        return $user->tenant ? [$user->tenant->id] : [];
    }
}
