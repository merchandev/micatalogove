<?php

namespace Tests\Feature;

use App\Models\SubscriptionPayment;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlatformManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_superadmin_can_access_platform_data_and_store_actions(): void
    {
        $store = $this->store();
        $this->getJson('/api/admin/platform')->assertUnauthorized();
        foreach ([User::ROLE_CLIENT, User::ROLE_ADMIN] as $role) {
            Sanctum::actingAs(User::factory()->create(['role' => $role]));
            $this->getJson('/api/admin/platform')->assertForbidden();
            $this->getJson('/api/admin/platform/stores/'.$store->id)->assertForbidden();
            $this->patchJson('/api/admin/platform/stores/'.$store->id, ['status' => 'suspended'])->assertForbidden();
            $this->postJson('/api/admin/platform/stores/'.$store->id.'/verification')->assertForbidden();
            $this->postJson('/api/admin/platform/stores/'.$store->id.'/activation')->assertForbidden();
        }
        $this->assertSame('active', $store->fresh()->status);
    }

    public function test_overview_includes_stores_without_payments_or_owners_and_clients_without_stores(): void
    {
        $store = $this->store();
        Tenant::create(['name' => 'Orphan Store', 'domain' => 'orphan-store', 'status' => 'active']);
        User::factory()->create(['name' => 'No Store', 'role' => User::ROLE_CLIENT]);
        $this->admin();
        $response = $this->getJson('/api/admin/platform')->assertOk()->assertJsonPath('summary.stores', 2)
            ->assertJsonPath('summary.clients', 2)->assertJsonCount(2, 'stores.data')
            ->assertJsonCount(1, 'clients_without_store.data');
        $row = collect($response->json('stores.data'))->firstWhere('id', $store->id);
        $this->assertSame('trial', $row['subscription']['status']);
        $this->assertTrue($row['user']['email_activation']['verified']);
        $this->assertArrayNotHasKey('password', $row['user']);
        $this->assertSame(0, $row['pending_payments_count']);
    }

    public function test_search_filters_activation_subscription_and_pagination(): void
    {
        $store = $this->store();
        $store->user->forceFill(['email_verified_at' => null])->save();
        $this->admin();
        $this->getJson('/api/admin/platform?search=shop-one&activation=pending&subscription=trial')->assertOk()->assertJsonPath('stores.total', 1);
        $this->getJson('/api/admin/platform?activation=verified')->assertOk()->assertJsonPath('stores.total', 0);
        $this->getJson('/api/admin/platform?subscription=active')->assertOk()->assertJsonPath('stores.total', 0);
        $this->getJson('/api/admin/platform?search=missing')->assertOk()->assertJsonPath('stores.total', 0);
        $this->travel(25)->hours();
        $this->getJson('/api/admin/platform?activation=expired')->assertOk()->assertJsonPath('stores.total', 1);
        for ($i = 0; $i < 21; $i++) {
            Tenant::create(['name' => 'Extra', 'domain' => 'extra-'.$i, 'status' => 'active']);
        }
        $this->getJson('/api/admin/platform?page=2')->assertOk()->assertJsonPath('stores.total', 22)->assertJsonCount(2, 'stores.data');
    }

    public function test_store_details_payment_totals_and_histories_are_tenant_specific(): void
    {
        $first = $this->store();
        $second = $this->store('shop-two');
        $this->payment($first, 'FIRST', 'pending');
        $this->payment($first, 'PAID', 'approved');
        $this->payment($second, 'SECOND', 'pending');
        $this->admin();
        $response = $this->getJson('/api/admin/platform/stores/'.$first->id)->assertOk()->assertJsonCount(2, 'payments.data');
        $this->assertNotContains('SECOND', array_column($response->json('payments.data'), 'reference'));
        $summary = $this->getJson('/api/admin/platform')->assertOk()->assertJsonPath('summary.pending_payments', 2);
        $this->assertEquals(5, $summary->json('summary.approved_subscription_total'));
    }

    public function test_superadmin_can_suspend_reactivate_edit_and_resend_without_extending_activation(): void
    {
        Notification::fake();
        $store = $this->store();
        $store->user->forceFill(['email_verified_at' => null])->save();
        $deadline = $store->user->emailVerificationDeadline();
        $this->admin();
        $this->patchJson('/api/admin/platform/stores/'.$store->id, ['status' => 'suspended', 'subscribed_until' => '2099-01-01'])->assertOk();
        $this->getJson('/api/tenants/shop-one')->assertNotFound();
        $this->assertNull($store->fresh()->subscribed_until);
        $this->patchJson('/api/admin/platform/stores/'.$store->id, ['status' => 'active'])->assertOk();
        $this->getJson('/api/tenants/shop-one')->assertOk();
        $this->putJson('/api/admin/store', ['tenant_id' => $store->id, 'name' => 'Edited', 'domain' => 'shop-one', 'theme' => 'tech-demo'])->assertOk();
        $this->assertSame('Edited', $store->fresh()->name);
        $this->postJson('/api/admin/platform/stores/'.$store->id.'/verification')->assertOk();
        Notification::assertSentTo($store->user, VerifyEmail::class);
        $this->assertTrue($store->user->fresh()->emailVerificationDeadline()->equalTo($deadline));
    }

    public function test_reactivating_store_does_not_bypass_suspended_owner(): void
    {
        $store = $this->store();
        $store->user->update(['status' => User::STATUS_SUSPENDED]);
        $this->admin();
        $this->patchJson('/api/admin/platform/stores/'.$store->id, ['status' => 'active'])->assertOk()->assertJsonPath('publicly_available', false);
        $this->getJson('/api/tenants/shop-one')->assertNotFound();
    }

    public function test_manual_activation_is_idempotent_and_does_not_grant_paid_time(): void
    {
        $store = $this->store();
        $store->user->forceFill(['email_verified_at' => null])->save();
        $trial = $store->trial_ends_at->copy();
        $this->travel(25)->hours();
        $this->getJson('/api/tenants/shop-one')->assertForbidden();
        $this->admin();
        $url = '/api/admin/platform/stores/'.$store->id.'/activation';
        $this->postJson($url)->assertOk();
        $verifiedAt = $store->user->fresh()->email_verified_at;
        $this->postJson($url)->assertOk();
        $this->assertTrue($store->user->fresh()->email_verified_at->equalTo($verifiedAt));
        $this->assertNull($store->fresh()->subscribed_until);
        $this->assertTrue($store->fresh()->trial_ends_at->equalTo($trial));
        $this->getJson('/api/tenants/shop-one')->assertOk();
    }

    public function test_password_change_requires_current_password_and_revokes_all_sessions(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_SUPERADMIN, 'password' => Hash::make('temporary-password-123')]);
        $user->createToken('one');
        $user->createToken('two');
        Sanctum::actingAs($user);
        $data = ['current_password' => 'wrong', 'password' => 'new-long-password-456', 'password_confirmation' => 'new-long-password-456'];
        $this->putJson('/api/account/password', $data)->assertUnprocessable();
        $this->assertDatabaseCount('personal_access_tokens', 2);
        $data['current_password'] = 'temporary-password-123';
        $this->putJson('/api/account/password', $data)->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertTrue(Hash::check($data['password'], $user->fresh()->password));
    }

    private function admin(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_SUPERADMIN]));
    }

    private function store(string $domain = 'shop-one'): Tenant
    {
        return Tenant::create(['user_id' => User::factory()->create(['role' => User::ROLE_CLIENT])->id, 'name' => 'Store', 'domain' => $domain, 'status' => 'active']);
    }

    private function payment(Tenant $tenant, string $reference, string $status): void
    {
        SubscriptionPayment::create(['tenant_id' => $tenant->id, 'reference' => $reference, 'status' => $status, 'amount' => 5, 'currency' => 'USD', 'plan_code' => 'catalogo']);
    }
}
