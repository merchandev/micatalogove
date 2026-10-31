<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class CriticalSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_clean_install_can_login_use_and_revoke_a_real_sanctum_token(): void
    {
        config(['sanctum.guard' => []]);
        $user = User::factory()->create([
            'password' => Hash::make('test-password-123'),
            'role' => User::ROLE_CLIENT,
            'status' => User::STATUS_ACTIVE,
        ]);

        $token = $this->postJson('/api/login', [
            'email' => $user->email, 'password' => 'test-password-123',
        ])->assertOk()->json('token');
        $this->assertNotEmpty($token);
        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertDatabaseMissing('personal_access_tokens', ['token' => $token]);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertOk()->assertJsonPath('id', $user->id);
        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_checkout_uses_catalog_prices_and_names_including_metadata(): void
    {
        [$tenant, $product] = $this->catalog();
        $response = $this->postJson("/api/tenants/{$tenant->domain}/checkout", [
            'items' => [['id' => $product->id, 'name' => 'forged', 'quantity' => 2, 'price' => 0.01]],
        ])->assertCreated();
        $this->assertEquals(2400, $response->json('total_amount'));
        $this->assertEquals(1200, $response->json('items.0.unit_price'));
        $response->assertJsonPath('items.0.product_name', $product->name);
        $this->assertEquals(1200, $response->json('conversation.metadata.items.0.price'));
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock_quantity' => 7]);
    }

    public function test_cart_ignores_client_prices_and_totals(): void
    {
        [$tenant, $product] = $this->catalog();
        $response = $this->postJson("/api/tenants/{$tenant->domain}/carts", [
            'session_id' => 'test-session', 'total_amount' => 0.01,
            'items' => [['id' => $product->id, 'name' => 'forged', 'quantity' => 2, 'price' => 0.01]],
        ])->assertCreated();
        $this->assertEquals(2400, $response->json('total_amount'));
        $this->assertEquals(1200, $response->json('items.0.price'));
        $response->assertJsonPath('items.0.name', $product->name);
    }

    public function test_public_leads_reject_missing_foreign_inactive_and_nonexistent_products_and_excess_stock(): void
    {
        [$tenant, $product] = $this->catalog();
        [, $foreign] = $this->catalog('other-store');
        $inactive = Product::create([
            'tenant_id' => $tenant->id, 'name' => 'Hidden', 'price' => 10,
            'stock_quantity' => 10, 'status' => 'inactive',
        ]);
        $cases = [
            [['quantity' => 1, 'price' => 0.01, 'name' => 'Fake']],
            [['id' => 999999, 'quantity' => 1]],
            [['id' => $foreign->id, 'quantity' => 1]],
            [['id' => $inactive->id, 'quantity' => 1]],
            [['id' => $product->id, 'quantity' => 8]],
            [['id' => $product->id, 'quantity' => 4], ['id' => $product->id, 'quantity' => 4]],
            [['id' => $product->id, 'quantity' => 1], ['id' => $foreign->id, 'quantity' => 1]],
            [['id' => $product->id, 'quantity' => 0]],
        ];
        foreach (['checkout', 'carts'] as $endpoint) {
            foreach ($cases as $items) {
                $this->postJson("/api/tenants/{$tenant->domain}/{$endpoint}", [
                    'session_id' => 'test-session', 'items' => $items,
                ])->assertUnprocessable();
            }
        }
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('order_items', 0);
        $this->assertDatabaseCount('conversations', 0);
        $this->assertDatabaseCount('abandoned_carts', 0);
    }

    public function test_totals_use_decimal_cents_and_duplicate_lines_are_combined(): void
    {
        [$tenant, $product] = $this->catalog();
        $product->update(['price' => '0.10']);
        $response = $this->postJson("/api/tenants/{$tenant->domain}/checkout", [
            'items' => [['id' => $product->id, 'quantity' => 1], ['id' => $product->id, 'quantity' => 2]],
        ])->assertCreated()->assertJsonCount(1, 'items')->assertJsonPath('items.0.quantity', 3);
        $this->assertEquals('0.30', $response->json('total_amount'));
        $this->assertEquals('0.30', $response->json('items.0.total_price'));
    }

    public function test_production_seed_creates_only_configured_superadmin_and_never_resets_password(): void
    {
        $this->app->instance('env', 'production');
        config(['seeding.superadmin_email' => 'owner@example.test', 'seeding.superadmin_password' => 'unique-bootstrap-password-2026']);
        $this->app->make(DatabaseSeeder::class)->run();
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('tenants', 0);
        $this->assertDatabaseCount('products', 0);
        $user = User::sole();
        $this->assertSame(User::ROLE_SUPERADMIN, $user->role);
        $this->assertTrue(Hash::check('unique-bootstrap-password-2026', $user->password));
        config(['seeding.superadmin_password' => 'another-bootstrap-password-2026']);
        $this->app->make(DatabaseSeeder::class)->run();
        $this->assertSame($user->password, $user->fresh()->password);
    }

    public function test_production_seed_requires_explicit_credentials(): void
    {
        $this->app->instance('env', 'production');
        config(['seeding.superadmin_email' => null, 'seeding.superadmin_password' => null]);
        try {
            $this->app->make(DatabaseSeeder::class)->run();
            $this->fail('Production seeding accepted missing credentials.');
        } catch (RuntimeException $exception) {
            $this->assertStringContainsString('SEED_SUPERADMIN', $exception->getMessage());
        }
        $this->assertDatabaseCount('users', 0);
    }

    public function test_production_demo_seeder_is_blocked_even_when_called_directly(): void
    {
        $this->app->instance('env', 'production');
        $this->expectException(RuntimeException::class);
        $this->app->make(DemoSeeder::class)->run();
    }

    public function test_production_seed_rejects_the_old_default_password(): void
    {
        $this->app->instance('env', 'production');
        config(['seeding.superadmin_email' => 'owner@example.test', 'seeding.superadmin_password' => 'password123']);
        try {
            $this->app->make(DatabaseSeeder::class)->run();
            $this->fail('Production seeding accepted the old default password.');
        } catch (RuntimeException $exception) {
            $this->assertStringContainsString('16 characters', $exception->getMessage());
        }
        $this->assertDatabaseCount('users', 0);
    }

    public function test_inactive_tenants_cannot_create_public_leads(): void
    {
        [$tenant, $product] = $this->catalog();
        $tenant->update(['status' => Tenant::STATUS_SUSPENDED]);
        foreach (['checkout', 'carts'] as $endpoint) {
            $this->postJson("/api/tenants/{$tenant->domain}/{$endpoint}", [
                'items' => [['id' => $product->id, 'quantity' => 1]],
            ])->assertNotFound();
        }
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('abandoned_carts', 0);
    }

    public function test_production_seed_does_not_promote_existing_clients(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_CLIENT]);
        $this->app->instance('env', 'production');
        config(['seeding.superadmin_email' => $user->email, 'seeding.superadmin_password' => 'unique-bootstrap-password-2026']);
        try {
            $this->app->make(DatabaseSeeder::class)->run();
            $this->fail('Seeder promoted an existing client.');
        } catch (RuntimeException $exception) {
            $this->assertStringContainsString('non-superadmin', $exception->getMessage());
        }
        $this->assertSame(User::ROLE_CLIENT, $user->fresh()->role);
    }

    private function catalog(string $domain = 'test-store'): array
    {
        $tenant = Tenant::create(['name' => 'Test Store', 'domain' => $domain, 'status' => Tenant::STATUS_ACTIVE]);
        $product = Product::create([
            'tenant_id' => $tenant->id, 'name' => 'Laptop', 'price' => '1200.00',
            'stock_quantity' => 7, 'status' => 'active',
        ]);

        return [$tenant, $product];
    }
}
