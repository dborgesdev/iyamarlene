export const ORIGIN = "https://iyamarlene.com.br";
export const STORE = import.meta.env?.VITE_STORE_ORIGIN || "https://loja.iyamarlene.com.br";
export interface Prices {
  price: string;
  currency_code: string;
  currency_minor_unit: number;
  price_range?: { min_amount: string; max_amount: string } | null;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  short_description: string;
  prices: Prices;
  images: {
    id: number;
    src: string;
    thumbnail: string;
    alt: string;
    srcset: string;
    sizes: string;
  }[];
  categories: { id: number; name: string; slug: string }[];
  is_purchasable: boolean;
  is_in_stock: boolean;
  has_options: boolean;
  sold_individually: boolean;
  add_to_cart: { minimum: number; maximum: number; multiple_of: number };
  attributes: {
    id: number;
    name: string;
    taxonomy: string;
    has_variations: boolean;
    terms: { id: number; name: string; slug: string }[];
  }[];
  variations: { id: number; attributes: { name: string; value: string }[] }[];
}
export interface Cart {
  items: {
    key: string;
    id: number;
    name: string;
    quantity: number;
    prices: Prices;
    quantity_limits: { minimum: number; maximum: number; multiple_of: number };
    totals: { line_total: string };
    images: Product["images"];
    variation: { attribute: string; value: string }[];
  }[];
  items_count: number;
  totals: {
    total_items: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  errors: { message: string }[];
}
export const plain = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, code: string) => {
      const point =
        code[0].toLowerCase() === "x"
          ? parseInt(code.slice(1), 16)
          : Number(code);
      return point <= 0x10ffff ? String.fromCodePoint(point) : "";
    })
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
export function money(prices: Prices, amount = prices.price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: prices.currency_code,
  }).format(Number(amount) / 10 ** prices.currency_minor_unit);
}
export async function storeGet<T>(
  path: string,
): Promise<{ data: T; pages: number }> {
  const response = await fetch(`${STORE}/wp-json/wc/store/v1/${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
    cache: "no-store",
    credentials: "omit",
  });
  if (!response.ok)
    throw new Error(
      "A loja está temporariamente indisponível. Tente novamente.",
    );
  const data = (await response.json()) as T;
  if (Array.isArray(data))
    for (const item of data)
      if (item && typeof item.name === "string") item.name = plain(item.name);
  return { data, pages: Number(response.headers.get("X-WP-TotalPages") || 1) };
}
export async function catalog() {
  const first = await storeGet<Product[]>("products?per_page=100&page=1");
  const products = [...first.data];
  for (let page = 2; page <= first.pages; page++)
    products.push(
      ...(await storeGet<Product[]>(`products?per_page=100&page=${page}`)).data,
    );
  return products;
}
