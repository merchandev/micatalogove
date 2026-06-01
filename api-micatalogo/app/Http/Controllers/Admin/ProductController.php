<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant->id;
        $products = Product::where('tenant_id', $tenantId)->latest()->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $tenantId = $request->user()->tenant->id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'status' => 'required|in:active,inactive'
        ]);

        $product = Product::create(array_merge($validated, ['tenant_id' => $tenantId]));

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $tenantId = $request->user()->tenant->id;
        $product = Product::where('tenant_id', $tenantId)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|url',
            'status' => 'sometimes|required|in:active,inactive'
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant->id;
        $product = Product::where('tenant_id', $tenantId)->findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
