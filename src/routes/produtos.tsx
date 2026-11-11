import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getCatalog } from "../lib/queries";
import { plain } from "../lib/commerce";
import { seo } from "../lib/seo";
import { ProductCard } from "../components/products/ProductCard";
export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): { categoria?: string } => ({ categoria: typeof search.categoria === 'string' && /^[a-z0-9-]{1,200}$/.test(search.categoria) ? search.categoria : undefined }),
  loader: () => getCatalog(),
  head: () =>
    seo(
      "Produtos",
      "Explore os produtos de Iyá Marlene. Consulte preços, opções e disponibilidade na loja.",
      "/produtos",
    ),
  component: Catalog,
});
function Catalog() {
  const products = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const { categoria } = Route.useSearch();
  const [category, setCategory] = useState(categoria || '');
  const [sort, setSort] = useState("default");
  const [limit, setLimit] = useState(12);
  const categories = [
    ...new Map(
      products.flatMap((p) => p.categories).map((c) => [c.slug, c]),
    ).values(),
  ];
  const filtered = useMemo(() => {
    const normal = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR");
    const result = products.filter(
      (p) =>
        (!category || p.categories.some((c) => c.slug === category)) &&
        normal(
          `${p.name} ${plain(p.short_description)} ${plain(p.description)}`,
        ).includes(normal(search)),
    );
    if (sort === "name")
      result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "asc" || sort === "desc")
      result.sort(
        (a, b) =>
          (Number(a.prices.price) / 10 ** a.prices.currency_minor_unit -
            Number(b.prices.price) / 10 ** b.prices.currency_minor_unit) *
          (sort === "asc" ? 1 : -1),
      );
    return result;
  }, [products, search, category, sort]);
  return (
    <div className="commerce-page">
      <div className="internal-hero">
        <div className="container-site">
          <p className="eyebrow">A loja de Iyá Marlene</p>
          <h1 className="section-title mt-5">
            Natureza, cuidado
            <br />e intenção.
          </h1>
          <p className="mt-6 max-w-xl leading-8 text-muted">
            Conheça os produtos da loja. Encontre os detalhes de cada item e
            escolha com tranquilidade.
          </p>
        </div>
      </div>
      <div className="container-site py-12">
        <div className="catalog-controls">
          <label>
            Buscar produtos
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLimit(12);
              }}
              placeholder="O que você procura?"
            />
          </label>
          <label>
            Categoria
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setLimit(12);
              }}
            >
              <option value="">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ordenar por
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Padrão</option>
              <option value="name">Nome</option>
              <option value="asc">Menor preço</option>
              <option value="desc">Maior preço</option>
            </select>
          </label>
        </div>
        <p className="my-7 text-sm text-muted" aria-live="polite">
          {filtered.length} produtos encontrados
        </p>
        <div className="product-grid">
          {filtered.slice(0, limit).map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
        {!filtered.length && (
          <div className="shop-empty">
            <h2 className="serif text-3xl">Nenhum produto encontrado</h2>
            <p>Tente outra busca ou categoria.</p>
            <button
              className="shop-button"
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
        {limit < filtered.length && (
          <button
            className="shop-button mt-8"
            onClick={() => setLimit(limit + 12)}
          >
            Mostrar mais produtos
          </button>
        )}
      </div>
    </div>
  );
}
