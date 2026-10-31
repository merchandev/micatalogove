<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\SupportSession;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupportSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_superadmin_with_real_token_can_start_assistance(): void
    {
        [$owner, $tenant] = $this->store();
        $this->postJson('/api/admin/platform/stores/'.$tenant->id.'/support')->assertUnauthorized();
        foreach ([$owner, User::factory()->create(['role' => User::ROLE_ADMIN])] as $user) {
            $this->callAs($user->createToken('test')->plainTextToken, null, 'POST', '/api/admin/platform/stores/'.$tenant->id.'/support')->assertForbidden();
        }
        $this->assertDatabaseCount('support_sessions', 0);
    }

    public function test_support_sees_only_selected_client_and_audits_changes_without_minting_client_tokens(): void
    {
        [$owner, $tenant, $product] = $this->store();
        [, $other, $foreign] = $this->store('other');
        [$actor, $token, $session] = $this->start($tenant);
        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->callAs($token, $session, 'GET', '/api/user')->assertOk()->assertJsonPath('role', 'client')
            ->assertJsonPath('id', $owner->id)->assertJsonPath('tenant.id', $tenant->id)
            ->assertJsonPath('support_session.id', $session);
        $this->callAs($token, $session, 'GET', '/api/admin/products')->assertOk()->assertJsonCount(1);
        $this->callAs($token, $session, 'PUT', '/api/admin/products/'.$foreign->id, ['name' => 'Forbidden'])->assertNotFound();
        $this->callAs($token, $session, 'PUT', '/api/admin/products/'.$product->id, ['name' => 'Assisted'])->assertOk();
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Assisted']);
        $this->assertDatabaseHas('products', ['id' => $foreign->id, 'name' => 'Product']);
        $this->assertDatabaseHas('support_sessions', ['id' => $session, 'actor_id' => $actor->id, 'client_id' => $owner->id, 'tenant_id' => $tenant->id]);
        $this->assertDatabaseHas('support_actions', ['support_session_id' => $session, 'method' => 'PUT', 'path' => 'api/admin/products/'.$product->id, 'status_code' => 200]);
    }

    public function test_client_context_cannot_access_platform_change_password_or_report_payments(): void
    {
        [, $tenant] = $this->store();
        [, $token, $session] = $this->start($tenant);
        $this->callAs($token, $session, 'GET', '/api/admin/platform')->assertForbidden();
        $this->callAs($token, $session, 'POST', '/api/admin/platform/stores/'.$tenant->id.'/support')->assertForbidden();
        $this->callAs($token, $session, 'PUT', '/api/account/password', [])->assertForbidden();
        $this->callAs($token, $session, 'POST', '/api/admin/subscription/payments', [])->assertForbidden();
        $this->callAs($token, $session, 'POST', '/api/logout')->assertForbidden();
        $this->assertDatabaseCount('support_sessions', 1);
        $this->assertDatabaseCount('subscription_payments', 0);
    }

    public function test_stop_returns_to_same_admin_and_invalidates_support_but_not_admin_token(): void
    {
        [, $tenant] = $this->store();
        [$actor, $token, $session] = $this->start($tenant);
        $this->callAs($token, $session, 'POST', '/api/support/stop', ['session_id' => $session])->assertOk();
        $this->callAs($token, $session, 'POST', '/api/support/stop', ['session_id' => $session])->assertOk();
        $this->callAs($token, $session, 'GET', '/api/user')->assertStatus(409)->assertJsonPath('code', 'support_session_ended');
        $this->callAs($token, null, 'GET', '/api/user')->assertOk()->assertJsonPath('id', $actor->id)->assertJsonPath('role', 'superadmin');
        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertNotNull(SupportSession::find($session)->ended_at);
    }

    public function test_session_is_bound_to_admin_and_original_token_and_expires_at_thirty_minutes(): void
    {
        $this->travelTo(now()->startOfSecond());
        [, $tenant] = $this->store();
        [$actor, $token, $session] = $this->start($tenant);
        $otherToken = $actor->createToken('other-browser')->plainTextToken;
        $this->callAs($otherToken, $session, 'GET', '/api/user')->assertStatus(409);
        $this->callAs($otherToken, null, 'POST', '/api/support/stop', ['session_id' => $session])->assertForbidden();
        $another = User::factory()->create(['role' => User::ROLE_SUPERADMIN])->createToken('another')->plainTextToken;
        $this->callAs($another, $session, 'GET', '/api/user')->assertStatus(409);
        $this->travel(30)->minutes();
        $this->callAs($token, $session, 'GET', '/api/user')->assertStatus(409);
        $this->callAs($token, null, 'GET', '/api/user')->assertOk();
    }

    public function test_suspended_or_reassigned_clients_cannot_be_used_for_support(): void
    {
        [$owner, $tenant] = $this->store();
        [, $token, $session] = $this->start($tenant);
        $owner->update(['status' => User::STATUS_SUSPENDED]);
        $this->callAs($token, $session, 'GET', '/api/user')->assertStatus(409);
        $this->callAs($token, null, 'POST', '/api/admin/platform/stores/'.$tenant->id.'/support')->assertUnprocessable();
        $owner->update(['status' => User::STATUS_ACTIVE]);
        $tenant->update(['user_id' => User::factory()->create()->id]);
        $this->callAs($token, $session, 'GET', '/api/user')->assertStatus(409);
    }

    public function test_support_respects_subscription_expiry_and_admin_token_revocation(): void
    {
        [, $tenant, $product] = $this->store();
        [$actor, $token, $session] = $this->start($tenant);
        $tenant->forceFill(['trial_ends_at' => now()->subMinute()])->save();
        $this->callAs($token, $session, 'GET', '/api/admin/products')->assertOk();
        $this->callAs($token, $session, 'PUT', '/api/admin/products/'.$product->id, ['name' => 'No'])->assertForbidden();
        $actor->tokens()->delete();
        $this->callAs($token, $session, 'GET', '/api/user')->assertUnauthorized();
        $this->assertNull(SupportSession::find($session)->token_id);
    }

    private function callAs(string $token, ?string $session, string $method, string $url, array $data = [])
    {
        $this->app['auth']->forgetGuards();

        return $this->json($method, $url, $data, ['Authorization' => 'Bearer '.$token, 'X-Support-Session' => $session ?? '']);
    }

    private function start(Tenant $tenant): array
    {
        $actor = User::factory()->create(['role' => User::ROLE_SUPERADMIN]);
        $token = $actor->createToken('admin')->plainTextToken;
        $session = $this->callAs($token, null, 'POST', '/api/admin/platform/stores/'.$tenant->id.'/support')->assertCreated()->json('support_session.id');

        return [$actor, $token, $session];
    }

    private function store(string $domain = 'shop'): array
    {
        $owner = User::factory()->create(['role' => User::ROLE_CLIENT]);
        $tenant = Tenant::create(['user_id' => $owner->id, 'name' => 'Store', 'domain' => $domain, 'status' => 'active']);
        $product = Product::create(['tenant_id' => $tenant->id, 'name' => 'Product', 'price' => 10, 'stock_quantity' => 5, 'status' => 'active']);

        return [$owner, $tenant, $product];
    }
}
