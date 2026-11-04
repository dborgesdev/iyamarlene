import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCart } from "../components/cart/CartProvider";
import { money } from "../lib/commerce";
import { seo } from "../lib/seo";
export const Route = createFileRoute("/carrinho")({
  head: () => ({
    ...seo(
      "Seu carrinho",
      "Confira os produtos selecionados e continue para o checkout seguro da loja.",
      "/carrinho",
    ),
    meta: [
      { title: "Seu carrinho | Iyá Marlene" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CartPage,
});
function CartPage() {
  const { cart, busy, error, refresh, mutate } = useCart();
  useEffect(() => {
    void refresh();
  }, []);
  return (
    <div className="commerce-page container-site py-14">
      <p className="eyebrow">Suas escolhas</p>
      <h1 className="section-title my-6">Seu carrinho</h1>
      <div aria-live="polite" role="status">
        {error}
      </div>
      {!cart ? (
        <div className="shop-empty">
          <p>Carregando seu carrinho…</p>
          {error && (
            <button className="shop-button" onClick={() => void refresh()}>
              Tentar novamente
            </button>
          )}
        </div>
      ) : cart.items.length === 0 ? (
        <div className="shop-empty">
          <h2 className="serif text-3xl">Seu carrinho está vazio</h2>
          <a href="/produtos" className="shop-button">
            Explorar produtos
          </a>
        </div>
      ) : (
        <>
          <div className="cart-layout">
            <div>
              {cart.items.map((item) => (
                <article key={item.key} className="cart-item">
                  {item.images[0] && (
                    <img
                      src={item.images[0].thumbnail || item.images[0].src}
                      width={100}
                      height={100}
                      alt={item.name}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="serif text-2xl">{item.name}</h2>
                    <p>
                      {item.variation
                        .map((v) => `${v.attribute}: ${v.value}`)
                        .join(" / ")}
                    </p>
                    <p className="my-3">
                      {money(item.prices, item.totals.line_total)}
                    </p>
                    <div className="flex flex-wrap gap-4 items-end">
                      <label className="quantity-label">
                        Quantidade
                        <input
                          disabled={busy}
                          type="number"
                          min={item.quantity_limits.minimum}
                          max={item.quantity_limits.maximum || undefined}
                          step={item.quantity_limits.multiple_of}
                          value={item.quantity}
                          onChange={(e) => {
                            const quantity = Number(e.target.value);
                            if (
                              Number.isInteger(quantity) &&
                              quantity >= item.quantity_limits.minimum &&
                              (!item.quantity_limits.maximum ||
                                quantity <= item.quantity_limits.maximum)
                            )
                              void mutate("update-item", {
                                key: item.key,
                                quantity,
                              });
                          }}
                        />
                      </label>
                      <button
                        disabled={busy}
                        className="underline min-h-11"
                        onClick={() =>
                          void mutate("remove-item", { key: item.key })
                        }
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2 className="serif text-3xl mb-6">Resumo</h2>
              <div className="flex justify-between gap-3">
                <span>Subtotal dos produtos</span>
                <strong>
                  {money({ ...cart.totals, price: cart.totals.total_items })}
                </strong>
              </div>
              <p className="my-6 text-sm leading-7 text-muted">
                Frete, descontos e total final serão calculados pela loja.
                Preços e estoque serão conferidos novamente.
              </p>
              <form method="post" action="/api/checkout">
                <button disabled={busy} className="shop-button w-full">
                  Continuar para o checkout ↗
                </button>
              </form>
              <a href="/produtos" className="block mt-5 underline text-sm">
                Continuar comprando
              </a>
            </aside>
          </div>
          {cart.errors?.map((e, i) => (
            <p role="alert" key={i}>
              {e.message}
            </p>
          ))}
        </>
      )}
    </div>
  );
}
