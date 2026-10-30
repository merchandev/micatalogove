import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

// Integration smoke test against the isolated Docker Desktop demo database.
const base = 'http://localhost:8002';
async function api(path, { method = 'GET', body, token, status = 200 } = {}) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  assert.equal(response.status, status, `${method} ${path} returned ${response.status}`);
  return response.json();
}

const tokens = [];
try {
  const accounts = {};
  for (const [name, role] of [['superadmin', 'superadmin'], ['admin', 'admin'], ['cliente', 'client']]) {
    const login = await api('/login', { method: 'POST', body: { email: `${name}@micatalogo.com`, password: 'password123' } });
    assert.equal(login.user.role, role);
    tokens.push(login.token);
    accounts[name] = login.token;
    await api('/user', { token: login.token });
    for (const path of ['/admin/dashboard', '/admin/products', '/admin/orders', '/admin/conversations', '/admin/carts']) {
      await api(path, { token: login.token });
    }
  }
  await api('/admin/users', { token: accounts.cliente, status: 403 });
  await api('/admin/database', { token: accounts.cliente, status: 403 });
  await api('/admin/database', { token: accounts.admin, status: 403 });
  await api('/admin/database', { token: accounts.superadmin });
  console.log('PASS: three roles, dashboards, protected lists and permission boundaries.');

  const domain = 'arturomerchan18';
  await api(`/tenants/${domain}`);
  const products = (await api(`/tenants/${domain}/products`)).data;
  const product = products.find(item => item.stock_quantity > 1);
  assert.ok(product, 'The demo catalog must contain stock');
  await api(`/tenants/${domain}/products/${product.slug || product.id}`);
  const session = randomUUID();
  const items = [{ id: product.id, name: 'Precio manipulado', quantity: 1, price: 0.01 }];
  const cart = await api(`/tenants/${domain}/carts`, { method: 'POST', status: 201, body: { session_id: session, items, total_amount: 0.01, customer_name: 'Prueba Docker' } });
  assert.equal(Number(cart.total_amount), Number(product.price));
  const order = await api(`/tenants/${domain}/checkout`, { method: 'POST', status: 201, body: { session_id: session, items, customer_name: 'Prueba Docker', source: 'docker_smoke', message: 'Pedido de prueba local, sin enviar WhatsApp.' } });
  assert.equal(Number(order.total_amount), Number(product.price));
  assert.equal(Number(order.items[0].unit_price), Number(product.price));
  await api(`/admin/orders/${order.id}`, { method: 'PUT', token: accounts.cliente, body: { status: 'completed' } });
  const updated = (await api(`/tenants/${domain}/products/${product.id}`)).data;
  assert.equal(updated.stock_quantity, product.stock_quantity - 1);
  await api(`/tenants/${domain}/checkout`, { method: 'POST', status: 422, body: { items: [{ id: product.id, quantity: product.stock_quantity + 100 }] } });
  // Leave an open cart and a completed sale visible for exploring the dashboard.
  await api(`/tenants/${domain}/carts`, { method: 'POST', status: 201, body: { session_id: randomUUID(), items, customer_name: 'Carrito de ejemplo Docker' } });
  console.log(`PASS: public catalog, product detail, authoritative prices, checkout, sale #${order.id}, stock decrement and insufficient-stock rejection.`);

  await api('/forgot-password', { method: 'POST', body: { email: 'superadmin@micatalogo.com' } });
  const inboxResponse = await fetch('http://localhost:8025/api/v1/messages');
  assert.equal(inboxResponse.status, 200);
  const inbox = await inboxResponse.json();
  assert.ok(inbox.messages.some(message => message.To.some(to => to.Address === 'superadmin@micatalogo.com')));
  console.log('PASS: password recovery message delivered to Mailpit.');
} finally {
  for (const token of tokens) await api('/logout', { method: 'POST', token });
}
