<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_completed_pending_completed_cycle_deducts_stock_only_once(): void
    {
        [$owner, $order, $laptop, $mouse] = $this->order();
        Sanctum::actingAs($owner);

        $this->setStatus($order, 'completed')->assertOk()->assertJsonPath('status', 'completed');
        $this->assertStock($laptop, 7, $mouse, 6);
        $this->setStatus($order, 'completed')->assertOk();
        $this->assertStock($laptop, 7, $mouse, 6);

        $this->setStatus($order, 'pending')->assertOk()->assertJsonPath('stock_applied_at', null);
        $this->assertStock($laptop, 10, $mouse, 10);
        $this->setStatus($order, 'completed')->assertOk();
        $this->assertStock($laptop, 7, $mouse, 6);
    }

    public function test_cancelling_a_completed_order_restores_stock_and_cancelled_orders_can_be_completed_again(): void
    {
        [$owner, $order, $laptop, $mouse] = $this->order();
        Sanctum::actingAs($owner);

        $this->setStatus($order, 'completed')->assertOk();
        $this->setStatus($order, 'cancelled')->assertOk()->assertJsonPath('completed_at', null);
        $this->assertStock($laptop, 10, $mouse, 10);
        $this->setStatus($order, 'cancelled')->assertOk();
        $this->assertStock($laptop, 10, $mouse, 10);

        $this->setStatus($order, 'completed')->assertOk();
        $this->assertStock($laptop, 7, $mouse, 6);
    }

    public function test_completion_is_rejected_without_partial_changes_when_stock_is_insufficient(): void
    {
        [$owner, $order, $laptop, $mouse] = $this->order();
        Sanctum::actingAs($owner);
        $mouse->update(['stock_quantity' => 3]);

        $this->setStatus($order, 'completed')->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->assertSame('pending', $order->fresh()->status);
        $this->assertNull($order->fresh()->stock_applied_at);
        $this->assertStock($laptop, 10, $mouse, 3);
    }

    public function test_deleted_products_are_skipped_and_not_restored(): void
    {
        [$owner, $order, $laptop, $mouse] = $this->order();
        Sanctum::actingAs($owner);

        $this->setStatus($order, 'completed')->assertOk();
        $mouse->delete();
        $this->setStatus($order, 'cancelled')->assertOk();
        $this->assertSame(10, $laptop->fresh()->stock_quantity);
        $this->assertDatabaseCount('products', 1);
    }

    public function test_another_store_cannot_change_the_order_or_its_stock(): void
    {
        [, $order, $laptop, $mouse] = $this->order();
        [$intruder] = $this->order('other-store');
        Sanctum::actingAs($intruder);

        $this->setStatus($order, 'completed')->assertNotFound();
        $this->assertStock($laptop, 10, $mouse, 10);
    }

    private function setStatus(Order $order, string $status)
    {
        return $this->putJson("/api/admin/orders/{$order->id}", ['status' => $status]);
    }

    private function assertStock(Product $laptop, int $laptopStock, Product $mouse, int $mouseStock): void
    {
        $this->assertSame($laptopStock, $laptop->fresh()->stock_quantity);
        $this->assertSame($mouseStock, $mouse->fresh()->stock_quantity);
    }

    private function order(string $domain = 'stock-store'): array
    {
        $owner = User::factory()->create(['role' => User::ROLE_CLIENT, 'status' => User::STATUS_ACTIVE]);
        $tenant = Tenant::create(['user_id' => $owner->id, 'name' => 'Stock Store', 'domain' => $domain, 'status' => Tenant::STATUS_ACTIVE]);
        $laptop = Product::create(['tenant_id' => $tenant->id, 'name' => 'Laptop', 'price' => 100, 'stock_quantity' => 10, 'status' => 'active']);
        $mouse = Product::create(['tenant_id' => $tenant->id, 'name' => 'Mouse', 'price' => 10, 'stock_quantity' => 10, 'status' => 'active']);
        $order = Order::create(['tenant_id' => $tenant->id, 'status' => 'pending', 'total_amount' => 340]);
        // Split lines for the same product are deducted together.
        $order->items()->createMany([
            ['product_id' => $laptop->id, 'product_name' => 'Laptop', 'quantity' => 3, 'unit_price' => 100, 'total_price' => 300],
            ['product_id' => $mouse->id, 'product_name' => 'Mouse', 'quantity' => 1, 'unit_price' => 10, 'total_price' => 10],
            ['product_id' => $mouse->id, 'product_name' => 'Mouse', 'quantity' => 3, 'unit_price' => 10, 'total_price' => 30],
        ]);

        return [$owner, $order, $laptop, $mouse];
    }
}
