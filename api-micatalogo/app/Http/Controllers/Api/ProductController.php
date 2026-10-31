<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index($domain)
    {
        $tenant = Tenant::where('domain', $domain)
            ->where('status', Tenant::STATUS_ACTIVE)
            ->firstOrFail();
        
        $products = Product::with('category')
            ->where('tenant_id', $tenant->id)
            ->where('status', 'active')
            ->latest()
            ->get();

        return ProductResource::collection($products);
    }

    public function show($domain, string $product)
    {
        $tenant = Tenant::where('domain', $domain)
            ->where('status', Tenant::STATUS_ACTIVE)
            ->firstOrFail();

        $baseQuery = Product::with('category')
            ->where('tenant_id', $tenant->id)
            ->where('status', 'active');

        $resolved = null;

        if (ctype_digit($product)) {
            $resolved = (clone $baseQuery)->find((int) $product);
        } elseif (preg_match('/^(\d+)-/', $product, $matches)) {
            $resolved = (clone $baseQuery)->find((int) $matches[1]);
        }

        if (!$resolved) {
            $normalizedSlug = Str::slug($product);
            $resolved = (clone $baseQuery)->get()->first(function (Product $candidate) use ($normalizedSlug, $product) {
                return Str::slug((string) $candidate->name) === $normalizedSlug
                    || ($candidate->sku && Str::lower($candidate->sku) === Str::lower($product));
            });
        }

        abort_if(!$resolved, 404);

        return new ProductResource($resolved);
    }
}
