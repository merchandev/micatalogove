<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->merge([
            'domain' => Tenant::normalizeDomain(
                $request->input('domain', ''),
                $request->input('store_name', '')
            ),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => 'required|string|min:8',
            'store_name' => 'required|string|max:255',
            'domain' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::notIn(Tenant::RESERVED_DOMAINS),
                Rule::unique('tenants', 'domain'),
            ],
            'theme' => 'required|string|in:boutique-demo,postres-demo,tech-demo,restaurant-demo,minimal-demo',
        ], [
            'name.required' => 'Indica tu nombre.',
            'email.required' => 'Indica tu correo electronico.',
            'email.email' => 'El correo electronico no es valido.',
            'email.unique' => 'Ese correo ya esta registrado. Inicia sesion o usa otro correo.',
            'password.required' => 'Indica una contrasena.',
            'password.min' => 'La contrasena debe tener al menos 8 caracteres.',
            'store_name.required' => 'Indica el nombre de tu tienda.',
            'domain.required' => 'Indica la URL de tu tienda.',
            'domain.min' => 'La URL debe tener al menos 3 caracteres.',
            'domain.regex' => 'La URL solo puede usar letras, numeros y guiones.',
            'domain.not_in' => 'Ese nombre de enlace esta reservado por el sistema. Prueba una de las sugerencias.',
            'domain.unique' => 'Ese enlace de tienda ya esta ocupado. Prueba una de las sugerencias.',
            'theme.required' => 'Selecciona un tema visual.',
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => User::ROLE_CLIENT,
                'status' => User::STATUS_ACTIVE,
            ]);

            Tenant::create([
                'user_id' => $user->id,
                'name' => $validated['store_name'],
                'domain' => $validated['domain'],
                'theme' => $validated['theme'],
                'whatsapp_number' => '',
                'store_description' => 'Mi nueva tienda',
                'status' => Tenant::STATUS_ACTIVE,
            ]);

            return $user->load('tenant');
        });

        // The catalog stays unpublished until the owner confirms the address (see EnsureSubscriptionAccess).
        try {
            $user->sendEmailVerificationNotification();
        } catch (\Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'message' => 'Tu cuenta fue creada. Confirma tu correo para publicar tu catálogo.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Credentials are checked with the web guard even if another guard ran earlier in the process.
        $guard = Auth::guard('web');

        if ($guard->attempt($credentials)) {
            $user = $guard->user();

            if (!$user->isActive()) {
                $guard->logout();

                return response()->json([
                    'message' => $user->status === User::STATUS_PENDING
                        ? 'Tu cuenta esta pendiente de aprobacion.'
                        : 'Tu cuenta esta suspendida.',
                    'status' => $user->status,
                ], 403);
            }

            $expiration = config('sanctum.expiration');
            $user->tokens()->where(function ($query) use ($expiration) {
                $query->where('expires_at', '<=', now());
                if ($expiration) {
                    $query->orWhere('created_at', '<=', now()->subMinutes($expiration));
                }
            })->delete();

            $expiresAt = $expiration ? now()->addMinutes($expiration) : null;
            $token = $user->createToken('admin-token', ['*'], $expiresAt)->plainTextToken;
            $user->load('tenant');

            return response()->json([
                'token' => $token,
                'expires_at' => $expiresAt?->toIso8601String(),
                'user' => $user,
            ]);
        }

        return response()->json(['message' => 'Credenciales invalidas'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('tenant'));
    }

    public function domainAvailability(Request $request)
    {
        $domain = Tenant::normalizeDomain($request->query('domain', ''));

        if (strlen($domain) < 3) {
            return response()->json([
                'domain' => $domain,
                'available' => false,
                'message' => 'La URL debe tener al menos 3 caracteres.',
                'suggestions' => [],
            ]);
        }

        $isReserved = Tenant::isReservedDomain($domain);
        $available = !$isReserved && !Tenant::where('domain', $domain)->exists();

        return response()->json([
            'domain' => $domain,
            'available' => $available,
            'message' => $available
                ? 'Disponible'
                : ($isReserved ? 'Ese nombre de enlace esta reservado.' : 'Ese enlace ya esta ocupado.'),
            'suggestions' => $available ? [] : $this->domainSuggestions($domain),
        ]);
    }

    private function domainSuggestions(string $domain): array
    {
        $base = $domain ?: 'mi-tienda';
        $candidates = collect(range(1, 12))
            ->flatMap(fn (int $number) => [
                "{$base}{$number}",
                "{$base}-{$number}",
            ])
            ->unique()
            ->values();

        $taken = Tenant::whereIn('domain', $candidates)->pluck('domain')->all();

        return $candidates
            ->reject(fn (string $candidate) => in_array($candidate, $taken, true) || Tenant::isReservedDomain($candidate))
            ->take(4)
            ->values()
            ->all();
    }
}
