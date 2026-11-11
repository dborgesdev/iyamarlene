import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Header } from "../components/sections/Header";
import { Footer } from "../components/sections/Footer";
import { WhatsAppFloat } from "../components/ui/WhatsAppFloat";
import { CartProvider } from "../components/cart/CartProvider";
import "../index.css";
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: "Iyá Marlene" },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#f7f3eb" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: '180x180' },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap",
      },
    ],
  }),
  component: Root,
  notFoundComponent: () => (
    <div className="commerce-page container-site">
      <p className="eyebrow">404</p>
      <h1 className="section-title">Página não encontrada</h1>
      <a className="shop-button" href="/produtos">
        Conhecer os produtos
      </a>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="commerce-page container-site" role="alert">
      <h1 className="section-title">Não foi possível carregar esta página</h1>
      <p>Tente novamente em instantes.</p>
      <button className="shop-button" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  ),
});
function Root() {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <CartProvider>
          <a href="#conteudo" className="sr-only focus:not-sr-only">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo" tabIndex={-1}>
            <Outlet />
          </main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
        <Scripts />
      </body>
    </html>
  );
}
