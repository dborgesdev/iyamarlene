# Iyá Marlene

V1 comercial em validação: React 19, TanStack Start/Router, TypeScript, Tailwind 4, WooCommerce Store API e Cloudflare Workers.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm check:deploy
pnpm preview
```

Leia [especificação](docs/project.md), [Cloudflare e rollback](docs/cloudflare.md), [WordPress e checkout](docs/wordpress.md) e [validação](docs/validation-commerce.md).

Não publicar, alterar DNS, instalar plugins remotamente, criar PR ou fazer merge sem autorização expressa. O checkout completo depende da instalação/homologação da ponte WordPress; cache de origem está preparado e inativo. A Vercel anterior permanece contingência. O build desta branch é SSR Workers, sem compatibilidade com o deployment SPA anterior.
