<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPayment;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class PlatformController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => ['nullable', Rule::in(['active', 'suspended', 'pending'])],
            'subscription' => ['nullable', Rule::in(['trial', 'active', 'expired'])],
            'activation' => ['nullable', Rule::in(['verified', 'pending', 'expired'])],
        ]);
        $query = Tenant::with('user')->withCount('products')
            ->withCount(['subscriptionPayments as pending_payments_count' => fn ($q) => $q->where('status', 'pending')])
            ->withSum(['subscriptionPayments as approved_payments_total' => fn ($q) => $q->where('status', 'approved')], 'amount');
        if ($search = $filters['search'] ?? null) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('domain', 'like', "%{$search}%")
                ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")));
        }
        if ($status = $filters['status'] ?? null) {
            $query->where('status', $status);
        }
        if ($subscription = $filters['subscription'] ?? null) {
            if ($subscription === 'active') {
                $query->where('subscribed_until', '>', now());
            } else {
                $query->where(fn ($q) => $q->whereNull('subscribed_until')->orWhere('subscribed_until', '<=', now()));
                $subscription === 'trial'
                    ? $query->where('trial_ends_at', '>', now())
                    : $query->where(fn ($q) => $q->whereNull('trial_ends_at')->orWhere('trial_ends_at', '<=', now()));
            }
        }
        if ($activation = $filters['activation'] ?? null) {
            $query->whereHas('user', function ($q) use ($activation) {
                if ($activation === 'verified') {
                    $q->whereNotNull('email_verified_at');
                } else {
                    $q->whereNull('email_verified_at')->where('created_at', $activation === 'pending' ? '>' : '<=', now()->subHours(config('auth.email_verification_grace_hours', 24)));
                }
            });
        }

        $stores = $query->latest('id')->paginate(20);
        $stores->getCollection()->transform(fn (Tenant $tenant) => $this->storeData($tenant));
        $orphans = User::where('role', User::ROLE_CLIENT)->doesntHave('tenant');
        if ($search) {
            $orphans->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        return response()->json([
            'summary' => [
                'stores' => Tenant::count(),
                'clients' => User::where('role', User::ROLE_CLIENT)->count(),
                'unverified_clients' => User::where('role', User::ROLE_CLIENT)->whereNull('email_verified_at')->count(),
                'paid_stores' => Tenant::where('subscribed_until', '>', now())->count(),
                'pending_payments' => SubscriptionPayment::where('status', 'pending')->count(),
                'approved_subscription_total' => SubscriptionPayment::where('status', 'approved')->sum('amount'),
            ],
            'stores' => $stores,
            'clients_without_store' => $orphans->latest('id')->paginate(20, ['*'], 'client_page'),
        ]);
    }

    public function show(Tenant $tenant)
    {
        $tenant->load('user')->loadCount('products');

        return response()->json([
            'store' => $this->storeData($tenant),
            'payments' => $tenant->subscriptionPayments()->latest('id')->paginate(15),
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['active', 'suspended', 'pending'])]]);
        $tenant->update($data);
        Log::info('platform.store.status_changed', ['tenant_id' => $tenant->id, 'actor_id' => $request->user()->id, 'status' => $data['status']]);

        return response()->json($this->storeData($tenant->load('user')));
    }

    public function resendVerification(Request $request, Tenant $tenant)
    {
        $owner = $tenant->user;
        abort_unless($owner, 422, 'Esta tienda no tiene propietario asociado.');
        if (! $owner->hasVerifiedEmail()) {
            $owner->sendEmailVerificationNotification();
            Log::info('platform.verification.resent', ['tenant_id' => $tenant->id, 'actor_id' => $request->user()->id]);
        }

        return response()->json(['message' => $owner->hasVerifiedEmail() ? 'El correo ya está confirmado.' : 'Correo de activación enviado al propietario.']);
    }

    public function activate(Request $request, Tenant $tenant)
    {
        $owner = $tenant->user;
        abort_unless($owner?->isClient(), 422, 'La tienda no tiene un cliente asociado.');
        if (! $owner->hasVerifiedEmail() && $owner->markEmailAsVerified()) {
            event(new Verified($owner));
            Log::info('platform.activation.approved_manually', ['tenant_id' => $tenant->id, 'user_id' => $owner->id, 'actor_id' => $request->user()->id]);
        }

        return response()->json(['message' => 'Activación confirmada por el superadmin. La suscripción y las suspensiones no se modificaron.']);
    }

    private function storeData(Tenant $tenant): array
    {
        return [
            ...$tenant->toArray(),
            'subscription' => $tenant->subscriptionSummary(),
            'publicly_available' => $tenant->status === Tenant::STATUS_ACTIVE && $tenant->hasSubscriptionAccess()
                && (! $tenant->user || $tenant->user->isActive())
                && (! $tenant->user?->isClient() || $tenant->user->canPublishBeforeEmailVerification()),
        ];
    }
}
