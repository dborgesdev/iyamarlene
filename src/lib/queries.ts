import { createServerFn } from "@tanstack/react-start";
import { catalog, storeGet, type Product } from "./commerce";
export const getCatalog = createServerFn({ method: "GET" }).handler(() =>
  catalog(),
);
export const getFeatured = createServerFn({ method: "GET" }).handler(
  async () =>
    (await storeGet<Product[]>("products?featured=true&per_page=12")).data,
);
export const getProduct = createServerFn({ method: "GET" })
  .validator((slug: string) => {
    if (!slug || slug.length > 200 || /[/?#]/.test(slug))
      throw new Error("Produto inválido");
    return slug;
  })
  .handler(
    async ({ data }) =>
      (await storeGet<Product[]>(`products?slug=${encodeURIComponent(data)}`))
        .data[0] ?? null,
  );
