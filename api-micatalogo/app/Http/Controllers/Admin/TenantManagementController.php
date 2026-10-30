<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;

class TenantManagementController extends Controller
{
    use ScopesTenantAccess;

    public function index(Request $request)
    {
        $query = Tenant::with('user:id,name,email,role,status');
        $query = $this->applyTenantScope($query, $request->user(), 'id');

        return response()->json($query->orderBy('name')->get());
    }
}
