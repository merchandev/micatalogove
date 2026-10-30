<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\AbandonedCart;
use App\Models\Conversation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ScopesTenantAccess;

    public function __invoke(Request $request)
    {
        $user = $request->user()->load('tenant');
        $tenantIds = $this->tenantIdsFor($user);
        $isPlatform = $user->isPlatformAdmin();

        $orders = Order::query()->whereIn('tenant_id', $tenantIds);
        $completedOrders = (clone $orders)->where('status', 'completed');

        $counts = [
            'clients' => $isPlatform ? User::where('role', User::ROLE_CLIENT)->count() : 1,
            'pending_clients' => $isPlatform ? User::where('role', User::ROLE_CLIENT)->where('status', User::STATUS_PENDING)->count() : 0,
            'active_tenants' => Tenant::whereIn('id', $tenantIds)->where('status', Tenant::STATUS_ACTIVE)->count(),
            'products' => Product::whereIn('tenant_id', $tenantIds)->count(),
            'low_stock' => Product::whereIn('tenant_id', $tenantIds)
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                ->count(),
            'new_conversations' => Conversation::whereIn('tenant_id', $tenantIds)->where('status', 'new')->count(),
            'open_carts' => AbandonedCart::whereIn('tenant_id', $tenantIds)->where('status', 'open')->count(),
            'orders' => (clone $orders)->count(),
        ];

        $series = collect(range(6, 0))->map(function (int $daysAgo) use ($tenantIds) {
            $date = Carbon::today()->subDays($daysAgo);

            return [
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('d/m'),
                'total' => (float) Order::whereIn('tenant_id', $tenantIds)
                    ->where('status', 'completed')
                    ->whereDate('completed_at', $date)
                    ->sum('total_amount'),
            ];
        });

        $topProducts = OrderItem::query()
            ->select('product_name', DB::raw('SUM(quantity) as quantity'), DB::raw('SUM(total_price) as total'))
            ->whereHas('order', fn ($query) => $query->whereIn('tenant_id', $tenantIds)->where('status', 'completed'))
            ->groupBy('product_name')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get();

        return response()->json([
            'scope' => $isPlatform ? 'platform' : 'tenant',
            'tenant' => $user->tenant,
            'counts' => $counts,
            'sales' => [
                'total_revenue' => (float) $completedOrders->sum('total_amount'),
                'completed_orders' => (clone $orders)->where('status', 'completed')->count(),
                'series' => $series,
            ],
            'top_products' => $topProducts,
            'low_stock_products' => Product::with('tenant:id,name,domain')
                ->whereIn('tenant_id', $tenantIds)
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                ->orderBy('stock_quantity')
                ->limit(8)
                ->get(),
            'recent_conversations' => Conversation::with('tenant:id,name,domain')
                ->whereIn('tenant_id', $tenantIds)
                ->latest()
                ->limit(6)
                ->get(),
            'recent_carts' => AbandonedCart::with('tenant:id,name,domain')
                ->whereIn('tenant_id', $tenantIds)
                ->latest('last_activity_at')
                ->limit(6)
                ->get(),
        ]);
    }
}
