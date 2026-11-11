import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4175";
assert.ok(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname),
  "Use only a local preview",
);
const routes = [
  ["/", 200],
  ["/produtos", 200],
  ["/produto/incenso-aromatico", 200],
  ["/produto/nao-existe-iyamarlene", 404],
  ["/rota-inexistente", 404],
  ["/politica-de-privacidade", 200],
  ["/termos-de-uso", 200],
  ["/politica-de-trocas-e-devolucoes", 200],
  ["/politica-de-entrega", 200],
  ["/sitemap.xml", 200],
  ["/robots.txt", 200],
  ["/favicon.ico", 200],
];
for (const [path, status] of routes) {
  const start = performance.now();
  const response = await fetch(base + path);
  const html = await response.text();
  assert.equal(response.status, status, path);
  if (path === "/") {
    assert.match(html, /Orientação,/);
    assert.match(html, /WebSite/);
  }
  if (path === "/produto/incenso-aromatico") {
    assert.match(html, /<h1[^>]*>Incenso Aromático/);
    assert.match(html, /"@type":"Product"/);
    assert.match(
      html,
      /rel="canonical" href="https:\/\/iyamarlene.com.br\/produto\/incenso-aromatico"/,
    );
  }
  if (path === "/robots.txt") assert.match(html, /Disallow: \//);
  console.log(
    JSON.stringify({
      path,
      status: response.status,
      ms: Math.round(performance.now() - start),
      bytes: Buffer.byteLength(html),
    }),
  );
}
let cookie = "";
async function cart(action = "", body) {
  const response = await fetch(
    base + "/api/cart" + (action ? "/" + action : ""),
    {
      method: body ? "POST" : "GET",
      headers: {
        Cookie: cookie,
        Origin: base,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    },
  );
  for (const value of response.headers.getSetCookie()) {
    const part = value.split(";")[0];
    const name = part.split("=")[0];
    cookie = cookie
      .split("; ")
      .filter((p) => p && !p.startsWith(name + "="))
      .concat(part)
      .join("; ");
  }
  assert.match(response.headers.get("Cache-Control"), /no-store/);
  assert.equal(response.ok, true);
  return response.json();
}
const catalog = await fetch(base + "/produtos").then((r) => r.text());
assert.match(catalog, /Incenso Aromático/);
await cart();
let current = await cart("add-item", { id: 23, quantity: 1 });
assert.equal(current.items_count, 1);
current = await cart("update-item", { key: current.items[0].key, quantity: 2 });
assert.equal(current.items_count, 2);
current = await cart("remove-item", { key: current.items[0].key });
assert.equal(current.items_count, 0);
console.log(
  "PASS: real guest Store API cart add/update/remove and session persistence; no order or payment created.",
);
