<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Http\Resources\TenantResource;

class TenantController extends Controller
{
    public function show($domain)
    {
        $tenant = Tenant::where('domain', $domain)->firstOrFail();
        return new TenantResource($tenant);
    }
}
