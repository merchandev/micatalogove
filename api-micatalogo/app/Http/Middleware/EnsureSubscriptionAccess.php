<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($domain = $request->route('domain')) {
            $tenant = Tenant::with('user')->where('domain', $domain)->where('status', Tenant::STATUS_ACTIVE)->firstOrFail();

            // Self-registered stores are published only after the owner confirms the email address.
            if ($tenant->user?->isClient() && ! $tenant->user->hasVerifiedEmail()) {
                return response()->json([
                    'message' => 'El catálogo se publicará cuando el propietario confirme su correo.',
                    'code' => 'email_unverified',
                ], 403);
            }
        } else {
            // Owners retain read access and subscription access after expiry.
            if (! $request->user()?->isClient() || $request->isMethodSafe() || $request->is('api/admin/subscription*')) {
                return $next($request);
            }
            $tenant = $request->user()->tenant;
        }

        if ($tenant && ! $tenant->hasSubscriptionAccess()) {
            return response()->json([
                'message' => 'La suscripción de la tienda venció.',
                'code' => 'subscription_expired',
            ], 403);
        }

        return $next($request);
    }
}
