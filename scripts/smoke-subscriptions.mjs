import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const domain = `subscription-qa-${randomUUID()}`;
const email = `${domain}@example.test`;
const password = 'local-subscription-test-2026';
const phpBootstrap = "require '/var/www/vendor/autoload.php'; $app = require '/var/www/bootstrap/app.php'; $app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); if (!$app->environment('local')) { throw new RuntimeException('Local environment required'); } ";
const php = (code) => execFileSync('docker', [
  'compose', '--env-file', '.env.docker.local', '-f', 'docker-compose.local.yml',
  'exec', '-T', 'app', 'php', '-r', phpBootstrap + code, domain, email,
], { encoding: 'utf8' });

async function api(path, { method = 'GET', body, token, status = 200 } = {}) {
  const response = await fetch(`http://localhost:8002/api${path}`, {
    method, headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  assert.equal(response.status, status, `${method} ${path}: ${response.status}`);
  return response.json();
}

let created = false;
let adminToken;
try {
  await api('/register', { method: 'POST', status: 201, body: { name: 'Subscription QA', email, password, store_name: 'Subscription QA', domain, theme: 'minimal-demo', subscribed_until: '2099-01-01' } });
  created = true;
  const owner = await api('/login', { method: 'POST', body: { email, password } });
  let state = await api('/admin/subscription', { token: owner.token });
  assert.equal(state.subscription.status, 'trial');
  assert.equal(state.subscription.trial_days_remaining, 7);
  assert.equal(state.subscription.subscribed_until, null);
  await api(`/tenants/${domain}`);

  php("App\\Models\\Tenant::where('domain', $argv[1])->firstOrFail()->forceFill(['trial_ends_at' => now()->subMinute()])->save();");
  await api(`/tenants/${domain}`, { status: 403 });
  await api('/admin/products', { method: 'POST', body: {}, token: owner.token, status: 403 });
  state = await api('/admin/subscription', { token: owner.token });
  assert.equal(state.subscription.status, 'expired');
  const payment = await api('/admin/subscription/payments', { method: 'POST', status: 201, token: owner.token, body: { reference: domain, amount: '0.01', status: 'approved' } });
  assert.equal(payment.amount, '5.00');
  assert.equal(payment.status, 'pending');
  await api(`/tenants/${domain}`, { status: 403 });
  await api(`/admin/subscriptions/payments/${payment.id}`, { method: 'PUT', token: owner.token, body: { status: 'approved' }, status: 403 });
  adminToken = (await api('/login', { method: 'POST', body: { email: 'superadmin@micatalogo.com', password: 'password123' } })).token;
  const first = await api(`/admin/subscriptions/payments/${payment.id}`, { method: 'PUT', token: adminToken, body: { status: 'approved' } });
  const repeated = await api(`/admin/subscriptions/payments/${payment.id}`, { method: 'PUT', token: adminToken, body: { status: 'approved' } });
  assert.equal(first.period_ends_at, repeated.period_ends_at);
  await api(`/tenants/${domain}`);
  state = await api('/admin/subscription', { token: owner.token });
  assert.equal(state.subscription.status, 'active');
  console.log('PASS on Docker/MariaDB: 7-day trial, expiry, read access, renewal reporting, server price, approval permissions, reactivation and idempotency.');
} finally {
  if (adminToken) await api('/logout', { method: 'POST', token: adminToken });
  if (created) {
    // Delete only the unique synthetic store/account created by this invocation.
    php("$tenant = App\\Models\\Tenant::where('domain', $argv[1])->first(); $user = App\\Models\\User::where('email', $argv[2])->first(); if ($tenant && $user && $tenant->user_id === $user->id) { $user->tokens()->delete(); $tenant->delete(); $user->delete(); }");
    console.log('Synthetic subscription QA records removed; demo store preserved.');
  }
}
