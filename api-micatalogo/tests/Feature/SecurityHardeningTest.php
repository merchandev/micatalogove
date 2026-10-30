<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_is_throttled_per_email_and_visitor_ip_behind_the_trusted_proxy(): void
    {
        $user = User::factory()->create(['password' => Hash::make('correct-password')]);
        $visitor = fn (string $ip) => $this->withServerVariables(['REMOTE_ADDR' => '172.18.0.5'])
            ->withHeader('X-Forwarded-For', $ip);

        for ($i = 0; $i < 5; $i++) {
            $visitor('203.0.113.10')->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])->assertUnauthorized();
        }
        $visitor('203.0.113.10')->postJson('/api/login', ['email' => $user->email, 'password' => 'correct-password'])
            ->assertStatus(429)->assertJsonPath('code', 'too_many_requests')->assertHeader('Retry-After');

        // Another visitor behind the same proxy keeps its own bucket.
        $visitor('203.0.113.20')->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])->assertUnauthorized();
    }

    public function test_forwarded_for_from_an_untrusted_client_is_ignored(): void
    {
        $user = User::factory()->create();
        for ($i = 0; $i < 5; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.7'])->withHeader('X-Forwarded-For', "203.0.113.{$i}")
                ->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])->assertUnauthorized();
        }
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.7'])->withHeader('X-Forwarded-For', '203.0.113.99')
            ->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_registration_password_reset_and_checkout_are_rate_limited(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/register', [])->assertUnprocessable();
        }
        $this->postJson('/api/register', [])->assertStatus(429);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/forgot-password', [])->assertUnprocessable();
        }
        $this->postJson('/api/forgot-password', ['email' => 'owner@example.test'])->assertStatus(429);

        $tenant = Tenant::create(['name' => 'Shop', 'domain' => 'shop', 'status' => Tenant::STATUS_ACTIVE]);
        for ($i = 0; $i < 10; $i++) {
            $this->postJson("/api/tenants/{$tenant->domain}/checkout", ['items' => []])->assertUnprocessable();
        }
        $this->postJson("/api/tenants/{$tenant->domain}/checkout", ['items' => []])->assertStatus(429);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_tokens_expire_after_the_configured_lifetime_and_expired_tokens_are_pruned_on_login(): void
    {
        config(['sanctum.guard' => []]);
        $this->travelTo(now()->startOfSecond());
        $user = User::factory()->create(['password' => Hash::make('correct-password')]);

        $login = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'correct-password'])->assertOk();
        $this->assertTrue(now()->addDays(7)->equalTo($login->json('expires_at')));
        $token = $login->json('token');

        $this->travel(7)->days();
        $this->travel(-1)->minutes();
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertOk();

        $this->travel(2)->minutes();
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();

        $this->app['auth']->forgetGuards();
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'correct-password'])->assertOk();
        $this->assertSame(1, $user->tokens()->count());
    }

    public function test_suspension_role_and_password_changes_revoke_tokens_and_reactivation_does_not_restore_them(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_SUPERADMIN]);
        $client = User::factory()->create();
        $client->createToken('phone');
        $client->createToken('laptop');
        Sanctum::actingAs($admin);

        $this->postJson("/api/admin/users/{$client->id}/suspend")->assertOk();
        $this->assertSame(0, $client->tokens()->count());

        $client->createToken('stale');
        $this->postJson("/api/admin/users/{$client->id}/approve")->assertOk();
        $this->assertSame(0, $client->tokens()->count());

        $client->createToken('again');
        $this->putJson("/api/admin/users/{$client->id}", ['password' => 'another-password'])->assertOk();
        $this->assertSame(0, $client->tokens()->count());

        $client->createToken('before-delete');
        $this->deleteJson("/api/admin/users/{$client->id}")->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_self_registered_catalog_is_published_only_after_a_valid_signed_email_confirmation(): void
    {
        Notification::fake();
        $this->postJson('/api/register', [
            'name' => 'Owner', 'email' => 'owner@example.test', 'password' => 'test-password',
            'store_name' => 'Owner Shop', 'domain' => 'owner-shop', 'theme' => 'minimal-demo',
        ])->assertCreated();
        $owner = User::where('email', 'owner@example.test')->sole();
        $this->assertFalse($owner->hasVerifiedEmail());

        $url = null;
        Notification::assertSentTo($owner, VerifyEmail::class, function (VerifyEmail $notification) use ($owner, &$url) {
            $url = $notification->toMail($owner)->actionUrl;

            return true;
        });
        $this->assertStringStartsWith(rtrim(config('app.frontend_url'), '/').'/verify-email?', $url);
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        Product::create(['tenant_id' => $owner->tenant->id, 'name' => 'Item', 'price' => 5, 'stock_quantity' => 3, 'status' => 'active']);
        $this->getJson('/api/tenants/owner-shop')->assertForbidden()->assertJsonPath('code', 'email_unverified');
        $this->postJson('/api/tenants/owner-shop/checkout', ['items' => [['id' => 1, 'quantity' => 1]]])
            ->assertForbidden()->assertJsonPath('code', 'email_unverified');

        $verify = fn (array $params) => $this->getJson("/api/email/verify/{$query['id']}/{$query['hash']}?".http_build_query($params));
        $verify(['expires' => $query['expires'], 'signature' => str_repeat('0', 64)])->assertForbidden();
        $verify(['expires' => $query['expires'] + 3600, 'signature' => $query['signature']])->assertForbidden();
        $this->getJson("/api/email/verify/{$query['id']}/".sha1('other@example.test').'?'.http_build_query([
            'expires' => $query['expires'], 'signature' => $query['signature'],
        ]))->assertForbidden();
        $this->assertFalse($owner->fresh()->hasVerifiedEmail());

        $verify(['expires' => $query['expires'], 'signature' => $query['signature']])->assertOk();
        $this->assertTrue($owner->fresh()->hasVerifiedEmail());
        $this->getJson('/api/tenants/owner-shop')->assertOk();

        $this->travel(2)->days();
        $verify(['expires' => $query['expires'], 'signature' => $query['signature']])->assertForbidden();
    }

    public function test_verification_email_resend_is_throttled_and_staff_created_clients_are_verified(): void
    {
        Notification::fake();
        $owner = User::factory()->unverified()->create();
        Sanctum::actingAs($owner);
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/email/verification-notification')->assertOk();
        }
        $this->postJson('/api/email/verification-notification')->assertStatus(429);
        Notification::assertSentToTimes($owner, VerifyEmail::class, 3);

        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_ADMIN]));
        $this->postJson('/api/admin/users', [
            'name' => 'Staff Client', 'email' => 'staff-client@example.test', 'password' => 'test-password',
            'role' => User::ROLE_CLIENT, 'status' => User::STATUS_ACTIVE, 'store_name' => 'Staff Shop', 'domain' => 'staff-shop',
        ])->assertCreated();
        $this->assertTrue(User::where('email', 'staff-client@example.test')->sole()->hasVerifiedEmail());
        $this->getJson('/api/tenants/staff-shop')->assertOk();
    }

    public function test_verify_email_is_a_reserved_store_link(): void
    {
        $this->getJson('/api/domain-availability?domain=verify-email')->assertOk()->assertJsonPath('available', false);
    }
}
