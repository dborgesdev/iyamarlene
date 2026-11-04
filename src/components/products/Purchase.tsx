import { useState } from "react";
import { useCart } from "../cart/CartProvider";
import type { Product } from "../../lib/commerce";
export function Purchase({
  product,
  detail = false,
}: {
  product: Product;
  detail?: boolean;
}) {
  const { busy, mutate, error } = useCart();
  const [quantity, setQuantity] = useState(product.add_to_cart.minimum || 1);
  const [variation, setVariation] = useState(0);
  const [added, setAdded] = useState(false);
  if (!product.is_in_stock || !product.is_purchasable)
    return <p className="text-muted">Indisponível no momento</p>;
  if (product.type !== "simple" && !(product.type === "variable" && detail))
    return (
      <a className="shop-button" href={`/produto/${product.slug}`}>
        Escolher opções
      </a>
    );
  return (
    <div className="purchase">
      {product.type === "variable" && (
        <label>
          Opções
          <select
            value={variation}
            onChange={(e) => setVariation(Number(e.target.value))}
          >
            <option value={0}>Selecione uma opção</option>
            {product.variations.map((v) => (
              <option value={v.id} key={v.id}>
                {v.attributes.map((a) => `${a.name}: ${a.value}`).join(" / ")}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <label className="quantity-label">
          Quantidade
          <input
            aria-label={`Quantidade de ${product.name}`}
            type="number"
            value={quantity}
            min={product.add_to_cart.minimum || 1}
            max={
              product.sold_individually
                ? 1
                : product.add_to_cart.maximum || undefined
            }
            step={product.add_to_cart.multiple_of || 1}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
              setAdded(false);
            }}
          />
        </label>
        <button
          className="shop-button"
          disabled={
            busy ||
            !Number.isInteger(quantity) ||
            quantity < (product.add_to_cart.minimum || 1) ||
            (product.add_to_cart.maximum > 0 &&
              quantity > product.add_to_cart.maximum) ||
            (product.type === "variable" && !variation)
          }
          onClick={async () => {
            setAdded(
              await mutate("add-item", {
                id: variation || product.id,
                quantity,
              }),
            );
          }}
        >
          {busy ? "Aguarde…" : "Adicionar ao carrinho"}
        </button>
      </div>
      <p className="min-h-6 text-sm" aria-live="polite">
        {added ? (
          <>
            Adicionado.{" "}
            <a className="underline" href="/carrinho">
              Ver carrinho
            </a>
          </>
        ) : (
          error
        )}
      </p>
    </div>
  );
}
