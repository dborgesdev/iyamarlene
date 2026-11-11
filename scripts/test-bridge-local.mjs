import assert from 'node:assert/strict';
const base = process.env.WORDPRESS_TEST_URL || 'http://127.0.0.1:54002';
assert.equal(new URL(base).hostname, '127.0.0.1', 'This test is restricted to isolated local WordPress');
const origin = 'http://127.0.0.1:54001';
const api = `${base}/wp-json/wc/store/v1`;
const capability = await fetch(`${base}/wp-json/iya/v1/checkout`).then(r => r.json());
assert.equal(capability.version, 2); assert.equal(capability.guest, true);
let sourceToken;
async function sourceCart(action = '', body) {
  const response = await fetch(`${api}/cart${action ? '/' + action : ''}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(sourceToken ? { 'Cart-Token': sourceToken } : {}) }, body: body ? JSON.stringify(body) : undefined });
  assert.ok(response.ok, `Store API ${action}: ${response.status}`);
  sourceToken = response.headers.get('Cart-Token') || sourceToken;
  return response.json();
}
const products = await fetch(`${api}/products`).then(r => r.json());
assert.ok(products.length >= 2);
await sourceCart();
await sourceCart('add-item', { id: products[0].id, quantity: 2 });
const before = await sourceCart('add-item', { id: products[1].id, quantity: 1 });
const endpoint = `${base}/wp-json/iya/v1/checkout/handoff`;
assert.equal((await fetch(endpoint, { method: 'POST', headers: { Origin: 'https://attacker.invalid', 'Cart-Token': sourceToken } })).status, 403);
assert.ok([401, 403, 409].includes((await fetch(endpoint, { method: 'POST', headers: { Origin: origin, 'Cart-Token': 'invalid.token.value' } })).status));
const response = await fetch(endpoint, { method: 'POST', headers: { Origin: origin, 'Cart-Token': sourceToken } });
const issued = await response.json();
assert.equal(response.status, 200, JSON.stringify(issued));
assert.match(issued.ticket, /^[a-f0-9]{64}$/);
assert.equal(JSON.stringify(issued).includes(sourceToken), false);
assert.match(response.headers.get('Cache-Control'), /no-store/);
const post = () => fetch(`${base}/wp-admin/admin-post.php`, { method: 'POST', redirect: 'manual', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ action: 'iya_checkout', ticket: issued.ticket }) });
const transferred = await post();
assert.equal(transferred.status, 303, await transferred.text());
const location = transferred.headers.get('Location');
assert.ok(location.startsWith(base));
assert.equal(location.includes(sourceToken), false);
assert.equal(location.includes(issued.ticket), false);
const cookie = transferred.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
assert.match(cookie, /wp_woocommerce_session_/);
const expected = before.items.map(item => [item.id, item.quantity]).sort();
for (let reload = 0; reload < 2; reload++) {
  const checkout = await fetch(location, { headers: { Cookie: cookie } });
  const html = await checkout.text();
  assert.equal(checkout.status, 200);
  assert.match(html, /iya-commerce/); assert.match(html, /logo-iya-marlene/);
  assert.match(html, /Desenvolvido por Douglas Borges - Smart Local/);
  const native = await fetch(`${api}/cart`, { headers: { Cookie: cookie } }).then(r => r.json());
  assert.deepEqual(native.items.map(item => [item.id, item.quantity]).sort(), expected);
  assert.equal(native.totals.total_items, before.totals.total_items);
}
assert.equal((await post()).status, 409, 'Single-use ticket must reject replay');
assert.deepEqual((await sourceCart()).items.map(item => [item.id, item.quantity]).sort(), expected, 'Source cart remains until reliable payment confirmation');
console.log('PASS: guest checkout, authoritative items/quantities/totals, native cookie session after two reloads, origin/token checks and replay protection. No order/payment created.');

