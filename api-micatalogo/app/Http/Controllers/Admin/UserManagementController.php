<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('tenant');

        if ($request->filled('role')) {
            $query->where('role', $request->string('role'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $actor = $request->user();

        if ($request->input('role') === User::ROLE_CLIENT) {
            $request->merge([
                'domain' => Tenant::normalizeDomain(
                    $request->input('domain', ''),
                    $request->input('store_name', '')
                ),
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in([User::ROLE_SUPERADMIN, User::ROLE_ADMIN, User::ROLE_CLIENT])],
            'status' => ['required', Rule::in([User::STATUS_PENDING, User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
            'store_name' => 'required_if:role,client|nullable|string|max:255',
            'domain' => [
                'required_if:role,client',
                'nullable',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::notIn(Tenant::RESERVED_DOMAINS),
                Rule::unique('tenants', 'domain'),
            ],
            'theme' => 'nullable|string|in:boutique-demo,postres-demo,tech-demo,restaurant-demo,minimal-demo',
        ]);

        if (!$actor->isSuperAdmin() && $validated['role'] !== User::ROLE_CLIENT) {
            abort(403, 'Solo el superadmin puede crear administradores.');
        }

        $user = DB::transaction(function () use ($validated, $actor) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => $validated['status'],
                'approved_at' => $validated['status'] === User::STATUS_ACTIVE ? now() : null,
                'approved_by' => $validated['status'] === User::STATUS_ACTIVE ? $actor->id : null,
            ]);
            // Accounts created by platform staff do not need the self-registration email check.
            $user->markEmailAsVerified();

            if ($user->isClient()) {
                Tenant::create([
                    'user_id' => $user->id,
                    'name' => $validated['store_name'],
                    'domain' => $validated['domain'],
                    'theme' => $validated['theme'] ?? 'boutique-demo',
                    'status' => match ($validated['status']) {
                        User::STATUS_ACTIVE => Tenant::STATUS_ACTIVE,
                        User::STATUS_SUSPENDED => Tenant::STATUS_SUSPENDED,
                        default => Tenant::STATUS_PENDING,
                    },
                ]);
            }

            return $user->load('tenant');
        });

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $actor = $request->user();
        $this->guardAdministratorTarget($actor, $user);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => ['sometimes', Rule::in([User::ROLE_SUPERADMIN, User::ROLE_ADMIN, User::ROLE_CLIENT])],
            'status' => ['sometimes', Rule::in([User::STATUS_PENDING, User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
            'theme' => 'sometimes|string|in:boutique-demo,postres-demo,tech-demo,restaurant-demo,minimal-demo',
        ]);

        if (!$actor->isSuperAdmin() && isset($validated['role']) && $validated['role'] !== User::ROLE_CLIENT) {
            abort(403, 'Solo el superadmin puede asignar roles administrativos.');
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if (($validated['status'] ?? null) === User::STATUS_ACTIVE && !$user->approved_at) {
            $validated['approved_at'] = now();
            $validated['approved_by'] = $actor->id;
        }

        $user->update($validated);
        $this->syncTenantStatus($user);

        if (isset($validated['theme']) && $user->tenant) {
            $user->tenant->update(['theme' => $validated['theme']]);
        }

        return response()->json($user->fresh('tenant'));
    }

    public function approve(Request $request, User $user)
    {
        $this->guardAdministratorTarget($request->user(), $user);

        $user->update([
            'status' => User::STATUS_ACTIVE,
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        $this->syncTenantStatus($user);

        return response()->json($user->fresh('tenant'));
    }

    public function suspend(Request $request, User $user)
    {
        $this->guardAdministratorTarget($request->user(), $user);

        if ($request->user()->id === $user->id) {
            abort(422, 'No puedes suspender tu propia cuenta.');
        }

        $user->update(['status' => User::STATUS_SUSPENDED]);
        $this->syncTenantStatus($user);

        return response()->json($user->fresh('tenant'));
    }

    public function destroy(Request $request, User $user)
    {
        $actor = $request->user();

        if ($actor->id === $user->id) {
            abort(422, 'No puedes eliminar tu propia cuenta.');
        }

        if ($user->isPlatformAdmin() && !$actor->isSuperAdmin()) {
            abort(403, 'Solo el superadmin puede eliminar administradores.');
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }

    private function guardAdministratorTarget(User $actor, User $target): void
    {
        if ($target->isPlatformAdmin() && !$actor->isSuperAdmin()) {
            abort(403, 'Solo el superadmin puede modificar administradores.');
        }
    }

    private function syncTenantStatus(User $user): void
    {
        if (!$user->tenant) {
            return;
        }

        $status = match ($user->status) {
            User::STATUS_ACTIVE => Tenant::STATUS_ACTIVE,
            User::STATUS_SUSPENDED => Tenant::STATUS_SUSPENDED,
            default => Tenant::STATUS_PENDING,
        };

        $user->tenant->update(['status' => $status]);
    }
}
