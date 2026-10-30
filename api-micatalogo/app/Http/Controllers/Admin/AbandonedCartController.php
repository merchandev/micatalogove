<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\AbandonedCart;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AbandonedCartController extends Controller
{
    use ScopesTenantAccess;

    public function index(Request $request)
    {
        $query = AbandonedCart::with('tenant:id,name,domain');
        $query = $this->applyTenantScope($query, $request->user());

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest('last_activity_at')->latest()->get());
    }

    public function update(Request $request, AbandonedCart $cart)
    {
        $this->applyTenantScope(AbandonedCart::whereKey($cart->id), $request->user())->firstOrFail();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['open', 'contacted', 'recovered', 'closed'])],
        ]);

        if ($validated['status'] === 'recovered' && !$cart->converted_at) {
            $validated['converted_at'] = now();
        }

        $cart->update($validated);

        return response()->json($cart->fresh('tenant:id,name,domain'));
    }
}
