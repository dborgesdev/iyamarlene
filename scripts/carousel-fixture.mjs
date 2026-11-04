// Local-only harness: real ProductCard markup/CSS and the production carousel controller.
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const files = [
  "components/products/ProductCard.tsx",
  "components/products/Purchase.tsx",
  "components/cart/CartProvider.tsx",
  "lib/commerce.ts",
  "lib/carousel.ts",
];
for (const file of files) {
  const destination = resolve(
    ".test-output/carousel-fixture",
    file.replace(/\.tsx?$/, ".mjs"),
  );
  await mkdir(dirname(destination), { recursive: true });
  const result = ts
    .transpileModule(await readFile(`src/${file}`, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    })
    .outputText.replace(/(from\s+["'])(\.[^"']+)(["'])/g, "$1$2.mjs$3");
  await writeFile(destination, result);
}
const { ProductCard } = await import(
  pathToFileURL(
    resolve(
      ".test-output/carousel-fixture/components/products/ProductCard.mjs",
    ),
  )
);
const { CartProvider } = await import(
  pathToFileURL(
    resolve(".test-output/carousel-fixture/components/cart/CartProvider.mjs"),
  )
);
const stylesheet = (await readdir("dist/client/assets")).find((name) =>
  name.endsWith(".css"),
);
const controller = await readFile(
  ".test-output/carousel-fixture/lib/carousel.mjs",
);

createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/controller.mjs") {
    response.setHeader("Content-Type", "text/javascript");
    return response.end(controller);
  }
  if (url.pathname === "/style.css") {
    response.setHeader("Content-Type", "text/css");
    return response.end(await readFile(`dist/client/assets/${stylesheet}`));
  }
  if (url.pathname !== "/") {
    response.writeHead(404);
    return response.end();
  }
  const count = Math.max(
    1,
    Math.min(10, Number(url.searchParams.get("count")) || 7),
  );
  const cards = renderToStaticMarkup(
    createElement(
      CartProvider,
      null,
      Array.from({ length: count }, (_, index) =>
        createElement(ProductCard, {
          key: index,
          product: {
            id: index + 1,
            slug: `fixture-${index + 1}`,
            name: `Produto de teste ${index + 1}`,
            categories: [{ name: "Fixture local", id: 1, slug: "fixture" }],
            images: [],
            prices: {
              price: "1890",
              currency_code: "BRL",
              currency_minor_unit: 2,
            },
            is_in_stock: true,
            is_purchasable: true,
            type: "simple",
            add_to_cart: { minimum: 1, maximum: 5, multiple_of: 1 },
          },
        }),
      ),
    ),
  );
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fixture local — carrossel</title><link rel="stylesheet" href="/style.css"><main class="container-site py-12"><h1>Validação local · ${count} produtos de teste</h1><div class="flex gap-2"><button class="carousel-arrow" id="prev" aria-label="Produtos anteriores">←</button><button class="carousel-arrow" id="next" aria-label="Próximos produtos">→</button></div><div id="track" class="product-carousel" tabindex="0" aria-label="Produtos de teste">${cards}</div><div class="carousel-progress" role="progressbar" aria-label="Progresso" aria-valuemin="0" aria-valuemax="100"><span></span></div><output aria-label="Posição"></output></main><script type="module">
    import { connectCarousel } from '/controller.mjs';
    const track = document.querySelector('#track');
    const previous = document.querySelector('#prev');
    const next = document.querySelector('#next');
    const progress = document.querySelector('[role=progressbar]');
    const controller = connectCarousel(track, state => {
      previous.disabled = state.start; next.disabled = state.end;
      progress.setAttribute('aria-valuenow', Math.round(state.progress * 100));
      progress.firstElementChild.style.transform = 'scaleX(' + state.progress + ')';
      document.querySelector('output').textContent = Math.round(track.scrollLeft * 100) / 100;
    });
    previous.onclick = () => controller.move(-1); next.onclick = () => controller.move(1);
  </script></html>`);
}).listen(53488, "127.0.0.1", () =>
  console.log(
    "Carousel fixture: http://127.0.0.1:53488/?count=7 (local only, no WooCommerce writes)",
  ),
);
