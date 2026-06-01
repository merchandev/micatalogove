<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Product;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index($domain)
    {
        $tenant = Tenant::where('domain', $domain)->firstOrFail();
        
        $products = Product::with('category')
            ->where('tenant_id', $tenant->id)
            ->where('status', 'active')
            ->latest()
            ->get();

        return ProductResource::collection($products);
    }
}
