import { money, type Product } from "../../lib/commerce";
import { Purchase } from "./Purchase";
export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <article className="product-card">
      <a href={`/produto/${product.slug}`} className="product-image">
        {image ? (
          <img
            src={image.thumbnail || image.src}
            srcSet={image.srcset}
            sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 360px"
            alt={image.alt || product.name}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span>Imagem não disponível</span>
        )}
      </a>
      <div className="p-5">
        <p className="eyebrow mb-3">
          {product.categories.map((c) => c.name).join(" · ")}
        </p>
        <h3 className="serif text-2xl">
          <a href={`/produto/${product.slug}`}>{product.name}</a>
        </h3>
        <p className="my-3 text-lg font-semibold">
          {product.prices.price_range
            ? `A partir de ${money(product.prices, product.prices.price_range.min_amount)}`
            : money(product.prices)}
        </p>
        <p className="mb-4 text-sm text-muted">
          {product.is_in_stock ? "Disponível" : "Sem estoque"}
        </p>
        <Purchase product={product} />
      </div>
    </article>
  );
}
