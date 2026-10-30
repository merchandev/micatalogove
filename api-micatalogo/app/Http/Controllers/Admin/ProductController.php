<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ScopesTenantAccess;

    public function index(Request $request)
    {
        $query = Product::with(['tenant:id,name,domain,status', 'category']);
        $query = $this->applyTenantScope($query, $request->user());

        if ($request->user()->isPlatformAdmin() && $request->filled('tenant_id')) {
            $query->where('tenant_id', $request->integer('tenant_id'));
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $tenant = $this->tenantForWrite($request->user(), $request->integer('tenant_id') ?: null);

        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'image_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
        ]);

        $product = Product::create(array_merge($validated, [
            'tenant_id' => $tenant->id,
            'category_id' => $this->categoryIdForTenant($validated['category_id'] ?? null, $tenant->id),
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
            'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
        ]));

        return response()->json($product->load(['tenant:id,name,domain,status', 'category']), 201);
    }

    public function show(Request $request, $id)
    {
        $query = Product::with(['tenant:id,name,domain,status', 'category']);
        $query = $this->applyTenantScope($query, $request->user());

        return response()->json($query->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $query = Product::query();
        $query = $this->applyTenantScope($query, $request->user());
        $product = $query->findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'image_url' => 'nullable|url',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        unset($validated['tenant_id']);

        if (array_key_exists('category_id', $validated)) {
            $validated['category_id'] = $this->categoryIdForTenant($validated['category_id'], $product->tenant_id);
        }

        $product->update($validated);

        return response()->json($product->load(['tenant:id,name,domain,status', 'category']));
    }

    public function destroy(Request $request, $id)
    {
        $query = Product::query();
        $query = $this->applyTenantScope($query, $request->user());
        $product = $query->findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }

    private function categoryIdForTenant(?int $categoryId, int $tenantId): ?int
    {
        if (!$categoryId) {
            return null;
        }

        return Category::where('tenant_id', $tenantId)->findOrFail($categoryId)->id;
    }
}
