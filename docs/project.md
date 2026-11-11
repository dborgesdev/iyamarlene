# Iyá Marlene — especificação e estado da V1 comercial

## Objetivo e autorização

Evoluir o institucional aprovado para e-commerce headless com React 19, TypeScript, TanStack Start/Router, Tailwind 4 e Cloudflare Workers. Branch: `feat/woocommerce-ssr-cloudflare`. Implementação, configuração local, documentação e testes seguros autorizados. Não executar deploy, upload de versões, DNS, custom domains, instalação remota WordPress, commit, push, PR ou merge sem solicitação explícita. A Vercel publicada continua funcionando; nenhum serviço remoto foi alterado.

O pedido explícito de migração substitui a regra anterior de entrega exclusivamente SPA/Vercel. A especificação institucional integral está em `docs/legacy/project-institucional.md`, preservada como fonte de conteúdo aprovado.

## Informações confirmadas

- Nome: Iyá Marlene / Yalorixá Marlene. WhatsApp: +55 11 94706-9990. Instagram: https://www.instagram.com/yalorixa.marlene/.
- Domínio principal: https://iyamarlene.com.br. WordPress: https://loja.iyamarlene.com.br. Contingência: https://iyamarlene.vercel.app.
- Serviços: cartas, búzios, trabalhos espirituais e Limpeza de Ambientes. Copy integral em `src/data/site.ts`.
- Online e presencial: segunda, quinta, sexta, sábado e domingo, a partir das 16h. Agendamento e disponibilidade pelo WhatsApp; cidade/endereço e duração não informados.
- Biografia autorizada preservada em `src/data/site.ts`: início na Umbanda, experiência aos 15 anos com Seu Tranca Ruas, iniciação no Candomblé e sacerdócio como Yalorixá, trajetória que reúne Jurema e Ifá. Não acrescentar linhagens, títulos, datas ou resultados.
- Retrato real: `public/images/iya-marlene.jpg`, exclusivamente na seção Sobre, 1080×1350. Outros assets institucionais são conceituais, sem alegar registros reais.
- Crédito obrigatório preservado: **Desenvolvido por Douglas Borges - Smart Local**, https://smartlocal.com.br, nova aba, noopener noreferrer.

## Auditoria inicial — 04/11/2026

Árvore limpa no início, branch inicial `main`; criada a branch solicitada antes de editar. Projeto inicial: Vite SPA, React 19, TS 5.8, Tailwind 4, Lucide, pnpm 10.18.3. Sem testes/lint configurados. `App` compunha seções; navegação por âncoras; SEO estático em index.html, robots/sitemap públicos; Vercel com dist estático. Nenhuma credencial era necessária. Tokens botânicos e terrosos, DM Sans/DM Serif Display, imagens/texturas e WhatsApp mantidos.

Consultas públicas reais confirmaram Store API com seis produtos, quatro categorias, preços BRL em centavos, imagens completas, srcset/sizes, estoque, limites mínimo/máximo/múltiplo, produtos simples no catálogo observado. A resposta não fornece dimensões intrínsecas das imagens; caixas de proporção fixa reservam espaço sem inferir dimensões do arquivo. Não há consultas a media IDs nem dependência ACF.

`/minha-conta/` respondeu 200 com formulários nativos de login e cadastro. Links nativos apontam para `/finalizar-compra/` e `/carrinho/`. `/checkout/` respondeu 404. Assets públicos indicam WordPress 7.1.4 e WooCommerce 11.2.1; são indícios públicos, não auditoria administrativa. Versões PHP/WP REST Cache, plugins financeiros, SMTP, impostos e operação não foram confirmados. Domínios e DNS atuais não foram modificados nem auditados no painel.

Documentação oficial consultada: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/ e https://tanstack.com/start/latest/docs/framework/react/build-from-scratch . O TanStack Start instalado exige Vite >=8, motivando a atualização de Vite e plugin React. Sem adaptadores Nitro ou infraestrutura extra. Versões exatas resolvidas em pnpm-lock.yaml.

## Stack e estrutura

- `src/router.tsx`, `src/routes/*`: rotas e loaders TanStack, SSR e code splitting.
- `src/routes/__root.tsx`: documento, HeadContent/Scripts, layout compartilhado e provider de carrinho.
- `src/App.tsx`: apenas composição das seções da Home.
- `src/components/sections`: Home aprovada, Header/Footer adaptados.
- `src/components/products`: cards, compra e destaques com IntersectionObserver.
- `src/components/cart`: estado de carrinho; sem preços/estoque autoritativos em localStorage.
- `src/lib/commerce.ts`, `queries.ts`: contrato observado, Store API e server functions. `cart-server.ts`: transporte privado. `seo.ts`: metadados.
- `src/data/site.ts` e `legal.ts`: conteúdo/links separados da UI.
- `src/server.ts`: entrada do Worker, API restrita, robots e sitemap dinâmicos, headers.
- `wordpress/`: artefatos locais para instalação futura autorizada.
- `tests`, `scripts`: testes e conferência local de artefatos. Não há lint inventado.

O arquivo routeTree.gen.ts é gerado pelo plugin. Build gera dist/client (assets) e dist/server (Worker/config final). O plugin configura o binding de assets. Nome do Worker: `iyamarlene`. nodejs_compat segue a integração oficial. Compatibility date: 2026-11-04. workers.dev habilitado após autorização explícita de deploy; previews remotos desativados; sem rotas/custom domains ativos na configuração.

## Jornada, identidade e movimento

Home: Hero → Serviços → Produtos destacados → Sobre → Modalidades/horários → CTA → Footer. Hero, serviços, biografia, retrato e copy aprovados mantidos. A seção estática de produtos foi substituída conforme o pedido. Paleta #f7f3eb/#1e3327/#995a38, tipos e texturas preservados. Páginas internas usam hero botânico, cards claros, bordas discretas e controles consistentes.

Carrossel com scroll snap/toque, setas, início/fim, foco e rolagem suave; sem autoplay. Skeletons reservam altura. Hover sutil de imagem e transições curtas sinalizam interação. Reduced motion remove escala/transição e usa scroll instantâneo. Header mantém WhatsApp e navegação da Home por /#âncora em páginas internas. Carrinho presente em desktop/mobile; Minha conta removido, compra de visitante. Footer inclui quatro políticas e crédito exato.

## WooCommerce, catálogo e cache

Fonte pública: /wp-json/wc/store/v1/products e /products/categories. Store API sem credenciais, cookies ou tokens nas consultas públicas. Timeout explícito; falhas não bloqueiam Home. Destaques carregam quando a seção se aproxima em 500px, até 12 itens destacados. Sem destaques (ou em falha da consulta), reapresentar a composição institucional anterior com imagem estática, texto e botão Ver todos os produtos para /produtos; não inventar destaque.

Catálogo atual pequeno: paginação integral por páginas de 100, sem truncar produtos. Busca textual, categorias derivadas dos próprios produtos, ordenação e apresentação incremental de 12 itens ocorrem localmente sem consultas por interação. Produto consulta diretamente por slug, sem catálogo completo; novo produto funciona sem rebuild e ausência gera 404. Não há cache persistente adicional no Worker; preço e estoque sempre revalidados nas operações comerciais. Crescimento: quando a aquisição consolidada deixar de ser adequada, migrar a rota de catálogo para parâmetros Store API page/search/category/orderby, mantendo produto por slug; não aumentar indefinidamente o volume inicial.

Sitemap dinâmico consulta catálogo público, inclui rotas institucionais/legais e slugs atuais, com max-age=300 no transporte para reduzir consultas repetidas de crawlers; não usa KV/cron. Retorna 503 sem armazenar falhas. Remoções refletem na próxima geração (até cinco minutos em consumidores que respeitem o cache). Produtos não têm cache imutável.

Cache persistente de origem: artefato adaptado em `wordpress/000-iya-store-api-cache.php`, **inativo por padrão**. Requer auditoria real e constante IYA_PUBLIC_CATALOG_CACHE_APPROVED antes de habilitar. Produtos/categorias apenas, bypass de cookies/auth/nonce/Cart-Token, invalidação estrita e parametrizada no shutdown. Não há prova de HIT/invalidação nesta loja. Instalação/homologação pendente, ver docs/wordpress.md.

## Carrinho e checkout — revisão 11/11/2026

React usa /api/cart e ações fixas add-item/update-item/remove-item/recover. Cookie HttpOnly, SameSite=Lax, Secure em HTTPS; origem exata, IDs/quantidades e tamanhos limitados. Preços/estoque/totais vêm do WooCommerce. Rascunho local contém somente IDs e quantidades para recuperação explícita de sessão expirada. Foco/retorno à página revalidam o estado.

Ponte versão 2: o Worker envia Cart-Token exclusivamente servidor→servidor. O WordPress valida JWT nativo e lê a sessão Store API; emite ticket aleatório de uso único/120s, vinculado à origem e impressão dos itens/cupons. Somente esse ticket passa por POST ao admin-post. Revalida produtos/variações/quantidades/estoque/cupons, recalcula preços, persiste a sessão nativa e restaura o carrinho anterior em falha. Hooks de pagamento confirmado reconciliam a origem com comparação atômica do valor persistido; novos itens não são apagados por pedido antigo. Não cria pedidos ou processa pagamentos por conta própria.

010-iya-checkout.php carrega a ponte; 020-iya-storefront.php carrega apresentação, compra de visitante e redirects públicos restritos. O shell preserva formulários/blocos/hooks/scripts nativos, endpoints de pagamento e estados reais. Implementação e testes PHP locais não substituem homologação financeira/logística. Pacote completo e rollback em docs/wordpress.md.

**Pendente externamente:** instalação autorizada em homologação, HTTPS/SameSite entre domínios reais, Mercado Pago/Pix/cartão/webhooks, Melhor Envio/campos brasileiros/transportabilidade, SMTP/estoque/pedidos de teste e aprovação das políticas/dados comerciais. Nenhum pedido ou pagamento remoto foi criado. Não liberar pagamentos reais antes desses testes.

## SEO e segurança

Titles/descriptions/canonical/OG/Twitter renderizados no servidor. Canonical sempre domínio principal. Product/Offer e BreadcrumbList usam dados reais; sem avaliações inventadas. WebSite preservado no documento da Home. Robots dinâmico bloqueia ambientes secundários; X-Robots-Tag noindex em qualquer host diferente do principal e em carrinho/API. HTML WooCommerce convertido para texto seguro, sem inserir HTML de produto via dangerouslySetInnerHTML. JSON-LD escapa `<`.

Headers nos documentos/API: nosniff, X-Frame-Options DENY, Referrer-Policy; respostas sem cache por padrão. Sem CORS amplo no Worker. Não existem segredos/env obrigatórios: origens públicas fixas em commerce.ts. Não são enviados tokens ou dados pessoais a logs. Rotas de erro e 404 tratadas. No WordPress, ainda configurar canonical/noindex de produtos/categorias duplicadas e políticas coerentes no checkout, com redirects públicos específicos e preservação de Store API, assets e pagamentos.

## Políticas para revisão

Quatro páginas legais prontas como texto-base, explicitamente sem aprovação jurídica. Consideram compras físicas, direitos de arrependimento, LGPD, provedores previstos e contato confirmado. Não inventam CNPJ, razão social, endereço, e-mail, frete, postagem, garantias ou regras comerciais. Bases consultadas: CDC art.49 (https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm) e ANPD (https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares). Revisar identidade do controlador, retenção, fornecedores efetivamente ativos, endereço de devolução e condições comerciais antes de sincronizar WordPress/React e publicar.

## Validação, deploy e pendências

Comandos: pnpm install --frozen-lockfile; pnpm dev; pnpm typecheck; pnpm test; pnpm build; pnpm preview; pnpm check:deploy. Deploy existe somente para execução futura expressamente autorizada. Guia: docs/cloudflare.md. Resultados reais e limites: docs/validation-commerce.md.

Critérios de aceite: Home preservada e independente da API; catálogo real; produto SSR/404; compra e sessão corretas; checkout nativo com itens; SEO/sitemap; responsividade, teclado e reduced motion; cache homologado na origem; build/preview Cloudflare aprovados. A validação de publicação depende também das pendências externas, dados legais e homologação comercial. Não declarar essas etapas concluídas a partir do build.
Destaques na origem: a consulta real featured=true retornou zero itens; Home restaura a apresentação institucional anterior com imagem estática, texto e botão para /produtos, conforme ajuste solicitado. A seleção de destaques deve ser feita no WooCommerce após autorização editorial, sem presumir que todos os produtos sejam destacados.

## Autorização de entrega — 04/11/2026

O contratante autorizou explicitamente commit, push, PR, merge e deploy no Worker iyamarlene. A publicação usa workers.dev com noindex, preservando o domínio principal/DNS e o deployment Vercel existente. vercel.json recebe ignoreCommand=exit 0 para evitar publicação automática incompatível na Vercel após o merge. As pendências WordPress/comerciais/legais permanecem documentadas e não são consideradas homologadas por esse deploy.

## Identidade e entrega local — 11/11/2026

Header/Footer usam public/logo-iya-marlene.webp oficial, sem redesenho. Minha conta removido; carrinho e WhatsApp preservados. public/og-image.jpg 1200×630 foi criado conforme mockup por solicitação expressa, com metadados absolutos, dimensões e texto alternativo; produtos mantêm suas próprias imagens. Favicon oficial e derivados para Apple/manifest presentes. Políticas seguem como base para aprovação, ajustadas à compra de visitante sem dados empresariais inventados.

Relatório vigente: docs/validation-finalization.md. A autorização de publicação de 04/11 foi executada na revisão anterior e não autoriza esta entrega. Nesta revisão não houve publicação, alteração remota WordPress, DNS ou cobrança. Não considerar homologação financeira/logística a partir de testes locais. Pacote preparado em artifacts/iya-wordpress-install.zip, sem fixtures/credenciais; instalar apenas em homologação autorizada, com backup e rollback descritos em docs/wordpress.md.
## Publicação autorizada — 11/11/2026

Após a entrega e apresentação dos bloqueios comerciais, o contratante solicitou expressamente commit, push, PR, merge e deploy desta revisão. Autoriza publicação do frontend no Worker iyamarlene em workers.dev; não inclui DNS/custom domain, instalação remota WordPress, mudança de credenciais financeiras ou cobranças. Vercel preservada. Os registros anteriores de ausência de publicação descrevem a fase local; os bloqueios financeiros/logísticos permanecem, e checkout continua fechado quando a ponte v2 está ausente.
