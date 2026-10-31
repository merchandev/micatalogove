<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmailActivationGraceTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_products_and_checkout_work_immediately_before_email_activation(): void
    {
        [$owner, $tenant, $product] = $this->store();
        $this->assertFalse($owner->hasVerifiedEmail());
        $this->getJson('/api/tenants/grace-shop')->assertOk();
        $this->getJson('/api/tenants/grace-shop/products')->assertOk();
        $this->getJson('/api/tenants/grace-shop/products/'.$product->id)->assertOk();
        $this->postJson('/api/tenants/grace-shop/checkout', ['items' => [['id' => $product->id, 'quantity' => 1]]])->assertCreated();
        Sanctum::actingAs($owner);
        $this->getJson('/api/user')->assertOk()->assertJsonPath('email_activation.verified', false)
            ->assertJsonPath('email_activation.grace_hours', 24)->assertJsonPath('email_activation.can_publish', true);
    }

    public function test_twenty_four_hour_boundary_blocks_all_public_endpoints_and_preserves_panel_and_data(): void
    {
        $this->travelTo(now()->startOfSecond());
        [$owner, $tenant, $product] = $this->store();
        $deadline = $owner->created_at->copy()->addHours(24);
        $this->travelTo($deadline->copy()->subSecond());
        $this->getJson('/api/tenants/grace-shop')->assertOk();
        $this->travelTo($deadline);
        foreach (['', '/products', '/products/'.$product->id] as $path) {
            $this->getJson('/api/tenants/grace-shop'.$path)->assertForbidden()->assertJsonPath('code', 'email_unverified');
        }
        foreach (['checkout', 'carts'] as $path) {
            $this->postJson('/api/tenants/grace-shop/'.$path, [])->assertForbidden()->assertJsonPath('code', 'email_unverified');
        }
        Sanctum::actingAs($owner);
        $this->getJson('/api/user')->assertOk()->assertJsonPath('email_activation.can_publish', false);
        $this->getJson('/api/admin/products')->assertOk();
        $this->getJson('/api/admin/subscription')->assertOk();
        $this->assertDatabaseHas('products', ['id' => $product->id]);
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'status' => 'active']);
    }

    public function test_verifying_after_deadline_reactivates_store_without_resetting_trial(): void
    {
        [$owner, $tenant] = $this->store();
        $trialEnd = $tenant->trial_ends_at->copy();
        $this->travel(25)->hours();
        $this->getJson('/api/tenants/grace-shop')->assertForbidden();
        $url = URL::temporarySignedRoute('verification.verify', now()->addHour(), [
            'id' => $owner->id, 'hash' => sha1($owner->email),
        ], absolute: false);
        $this->getJson($url)->assertOk();
        $this->getJson('/api/tenants/grace-shop')->assertOk();
        $this->assertTrue($owner->fresh()->hasVerifiedEmail());
        $this->assertTrue($tenant->fresh()->trial_ends_at->equalTo($trialEnd));
    }

    public function test_resend_does_not_restart_the_activation_window(): void
    {
        Notification::fake();
        [$owner] = $this->store();
        $deadline = $owner->emailVerificationDeadline();
        $this->travel(25)->hours();
        Sanctum::actingAs($owner);
        $this->postJson('/api/email/verification-notification')->assertOk();
        $this->assertTrue($owner->fresh()->emailVerificationDeadline()->equalTo($deadline));
        $this->getJson('/api/tenants/grace-shop')->assertForbidden();
    }

    public function test_grace_does_not_bypass_suspension_or_subscription_expiry(): void
    {
        [$owner, $tenant] = $this->store();
        $tenant->forceFill(['trial_ends_at' => now()->subMinute()])->save();
        $this->getJson('/api/tenants/grace-shop')->assertForbidden()->assertJsonPath('code', 'subscription_expired');
        $tenant->update(['status' => Tenant::STATUS_SUSPENDED]);
        $this->getJson('/api/tenants/grace-shop')->assertNotFound();
    }

    private function store(): array
    {
        $owner = User::factory()->unverified()->create(['role' => User::ROLE_CLIENT]);
        $tenant = Tenant::create(['user_id' => $owner->id, 'name' => 'Grace Shop', 'domain' => 'grace-shop', 'status' => Tenant::STATUS_ACTIVE]);
        $product = Product::create(['tenant_id' => $tenant->id, 'name' => 'Example', 'price' => 10, 'stock_quantity' => 3, 'status' => 'active']);

        return [$owner, $tenant, $product];
    }
}
