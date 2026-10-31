<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_plan_has_only_real_functions_and_the_agreed_price(): void
    {
        $this->getJson('/api/plans')->assertOk()->assertJsonPath('trial_days', 7)
            ->assertJsonCount(1, 'plans')->assertJsonPath('plans.0.monthly_price', '5.00');
    }

    public function test_new_store_gets_exactly_seven_days_and_edits_do_not_restart_trial(): void
    {
        $this->travelTo(now()->startOfSecond());
        [, $tenant] = $this->store();
        $end = now()->addDays(7);
        $this->assertTrue($tenant->trial_ends_at->equalTo($end));
        $this->assertSame(7, $tenant->subscriptionSummary()['trial_days_remaining']);
        $this->travel(3)->days();
        $tenant->update(['name' => 'Changed']);
        $this->assertTrue($tenant->fresh()->trial_ends_at->equalTo($end));
        $this->assertSame(4, $tenant->subscriptionSummary()['trial_days_remaining']);
    }

    public function test_registration_cannot_set_plan_or_extend_trial(): void
    {
        $this->travelTo(now()->startOfSecond());
        $this->postJson('/api/register', [
            'name' => 'Owner', 'email' => 'owner@example.test', 'password' => 'test-password',
            'store_name' => 'New Store', 'domain' => 'new-store', 'theme' => 'minimal-demo',
            'plan_code' => 'unlimited', 'trial_ends_at' => '2099-01-01', 'subscribed_until' => '2099-01-01',
        ])->assertCreated();
        $tenant = Tenant::sole();
        $this->assertSame('catalogo', $tenant->plan_code);
        $this->assertTrue($tenant->trial_ends_at->equalTo(now()->addDays(7)));
        $this->assertNull($tenant->subscribed_until);
    }

    public function test_trial_expires_at_the_boundary_and_blocks_all_public_tenant_endpoints(): void
    {
        $this->travelTo(now()->startOfSecond());
        [, $tenant] = $this->store();
        $this->getJson('/api/tenants/test-store')->assertOk();
        $this->travelTo($tenant->trial_ends_at);
        foreach (['', '/products', '/products/1'] as $path) {
            $this->getJson('/api/tenants/test-store'.$path)->assertForbidden()->assertJsonPath('code', 'subscription_expired');
        }
        foreach (['carts', 'checkout'] as $path) {
            $this->postJson('/api/tenants/test-store/'.$path, [])->assertForbidden();
        }
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id]);
    }

    public function test_expired_owner_keeps_read_and_renewal_access_but_cannot_modify_store(): void
    {
        [$owner, $tenant] = $this->store();
        $tenant->forceFill(['trial_ends_at' => now()->subSecond()])->save();
        Sanctum::actingAs($owner);
        $this->getJson('/api/admin/subscription')->assertOk()->assertJsonPath('subscription.status', 'expired');
        $this->getJson('/api/admin/products')->assertOk();
        $this->getJson('/api/admin/dashboard')->assertOk();
        $this->putJson('/api/admin/store', [])->assertForbidden();
        $this->postJson('/api/admin/products', [])->assertForbidden();
        $this->report()->assertCreated()->assertJsonPath('status', 'pending');
        $this->assertFalse($tenant->fresh()->hasSubscriptionAccess());
    }

    public function test_payment_request_uses_server_amount_and_does_not_grant_access(): void
    {
        [$owner, $tenant] = $this->store();
        Sanctum::actingAs($owner);
        $this->postJson('/api/admin/subscription/payments', [
            'reference' => 'REF-1', 'amount' => '0.01', 'currency' => 'EUR',
            'status' => 'approved', 'tenant_id' => 999, 'period_ends_at' => '2099-01-01',
        ])->assertCreated()->assertJsonPath('amount', '5.00')->assertJsonPath('currency', 'USD')
            ->assertJsonPath('status', 'pending')->assertJsonPath('tenant_id', $tenant->id);
        $this->assertNull($tenant->fresh()->subscribed_until);
        $this->report('another-reference')->assertUnprocessable();
    }

    public function test_only_superadmin_can_review_or_list_subscription_payments(): void
    {
        [$owner] = $this->store();
        Sanctum::actingAs($owner);
        $id = $this->report()->json('id');
        foreach ([$owner, User::factory()->create(['role' => User::ROLE_ADMIN])] as $actor) {
            Sanctum::actingAs($actor);
            $this->getJson('/api/admin/subscriptions/payments')->assertForbidden();
            $this->putJson('/api/admin/subscriptions/payments/'.$id, ['status' => 'approved'])->assertForbidden();
        }
        $this->assertDatabaseHas('subscription_payments', ['id' => $id, 'status' => 'pending']);
    }

    public function test_approval_keeps_remaining_trial_and_is_idempotent(): void
    {
        $this->travelTo(now()->startOfSecond());
        [$owner, $tenant] = $this->store();
        Sanctum::actingAs($owner);
        $id = $this->report()->json('id');
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_SUPERADMIN]));
        $url = '/api/admin/subscriptions/payments/'.$id;
        $this->putJson($url, ['status' => 'approved'])->assertOk();
        $expected = $tenant->trial_ends_at->copy()->addMonthNoOverflow();
        $this->assertTrue($tenant->fresh()->subscribed_until->equalTo($expected));
        $this->putJson($url, ['status' => 'approved'])->assertOk();
        $this->assertTrue($tenant->fresh()->subscribed_until->equalTo($expected));
        $this->putJson($url, ['status' => 'rejected'])->assertUnprocessable();
    }

    public function test_expired_store_renewal_starts_today_handles_month_end_and_reopens_catalog(): void
    {
        $this->travelTo(now()->setDate(2027, 1, 31)->setTime(12, 0));
        [$owner, $tenant] = $this->store();
        $tenant->forceFill(['trial_ends_at' => now()->subDays(10)])->save();
        Sanctum::actingAs($owner);
        $id = $this->report()->json('id');
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_SUPERADMIN]));
        $this->putJson('/api/admin/subscriptions/payments/'.$id, ['status' => 'approved'])->assertOk();
        $this->assertSame('2027-02-28 12:00:00', $tenant->fresh()->subscribed_until->format('Y-m-d H:i:s'));
        $this->getJson('/api/tenants/test-store')->assertOk();
        $this->travelTo($tenant->fresh()->subscribed_until);
        $this->getJson('/api/tenants/test-store')->assertForbidden();
    }

    public function test_rejection_does_not_extend_service_and_reference_cannot_be_reused(): void
    {
        [$owner, $tenant] = $this->store();
        Sanctum::actingAs($owner);
        $id = $this->report()->json('id');
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_SUPERADMIN]));
        $this->putJson('/api/admin/subscriptions/payments/'.$id, ['status' => 'rejected'])->assertOk();
        $this->assertNull($tenant->fresh()->subscribed_until);
        Sanctum::actingAs($owner);
        $this->report()->assertUnprocessable();
        $this->report('REF-NEW')->assertCreated();
    }

    public function test_subscription_history_is_scoped_to_the_owner(): void
    {
        [$owner] = $this->store();
        Sanctum::actingAs($owner);
        $this->report()->assertCreated();
        [$other] = $this->store('other-store');
        Sanctum::actingAs($other);
        $this->getJson('/api/admin/subscription')->assertOk()->assertJsonCount(0, 'payments');
    }

    public function test_paid_renewal_extends_existing_paid_time_and_suspension_still_wins(): void
    {
        $this->travelTo(now()->startOfSecond());
        [$owner, $tenant] = $this->store();
        $end = now()->addMonths(2);
        $tenant->forceFill(['subscribed_until' => $end])->save();
        Sanctum::actingAs($owner);
        $id = $this->report()->json('id');
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_SUPERADMIN]));
        $this->putJson('/api/admin/subscriptions/payments/'.$id, ['status' => 'approved'])->assertOk();
        $this->assertTrue($tenant->fresh()->subscribed_until->equalTo($end->copy()->addMonthNoOverflow()));
        $tenant->update(['status' => Tenant::STATUS_SUSPENDED]);
        $this->getJson('/api/tenants/test-store')->assertNotFound();
    }

    private function store(string $domain = 'test-store'): array
    {
        $owner = User::factory()->create(['role' => User::ROLE_CLIENT, 'status' => User::STATUS_ACTIVE]);
        $tenant = Tenant::create(['name' => 'Test', 'domain' => $domain, 'user_id' => $owner->id, 'status' => Tenant::STATUS_ACTIVE]);

        return [$owner, $tenant];
    }

    private function report(string $reference = 'REF-1')
    {
        return $this->postJson('/api/admin/subscription/payments', ['reference' => $reference]);
    }
}
