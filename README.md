# Iyá Marlene

V1 comercial em validação: React 19, TanStack Start/Router, TypeScript, Tailwind 4, WooCommerce Store API e Cloudflare Workers.

Revisão 11/11/2026: identidade oficial, checkout de visitante e ponte v2 com ticket de uso único. Implementação local; Mercado Pago, Melhor Envio, campos brasileiros e SMTP ainda requerem homologação autorizada. Relatório atual em [validação da finalização](docs/validation-finalization.md).

Pacote WordPress: `powershell -File scripts/package-wordpress.ps1`. Saída local: `artifacts/iya-wordpress-install.zip`, com MU-plugins, templates, assets, diagnóstico somente leitura e instruções completas. Não instalar antes da autorização e do backup. Testes PHP isolados em `wordpress/testing`; não entram no pacote.

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
