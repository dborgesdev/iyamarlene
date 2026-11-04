import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct } from "../lib/queries";
import { money, ORIGIN, plain } from "../lib/commerce";
import { seo } from "../lib/seo";
import { Purchase } from "../components/products/Purchase";
export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await getProduct({ data: params.slug });
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData: p }) =>
    p
      ? seo(
          p.name,
          plain(p.short_description || p.description).slice(0, 160),
          `/produto/${p.slug}`,
          p.images[0]?.src,
        )
      : seo(
          "Produto não encontrado",
          "Este produto não está disponível.",
          "/produtos",
        ),
  component: Detail,
});
function Detail() {
  const p = Route.useLoaderData();
  const [selected, setSelected] = useState(0);
  const image = p.images[selected] || p.images[0];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: plain(p.description),
    image: p.images.map((i) => i.src),
    url: `${ORIGIN}/produto/${p.slug}`,
    ...(p.type === "simple" && p.prices.price
      ? {
          offers: {
            "@type": "Offer",
            price: Number(p.prices.price) / 10 ** p.prices.currency_minor_unit,
            priceCurrency: p.prices.currency_code,
            availability: `https://schema.org/${p.is_in_stock ? "InStock" : "OutOfStock"}`,
            url: `${ORIGIN}/produto/${p.slug}`,
          },
        }
      : {}),
  };
  return (
    <div className="commerce-page container-site py-12">
      <nav aria-label="Breadcrumb" className="mb-9 text-sm">
        <a href="/">Início</a> / <a href="/produtos">Produtos</a> /{" "}
        <span aria-current="page">{p.name}</span>
      </nav>
      <div className="product-detail">
        <div>
          <div className="detail-image">
            {image ? (
              <img
                src={image.src}
                srcSet={image.srcset}
                sizes="(max-width: 768px) 90vw, 560px"
                width={800}
                height={800}
                alt={image.alt || p.name}
                fetchPriority="high"
              />
            ) : (
              <p>Imagem não disponível</p>
            )}
          </div>
          {p.images.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {p.images.map((img, i) => (
                <button
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-pressed={selected === i}
                  key={img.id}
                  onClick={() => setSelected(i)}
                >
                  <img
                    src={img.thumbnail || img.src}
                    alt=""
                    width={72}
                    height={72}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="py-5">
          <p className="eyebrow mb-5">
            {p.categories.map((c) => c.name).join(" · ")}
          </p>
          <h1 className="section-title">{p.name}</h1>
          <p className="serif my-7 text-3xl">
            {p.prices.price_range
              ? `A partir de ${money(p.prices, p.prices.price_range.min_amount)}`
              : money(p.prices)}
          </p>
          <p className="leading-8 text-muted mb-6">
            {plain(p.short_description)}
          </p>
          <p className="mb-6 text-sm">
            {p.is_in_stock
              ? "Disponível para compra"
              : "Sem estoque no momento"}
          </p>
          <Purchase product={p} detail />
          <p className="mt-6 text-sm text-muted">
            Frete e condições de pagamento são apresentados no checkout da loja.
          </p>
        </div>
      </div>
      <section className="border-t border-line mt-12 py-10">
        <h2 className="serif text-3xl mb-5">Sobre este produto</h2>
        <p className="whitespace-pre-line max-w-3xl leading-8 text-muted">
          {plain(p.description)}
        </p>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Início",
                item: ORIGIN,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Produtos",
                item: ORIGIN + "/produtos",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: p.name,
                item: ORIGIN + "/produto/" + p.slug,
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
