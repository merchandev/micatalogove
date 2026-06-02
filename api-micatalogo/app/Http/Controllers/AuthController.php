<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'store_name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:tenants,domain',
            'theme' => 'required|string|in:boutique-demo,postres-demo,tech-demo,restaurant-demo,minimal-demo',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $tenant = Tenant::create([
            'user_id' => $user->id,
            'name' => $validated['store_name'],
            'domain' => $validated['domain'],
            'theme' => $validated['theme'],
            'whatsapp_number' => '',
            'store_description' => 'Mi nueva tienda',
        ]);

        $token = $user->createToken('admin-token')->plainTextToken;
        $user->load('tenant');

        return response()->json([
            'token' => $token,
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('admin-token')->plainTextToken;

            // Cargar el tenant relacionado
            $user->load('tenant');

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Credenciales inválidas'], 401);
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
}
