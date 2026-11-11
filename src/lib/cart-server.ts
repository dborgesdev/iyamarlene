import { STORE } from "./commerce";
const actions = ["add-item", "update-item", "remove-item", "recover"];
const json = (value: unknown, status = 200, headers?: Headers) =>
  Response.json(value, { status, headers });
function tokenFrom(request: Request) {
  return (
    request.headers
      .get("cookie")
      ?.split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith("iya_cart="))
      ?.slice(9) || ""
  );
}
function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
export async function cartRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const action = url.pathname.replace("/api/cart", "").replace(/^\//, "");
  if (action && !actions.includes(action))
    return json({ message: "Operação inválida" }, 404);
  if (request.method !== (action ? "POST" : "GET"))
    return json({ message: "Método inválido" }, 405);
  if (action && !sameOrigin(request))
    return json({ message: "Origem inválida" }, 403);
  if (action === 'recover') return recoverCart(request);
  let token = tokenFrom(request);
  if (token.length > 4096 || /[^a-zA-Z0-9._-]/.test(token))
    return json({ message: "Sessão inválida" }, 400);
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    Vary: "Cookie",
  });
  try {
    let initialResponse: Response | undefined;
    if (!token) {
      const initial = await fetch(`${STORE}/wp-json/wc/store/v1/cart`, {
        signal: AbortSignal.timeout(12000),
        cache: "no-store",
      });
      if (!initial.ok || !initial.headers.get("Cart-Token"))
        throw new Error("Sessão indisponível");
      token = initial.headers.get("Cart-Token")!;
      initialResponse = initial;
    }
    let body: Record<string, unknown> | undefined;
    if (action) {
      if (Number(request.headers.get("content-length") || 0) > 2048)
        return json({ message: "Pedido inválido" }, 413, headers);
      const raw = await request.text();
      if (raw.length > 2048)
        return json({ message: "Pedido inválido" }, 413, headers);
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (action === "add-item") {
        if (!Number.isSafeInteger(data.id) || Number(data.id) < 1)
          return json({ message: "Produto inválido" }, 400, headers);
        body = { id: data.id, quantity: data.quantity };
      } else {
        if (typeof data.key !== "string" || !/^[a-f0-9]{32}$/.test(data.key))
          return json({ message: "Item inválido" }, 400, headers);
        body = {
          key: data.key,
          ...(action === "update-item" ? { quantity: data.quantity } : {}),
        };
      }
      if (
        action !== "remove-item" &&
        (!Number.isSafeInteger(data.quantity) || Number(data.quantity) < 1)
      )
        return json({ message: "Quantidade inválida" }, 400, headers);
    }
    const response =
      !action && initialResponse
        ? initialResponse
        : await fetch(
            `${STORE}/wp-json/wc/store/v1/cart${action ? "/" + action : ""}`,
            {
              method: action ? "POST" : "GET",
              headers: {
                "Cart-Token": token,
                "Content-Type": "application/json",
              },
              body: body ? JSON.stringify(body) : undefined,
              signal: AbortSignal.timeout(15000),
              cache: "no-store",
            },
          );
    if (response.status === 401 || response.status === 403) {
      return json(
        {
          code: 'session_expired',
          message:
            "Sua sessão expirou. Confira o carrinho e adicione os produtos novamente.",
        },
        409,
        headers,
      );
    }
    const value = await response.json();
    const updated = response.headers.get("Cart-Token") || token;
    const secure = url.protocol === "https:" ? "; Secure" : "";
    headers.append(
      "Set-Cookie",
      `iya_cart=${updated}; Path=/; HttpOnly; SameSite=Lax; Max-Age=172800${secure}`,
    );
    headers.append(
      "Set-Cookie",
      `iya_cart_present=1; Path=/; SameSite=Lax; Max-Age=172800${secure}`,
    );
    return json(value, response.status, headers);
  } catch {
    return json(
      {
        message:
          "Não foi possível consultar a loja. Tente novamente em instantes.",
      },
      503,
      headers,
    );
  }
}
async function recoverCart(request: Request): Promise<Response> {
  const headers = new Headers({ 'Cache-Control': 'private, no-store', Vary: 'Cookie' });
  const origin = new URL(request.url).origin;
  try {
    const raw = await request.text();
    if (raw.length > 16384) return json({ message: 'Solicitação muito grande.' }, 413, headers);
    const { items } = JSON.parse(raw) as { items: { id: number; quantity: number }[] };
    if (!Array.isArray(items) || items.length > 100 || items.some(item => !Number.isSafeInteger(item.id) || item.id < 1 || !Number.isSafeInteger(item.quantity) || item.quantity < 1)) return json({ message: 'Confira os itens para restaurar o carrinho.' }, 400, headers);
    let result = await cartRequest(new Request(`${origin}/api/cart`));
    if (!result.ok) return result;
    let cart = await result.json() as { errors?: { code: string; message: string }[] };
    const cookies = result.headers.getSetCookie();
    cookies.forEach(value => headers.append('Set-Cookie', value));
    const cookie = cookies.map(value => value.split(';')[0]).join('; ');
    const warnings: { code: string; message: string }[] = [];
    for (const item of items) {
      result = await cartRequest(new Request(`${origin}/api/cart/add-item`, { method: 'POST', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, quantity: item.quantity }) }));
      if (result.ok) cart = await result.json() as typeof cart;
      else warnings.push({ code: 'iya_restore_unavailable', message: `Não foi possível restaurar o produto ${item.id} na quantidade anterior. Confira sua disponibilidade no catálogo.` });
    }
    return json({ ...cart, errors: [...(cart.errors || []), ...warnings] }, 200, headers);
  } catch { return json({ message: 'Não foi possível restaurar os itens. Seus dados de recuperação foram preservados.' }, 503, headers); }
}
function checkoutDocument(title: string, body: string, nonce?: string) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Iyá Marlene</title><link rel="icon" href="/favicon.ico"><style>body{font:17px/1.8 system-ui;background:#f7f3eb;color:#1e3327;margin:0;padding:clamp(24px,8vw,100px)}main{max-width:650px;margin:5vh auto;padding:clamp(24px,5vw,48px);background:#eee5d5;border:1px solid #d9d8cb;border-radius:12px}h1{font:normal clamp(30px,5vw,46px)/1.15 Georgia,serif}img{width:140px;height:auto}small{letter-spacing:.16em;text-transform:uppercase;color:#995a38}button{background:#1e3327;color:white;padding:16px 24px;border:0;border-radius:30px;font:inherit;cursor:pointer}a{color:#1e3327}a:focus-visible,button:focus-visible{outline:3px solid #995a38;outline-offset:4px}</style></head><body><main><a href="/"><img src="/logo-iya-marlene.webp" alt="Iyá Marlene" width="533" height="315"></a><h1>${title}</h1>${body}<p><a href="/carrinho">Voltar ao carrinho</a></p></main>${nonce ? `<script nonce="${nonce}">document.forms[0].requestSubmit()</script>` : ''}</body></html>`;
}
export async function checkoutRequest(request: Request) {
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    // no-referrer makes native form POST Origin null; strict-origin preserves
    // the exact CSRF origin without disclosing paths or private query strings.
    "Referrer-Policy": "strict-origin",
    "Content-Type": "text/html; charset=utf-8",
  });
  if (request.method !== "POST" || !sameOrigin(request))
    return new Response("Origem ou método inválido", { status: 403, headers });
  const token = tokenFrom(request);
  if (!token || token.length > 4096 || /[^a-zA-Z0-9._-]/.test(token))
    return new Response(
      checkoutDocument(
        "Carrinho expirado",
        "<p>Volte ao carrinho para conferir seus produtos e tente novamente.</p>",
      ),
      { status: 400, headers },
    );
  // A form POST keeps the bearer token out of URLs, history and referrers.
  let ticket: string;
  try {
    const ready = await fetch(`${STORE}/wp-json/iya/v1/checkout`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (
      !ready.ok ||
      ((await ready.json()) as { version?: number }).version !== 2
    )
      throw new Error("Checkout indisponível");
    const handoff = await fetch(`${STORE}/wp-json/iya/v1/checkout/handoff`, {
      method: 'POST', headers: { 'Cart-Token': token, Origin: new URL(request.url).origin },
      cache: 'no-store', signal: AbortSignal.timeout(12000),
    });
    const data = await handoff.json() as { ticket?: string };
    if (!handoff.ok || typeof data.ticket !== 'string' || !/^[a-f0-9]{64}$/.test(data.ticket)) throw new Error('Checkout indisponível');
    ticket = data.ticket;
  } catch {
    return new Response(
      checkoutDocument(
        "Checkout temporariamente indisponível",
        "<p>Seus produtos continuam no carrinho. Tente novamente mais tarde.</p>",
      ),
      { status: 503, headers },
    );
  }
  const nonce = crypto.randomUUID().replace(/-/g, '');
  headers.set(
    "Content-Security-Policy",
    `default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; form-action ${STORE}; base-uri 'none'; frame-ancestors 'none'`,
  );
  return new Response(
    checkoutDocument(
      "Continue sua compra na loja",
      `<p>Seus produtos serão conferidos novamente. Frete e pagamento são concluídos no ambiente da loja.</p><form method="post" action="${STORE}/wp-admin/admin-post.php"><input type="hidden" name="action" value="iya_checkout"><input type="hidden" name="ticket" value="${ticket}"><button>Ir para o checkout seguro</button></form>`,
      nonce,
    ),
    { headers },
  );
}
