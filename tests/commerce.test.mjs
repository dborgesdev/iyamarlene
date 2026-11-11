import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { readFile } from "node:fs/promises";
const compile = async (file) =>
  ts.transpileModule(await readFile(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const moduleUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const commerceUrl = moduleUrl(await compile("src/lib/commerce.ts"));
const commerce = await import(commerceUrl);
const cartSource = (await compile("src/lib/cart-server.ts")).replace(
  /(["'])\.\/commerce\1/,
  JSON.stringify(commerceUrl),
);
const cart = await import(moduleUrl(cartSource));

test("currency minor units and plain-text XSS boundaries", () => {
  assert.equal(
    commerce.money({
      price: "1890",
      currency_code: "BRL",
      currency_minor_unit: 2,
    }),
    "R$\u00a018,90",
  );
  assert.equal(
    commerce.plain("<p>Banho &#8211; ervas &amp; cuidado</p>"),
    "Banho – ervas & cuidado",
  );
});
test("catalog follows every page without silently truncating", async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    const page = Number(new URL(url).searchParams.get("page"));
    return Response.json([{ id: page, name: "Nome &#8211; real" }], {
      headers: { "X-WP-TotalPages": "3" },
    });
  };
  try {
    const products = await commerce.catalog();
    assert.equal(products.length, 3);
    assert.equal(calls.length, 3);
    assert.equal(products[0].name, "Nome – real");
  } finally {
    globalThis.fetch = previous;
  }
});
test("cart rejects foreign origins and arbitrary upstream paths", async () => {
  assert.equal(
    (
      await cart.cartRequest(
        new Request("https://iyamarlene.com.br/api/cart/add-item", {
          method: "POST",
          headers: { Origin: "https://attacker.invalid" },
        }),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await cart.cartRequest(
        new Request("https://iyamarlene.com.br/api/cart/checkout"),
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await cart.cartRequest(
        new Request("https://iyamarlene.com.br/api/cart", { method: "DELETE" }),
      )
    ).status,
    405,
  );
});
test("cart keeps token HttpOnly and forwards only trusted fields", async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json(
      { items: [], items_count: 0 },
      { headers: { "Cart-Token": "test.token.sig" } },
    );
  };
  try {
    const response = await cart.cartRequest(
      new Request("https://iyamarlene.com.br/api/cart/add-item", {
        method: "POST",
        headers: {
          Origin: "https://iyamarlene.com.br",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: 23, quantity: 2, price: 1 }),
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    assert.match(response.headers.get("Set-Cookie"), /HttpOnly/);
    assert.match(response.headers.get("Set-Cookie"), /Secure/);
    assert.deepEqual(JSON.parse(calls[1].options.body), {
      id: 23,
      quantity: 2,
    });
    assert.equal((await response.text()).includes("test.token.sig"), false);
  } finally {
    globalThis.fetch = previous;
  }
});
test("checkout never redirects a bearer token through a URL", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async (url) => Response.json(String(url).endsWith("/handoff") ? { ticket: "a".repeat(64) } : { version: 2 });
  try {
    const response = await cart.checkoutRequest(
      new Request("https://iyamarlene.com.br/api/checkout", {
        method: "POST",
        headers: {
          Origin: "https://iyamarlene.com.br",
          Cookie: "iya_cart=test.token.sig",
        },
      }),
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /method="post"/);
    assert.match(html, /name="ticket"/);
    assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin');
    assert.equal(html.includes("test.token.sig"), false);
    assert.equal(response.headers.has("Location"), false);
    assert.match(response.headers.get("Cache-Control"), /no-store/);
  } finally {
    globalThis.fetch = previous;
  }
});

test("checkout fails closed when the WordPress bridge is absent", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => new Response("Not found", { status: 404 });
  try {
    const response = await cart.checkoutRequest(
      new Request("https://iyamarlene.com.br/api/checkout", {
        method: "POST",
        headers: {
          Origin: "https://iyamarlene.com.br",
          Cookie: "iya_cart=test.token.sig",
        },
      }),
    );
    assert.equal(response.status, 503);
    assert.equal((await response.text()).includes("test.token.sig"), false);
  } finally {
    globalThis.fetch = previous;
  }
});

test('expired sessions preserve the cookie and require explicit cart recovery', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ code: 'expired' }, { status: 403 });
  try {
    const response = await cart.cartRequest(new Request('https://iyamarlene.com.br/api/cart', { headers: { Cookie: 'iya_cart=test.token.sig' } }));
    assert.equal(response.status,409);
    assert.equal((await response.json()).code,'session_expired');
    assert.equal(response.headers.has('Set-Cookie'),false);
  } finally { globalThis.fetch = previous; }
});

test('recovery revalidates IDs and quantities, ignoring browser prices', async () => {
  const previous = globalThis.fetch; const bodies=[];
  globalThis.fetch = async (url, options) => {
    if (options.body) bodies.push(JSON.parse(options.body));
    return Response.json({ items: [], items_count: 0, errors: [] }, { headers: { 'Cart-Token': 'new.token.sig' } });
  };
  try {
    const response = await cart.cartRequest(new Request('https://iyamarlene.com.br/api/cart/recover', { method:'POST', headers:{ Origin:'https://iyamarlene.com.br', 'Content-Type':'application/json' }, body:JSON.stringify({ items:[{id:23,quantity:2,price:1}] }) }));
    assert.equal(response.status,200);
    assert.deepEqual(bodies,[{id:23,quantity:2}]);
    assert.match(response.headers.get('Set-Cookie'),/HttpOnly/);
  } finally { globalThis.fetch=previous; }
});
