import handler from "@tanstack/react-start/server-entry";
import { cartRequest, checkoutRequest } from "./lib/cart-server";
import { catalog, ORIGIN } from "./lib/commerce";
const staticPaths = [
  "/",
  "/produtos",
  "/politica-de-privacidade",
  "/termos-de-uso",
  "/politica-de-trocas-e-devolucoes",
  "/politica-de-entrega",
];
const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    let response: Response;
    if (url.pathname === "/api/cart" || url.pathname.startsWith("/api/cart/"))
      response = await cartRequest(request);
    else if (url.pathname === "/api/checkout")
      response = await checkoutRequest(request);
    else if (url.pathname === "/robots.txt")
      response = new Response(
        url.hostname === "iyamarlene.com.br"
          ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /carrinho\nSitemap: ${ORIGIN}/sitemap.xml\n`
          : "User-agent: *\nDisallow: /\n",
        { headers: { "Content-Type": "text/plain" } },
      );
    else if (url.pathname === "/sitemap.xml") {
      try {
        const products = await catalog();
        const paths = [
          ...staticPaths,
          ...products.map((p) => `/produto/${encodeURIComponent(p.slug)}`),
        ];
        response = new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${xmlEscape(ORIGIN + p)}</loc></url>`).join("")}</urlset>`,
          {
            headers: {
              "Content-Type": "application/xml",
              "Cache-Control": "public, max-age=300",
            },
          },
        );
      } catch {
        response = new Response("Sitemap temporariamente indisponível", {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        });
      }
    } else response = await handler.fetch(request);
    const secured = new Response(response.body, response);
    secured.headers.set("X-Content-Type-Options", "nosniff");
    secured.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    secured.headers.set("X-Frame-Options", "DENY");
    if (
      response.status === 404 ||
      url.hostname !== "iyamarlene.com.br" ||
      url.pathname === "/carrinho" ||
      url.pathname.startsWith("/api/")
    )
      secured.headers.set("X-Robots-Tag", "noindex, nofollow");
    if (!secured.headers.has("Cache-Control"))
      secured.headers.set("Cache-Control", "no-store");
    return secured;
  },
};
