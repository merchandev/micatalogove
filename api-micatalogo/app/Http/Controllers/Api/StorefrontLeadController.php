<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AbandonedCart;
use App\Models\Conversation;
use App\Models\Order;
use App\Models\Product;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StorefrontLeadController extends Controller
{
    public function trackCart(Request $request, string $domain)
    {
        $tenant = $this->activeTenant($domain);

        $validated = $request->validate([
            'session_id' => 'nullable|string|max:255',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:40',
            'items' => 'required|array|min:1|max:100',
            'items.*.id' => 'required|integer|min:1',
            'items.*.quantity' => 'required|integer|min:1|max:1000000',
        ]);

        $cart = DB::transaction(function () use ($tenant, $validated) {
            [$items, $total] = $this->catalogItems($tenant, $validated['items']);

            return AbandonedCart::updateOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'session_id' => $validated['session_id'] ?? null,
                ],
                [
                    'customer_name' => $validated['customer_name'] ?? null,
                    'customer_phone' => $validated['customer_phone'] ?? null,
                    'items' => $items,
                    'total_amount' => $total,
                    'status' => 'open',
                    'last_activity_at' => now(),
                ]
            );
        });

        return response()->json($cart, 201);
    }

    public function checkout(Request $request, string $domain)
    {
        $tenant = $this->activeTenant($domain);

        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:40',
            'message' => 'nullable|string',
            'source' => 'nullable|string|max:255',
            'session_id' => 'nullable|string|max:255',
            'items' => 'required|array|min:1|max:100',
            'items.*.id' => 'required|integer|min:1',
            'items.*.quantity' => 'required|integer|min:1|max:1000000',
        ]);

        $order = DB::transaction(function () use ($tenant, $validated) {
            [$items, $total] = $this->catalogItems($tenant, $validated['items']);
            $conversation = Conversation::create([
                'tenant_id' => $tenant->id,
                'customer_name' => $validated['customer_name'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'subject' => 'Contacto por WhatsApp',
                'message' => $validated['message'] ?? null,
                'source' => $validated['source'] ?? 'whatsapp',
                'status' => 'new',
                'last_contact_at' => now(),
                'metadata' => [
                    'items' => $items,
                    'session_id' => $validated['session_id'] ?? null,
                ],
            ]);

            $conversation->messages()->create([
                'direction' => 'inbound',
                'sender_name' => $validated['customer_name'] ?? null,
                'sender_phone' => $validated['customer_phone'] ?? null,
                'message' => $validated['message'] ?? 'Cliente inicio contacto por WhatsApp.',
                'metadata' => ['items' => $items],
            ]);

            $order = Order::create([
                'tenant_id' => $tenant->id,
                'conversation_id' => $conversation->id,
                'customer_name' => $validated['customer_name'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'status' => 'pending',
                'source' => $validated['source'] ?? 'whatsapp',
                'total_amount' => $total,
                'notes' => $validated['message'] ?? null,
            ]);

            foreach ($items as $item) {
                $quantity = (int) $item['quantity'];
                $unitPrice = (float) $item['price'];

                $order->items()->create([
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $item['total_price'],
                ]);
            }

            if (! empty($validated['session_id'])) {
                AbandonedCart::where('tenant_id', $tenant->id)
                    ->where('session_id', $validated['session_id'])
                    ->update([
                        'status' => 'recovered',
                        'converted_at' => now(),
                    ]);
            }

            return $order->load(['items', 'conversation']);
        });

        return response()->json($order, 201);
    }

    private function activeTenant(string $domain): Tenant
    {
        return Tenant::where('domain', $domain)
            ->where('status', Tenant::STATUS_ACTIVE)
            ->firstOrFail();
    }

    /** Resolve every public item from this tenant's catalog, never from client prices. */
    private function catalogItems(Tenant $tenant, array $requestedItems): array
    {
        $quantities = collect($requestedItems)->groupBy('id')->map(
            fn ($rows) => $rows->sum('quantity')
        );
        $products = Product::where('tenant_id', $tenant->id)
            ->where('status', 'active')
            ->whereIn('id', $quantities->keys())
            ->orderBy('id')
            ->lockForUpdate()
            ->get()->keyBy('id');

        $items = [];
        $totalCents = 0;
        foreach ($quantities as $id => $quantity) {
            $product = $products->get($id);
            if (! $product || $quantity > $product->stock_quantity) {
                throw ValidationException::withMessages([
                    'items' => 'Un producto no esta disponible o no tiene existencias suficientes.',
                ]);
            }

            // Product prices are decimal:2; calculate totals in integer cents.
            $unitCents = (int) str_replace('.', '', (string) $product->price);
            $lineCents = $unitCents * $quantity;
            $totalCents += $lineCents;
            if ($totalCents > 999999999999) {
                throw ValidationException::withMessages(['items' => 'El total excede el limite permitido.']);
            }
            $items[] = [
                'id' => $product->id,
                'name' => $product->name,
                'quantity' => $quantity,
                'price' => $unitCents / 100,
                'total_price' => $lineCents / 100,
            ];
        }

        return [$items, $totalCents / 100];
    }
}
