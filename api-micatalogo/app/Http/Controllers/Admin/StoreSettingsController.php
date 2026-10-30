<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StoreSettingsController extends Controller
{
    use ScopesTenantAccess;

    public function show(Request $request)
    {
        $tenant = $this->tenantForWrite($request->user(), $request->integer('tenant_id') ?: null);

        return response()->json($tenant->load('user:id,name,email,status'));
    }

    public function update(Request $request)
    {
        $tenant = $this->tenantForWrite($request->user(), $request->integer('tenant_id') ?: null);

        $request->merge([
            'domain' => Tenant::normalizeDomain(
                $request->input('domain', ''),
                $request->input('name', $tenant->name)
            ),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::notIn(Tenant::RESERVED_DOMAINS),
                Rule::unique('tenants', 'domain')->ignore($tenant->id),
            ],
            'whatsapp_number' => 'nullable|string|max:40',
            'store_description' => 'nullable|string',
            'store_logo' => 'nullable|url',
            'theme' => 'required|string|in:boutique-demo,postres-demo,tech-demo,restaurant-demo,minimal-demo',
        ], [
            'domain.min' => 'La URL debe tener al menos 3 caracteres.',
            'domain.regex' => 'La URL solo puede usar letras, numeros y guiones.',
            'domain.not_in' => 'Ese nombre de enlace esta reservado por el sistema.',
            'domain.unique' => 'Ese enlace de tienda ya esta ocupado.',
        ]);

        $tenant->update($validated);

        return response()->json($tenant->fresh('user:id,name,email,status'));
    }
}
