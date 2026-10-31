<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    use ScopesTenantAccess;

    public function index(Request $request)
    {
        $query = Order::with(['tenant:id,name,domain', 'items.product:id,name,stock_quantity']);
        $query = $this->applyTenantScope($query, $request->user());

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest()->get());
    }

    public function update(Request $request, Order $order)
    {
        $this->applyTenantScope(Order::whereKey($order->id), $request->user())->firstOrFail();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'completed', 'cancelled'])],
            'notes' => 'nullable|string|max:5000',
        ]);

        DB::transaction(function () use ($order, $validated) {
            // Lock the order so concurrent status changes apply or restore stock only once.
            $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();
            $completing = $validated['status'] === 'completed';

            if ($completing && ! $order->stock_applied_at) {
                $this->adjustStock($order, -1);
                $validated['stock_applied_at'] = now();
                $validated['completed_at'] = now();
            } elseif (! $completing && $order->stock_applied_at) {
                $this->adjustStock($order, 1);
                $validated['stock_applied_at'] = null;
                $validated['completed_at'] = null;
            }

            $order->update($validated);
        });

        return response()->json($order->fresh(['tenant:id,name,domain', 'items.product:id,name,stock_quantity']));
    }

    /** Deduct (-1) or restore (+1) the order quantities, rejecting a deduction larger than the stock. */
    private function adjustStock(Order $order, int $direction): void
    {
        $quantities = $order->items()->whereNotNull('product_id')->get()
            ->groupBy('product_id')->map(fn ($items) => $items->sum('quantity'));

        $products = Product::where('tenant_id', $order->tenant_id)
            ->whereIn('id', $quantities->keys())
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        if ($direction < 0) {
            $shortages = $products
                ->filter(fn (Product $product) => $product->stock_quantity < $quantities[$product->id])
                ->map(fn (Product $product) => "{$product->name} (disponible {$product->stock_quantity}, requerido {$quantities[$product->id]})");

            if ($shortages->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'status' => 'Stock insuficiente para completar la venta: '.$shortages->implode('; ').'.',
                ]);
            }
        }

        foreach ($products as $product) {
            $direction < 0
                ? $product->decrement('stock_quantity', $quantities[$product->id])
                : $product->increment('stock_quantity', $quantities[$product->id]);
        }
    }
}
