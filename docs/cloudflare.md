# Cloudflare — operação local e migração futura

## Preparação

Use Node compatível com Vite 8 e Wrangler (ambiente observado: v22.16.0) e pnpm 10.18.3 conforme packageManager. `pnpm install --frozen-lockfile`. Sem variáveis ou segredos necessários: domínios públicos fixos em src/lib/commerce.ts. Não adicionar chaves WooCommerce ao navegador. Arquivos .dev.vars e env locais são ignorados.

- `pnpm dev`: Vite com runtime Workers local.
- `pnpm typecheck`: TypeScript, após geração inicial das rotas por dev/build.
- `pnpm test`: testes isolados de moeda, paginação, origem, proxy e tokens.
- `pnpm build`: build cliente/servidor seguido de typecheck.
- `pnpm preview --host 127.0.0.1`: preview local do build no runtime Cloudflare.
- `pnpm check:deploy`: confere artefato Worker e assets sem acessar conta ou publicar.
- `pnpm run deploy`: build seguido de publicação no Worker. Execução autorizada explicitamente em 04/11/2026.

Vite pode selecionar outra porta se a padrão estiver ocupada. Leia o endereço informado. Não usar --host 0.0.0.0 sem necessidade. O deploy do Worker foi autorizado em 04/11/2026. DNS, custom domains e instalação remota WordPress continuam fora desta etapa.

## Configuração e artefatos

wrangler.jsonc usa nome obrigatório iyamarlene, src/server.ts, compatibility_date 2026-11-04 e nodejs_compat conforme documentação oficial. O plugin gera dist/server/wrangler.json, main index.js e assets ../client; não duplicar manualmente bindings gerados. workers_dev=true para o endereço público de validação do Worker; preview_urls=false. Sem KV, Redis, D1, filas, cron ou infraestrutura adicional. Logs ativados, mas o código não registra corpos, cookies, tokens nem dados pessoais.

Headers de documentos/API são gerados no Worker. Produtos/catalogo sem cache intermediário; carrinho e handoff sempre private/no-store. Sitemap max-age=300. Assets são servidos pelo binding, arquivos versionados pelo hash do build. Robots e sitemap não podem voltar ao diretório public, pois esconderiam os handlers dinâmicos.

## Publicação e DNS — somente após autorização expressa

1. Aprovar identidade/conteúdo/legal e concluir homologação WordPress descrita em docs/wordpress.md. Corrigir qualquer erro crítico antes de migrar tráfego.
2. Registrar o deployment Vercel atual, a versão/commit anterior e todos os registros DNS relevantes (tipo, nome, destino, proxy, TTL). Não presumir destinos a partir de exemplos. Preservar especialmente loja, MX, SPF, DKIM e DMARC.
3. Confirmar que a zona do domínio principal está na conta Cloudflare adequada e que o operador possui permissão. Esta etapa não foi executada.
4. Após aprovação, configurar custom domain com `routes: [{ pattern: "iyamarlene.com.br", custom_domain: true }]`. Esse bloco foi deliberadamente mantido fora da configuração ativa para evitar vinculação acidental.
5. Publicar o Worker iyamarlene e configurar o domínio pela conta autorizada. Não criar Worker com outro nome. Decidir redirecionamento do www apenas depois de auditar seu estado real.
6. Verificar HTTPS, Home, catálogo, produto/404, sitemap/robots, conta, carrinho, ponte e checkout no domínio final. Garantir que loja.iyamarlene.com.br continue apontando ao WordPress.
7. Confirmar noindex em ambientes secundários e canonicals no domínio principal. Sincronizar políticas e SEO de duplicatas no WordPress sem bloquear API/checkout.

## Rollback

Preservar o projeto e deployment anterior na Vercel. Em falha, retirar a vinculação/rota do Worker e restaurar exatamente os registros DNS registrados antes da mudança; aguardar TTL e conferir HTTPS. Não excluir WordPress, pedidos ou a Vercel. O build desta branch é SSR Workers e **não deve ser enviado à configuração Vercel SPA antiga**. Para contingência usar o deployment anterior ou a revisão institucional anterior, não tentar servir dist/client como SPA comercial. vercel.json mantém a configuração anterior com ignoreCommand="exit 0", para impedir que o merge publique o build SSR como SPA na Vercel. O deployment Vercel existente é preservado; nenhum novo deploy Vercel é necessário.

## Diagnóstico

503 no catálogo/API: verificar resposta anônima da Store API e conectividade; não expor erros internos ao cliente. Sessão expirada: voltar ao carrinho e revalidar; não cachear nem copiar tokens para logs. 404 de produto: confirmar slug e publicação no WooCommerce. Handoff inexistente/negado: confirmar instalação da ponte e allowlist exata da origem; nunca liberar `*`. Divergência de preço/estoque: comparar origem, cache interno e invalidação. Falhas de pagamento/frete devem ser diagnosticadas no WooCommerce em modo seguro, sem cobrança real. Mudanças em plugins exigem nova homologação.

Documentação oficial consultada em 04/11/2026:
- https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/
- https://tanstack.com/start/latest/docs/framework/react/build-from-scratch
- https://developer.woocommerce.com/docs/apis/store-api/cart-tokens
- https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/cart/
