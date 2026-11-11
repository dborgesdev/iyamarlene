# Finalização local — 11/11/2026

Branch: feat/woocommerce-ssr-cloudflare. Revisão local, sem commit/push/PR/merge/deploy, DNS, instalação WordPress remota, cobranças ou etiquetas. A autorização de 04/11 pertence à entrega anterior. Vercel preservada. **Não liberada para pagamentos reais** enquanto houver bloqueios comerciais abaixo.

## Implementado

- Logotipo oficial no Header/Footer, proporcional e com alt/link Home; sem Minha conta em desktop/mobile. Copy institucional e componentes de produtos preservados.
- OG JPEG 1200×630 conforme mockup; favicon oficial, Apple/manifest, metadados absolutos e imagens específicas dos produtos preservadas. Prompt/origem em assets/og-image.md.
- Carrinho privado no Worker; tokens apenas em cookie HttpOnly e transporte servidor→servidor. Recuperação explícita revalida IDs/quantidades, sem confiar em preços do browser; foco/visibilidade revalidam WooCommerce.
- Ponte v2: JWT nativo, sessão persistida Store API, ticket aleatório de uso único/120s, trava atômica, origem exata e impressão dos itens/cupons. Revalidação de produtos/variações/estoque e totais pelo WooCommerce; rollback em falha. Não altera plugins financeiros nem cria pedidos em paralelo.
- Reconciliação apenas após is_paid() no servidor; comparação condicional do valor persistido preserva alterações concorrentes e novos itens. Estados pendentes/recusados não apagam carrinho. Testes isolados não são homologação de webhook.
- Shell próprio em MU-plugin para checkout em blocos/clássico, order-pay e order-received, com marca, fontes, cores, links legais, contato e crédito exato. Conteúdo/hooks/scripts nativos preservados. Acesso ao contexto do pedido exige chave e proprietário quando aplicável.
- Compra de visitante sem oferta de cadastro/login no frontend, sem apagar usuários/opções administrativas. Formulários financeiros e brasileiros continuam nativos.
- Redirects restritos a GET/HEAD das páginas públicas conhecidas, com exclusão de APIs/AJAX/admin/POST/checkout/pagamentos. Categorias levam ao filtro React. Noindex/no-store nas páginas privadas. Cache público de origem permanece inativo até homologação.

## Testes executados

- Instalação congelada offline: dependências já disponíveis; pnpm-lock.yaml preservado. O shim pnpm inicialmente tentou baixar a versão e falhou por DNS/permissão; execução pelo pnpm disponível com gestão automática de versão desabilitada passou (10.33.0).
- pnpm typecheck e pnpm test: 29 testes aprovados, incluindo medidas reais do carrossel em 375/768/1024/1440 e 1/2/3/7 cards, segurança do transporte, sessão expirada/recuperação, OG e marca.
- pnpm build e check:deploy: artefatos cliente/Worker e assets aprovados na validação local; sem publicação.
- PHP 8.3 WASM oficial via WordPress Playground CLI 3.1.64: sintaxe dos 12 arquivos PHP aprovada. unit.php: 27 verificações aprovadas (fingerprint, pagamento pendente/confirmado, idempotência, alterações concorrentes, privacidade/estados e redirects).
- scripts/test-bridge-local.mjs contra WordPress isolado com WooCommerce real: dois produtos locais com quantidades 2+1, totais nativos, cookie nativo persistindo em duas recargas, origem/token inválidos e replay rejeitados; origem preservada. Nenhum pedido ou pagamento criado.
- scripts/smoke-local.mjs no preview Cloudflare 127.0.0.1:4175: Home/catálogo/produto SSR, produto ausente e rota ausente 404, quatro políticas, sitemap, robots, favicon, canonical/JSON-LD e carrinho real add/update/remove. Sem pedido ou pagamento.
- Navegador: catálogo com seis produtos reais, marca carregada e ausência de Minha conta; viewport 375/768/1024/1440 sem overflow horizontal observado. Não foi realizado ensaio com leitor de tela nem medição de Core Web Vitals de campo.
- Navegador → Worker local → WooCommerce local: dois produtos, alteração de quantidade para 2+1, subtotal nativo 78,70, transferência por formulário/ticket e persistência após recarga do checkout. O teste revelou Origin nulo causado por no-referrer; corrigido para strict-origin, preservando verificação exata e sem divulgar caminho/query. A transferência passou após a correção. Referência normativa: https://fetch.spec.whatwg.org/#append-a-request-origin-header.
- Checkout nativo em blocos observado em 375/768/1024/1440, sem overflow, marca carregada, compra de visitante e campos preservados; skip link por teclado moveu foco para iya-content. Console sem erros/avisos nas páginas conferidas. Evidência em artifacts/checkout-local-1440.jpg. A instância isolada usa textos nativos em inglês, país padrão do instalador e nenhum gateway/frete configurado; não representa configuração comercial de produção. Nenhum dado pessoal foi preenchido nem pedido submetido. O blueprint desativa apenas a tela coming-soon local para permitir o teste; em homologação real conferir idioma, país e visibilidade junto das configurações verificadas.
- Pacote ZIP aberto e inventariado; caminhos normalizados com / para extração em Linux, diagnóstico presente e ausência de testing/fixtures/.env confirmada. git diff --check passou; lockfile sem alterações.

Produtos A/B do ambiente isolado são fixtures de teste e não entram no frontend de produção nem no pacote. Testes unitários usam doubles explicitamente; nenhuma integração de produção é substituída por simulação.

## Instalação preparada

scripts/package-wordpress.ps1 gera artifacts/iya-wordpress-install.zip. Inclui 000/010/020 MU-plugins, iya-storefront/includes/templates/assets, tools/iya-audit.php e LEIA-ANTES-DE-INSTALAR.md. Não inclui testing, banco de dados, arquivos temporários ou credenciais. Destinos exatos, opções de visitante, allowlist, cache desativado, sequência de homologação e rollback em wordpress.md.

## Bloqueios externos e aceite comercial

| Área | Estado e procedimento restante |
| --- | --- |
| Ponte | Código e persistência locais validados. Instalar em homologação autorizada; validar HTTPS, Secure/SameSite, domínios reais, mobile e WAF/CDN. Remoto ainda sem ponte na auditoria pública de 11/11. |
| Mercado Pago | Instalado/configurado segundo contratante. Não acessamos credenciais/conta. Auditar versão/modalidade/métodos/compatibilidade de blocos; sandbox oficial para Pix/cartão, aprovação/pendência/recusa/cancelamento/expiração, retorno e webhooks autenticados/idempotentes. Não trocar credenciais de produção. |
| Melhor Envio | Plugin/autenticação/CEP de origem/serviços não auditados administrativamente. Conferir pesos/dimensões reais, cotações/prazo/valor/registro no pedido e restrições de perfumes/líquidos. Nenhuma tarifa ou autorização de transporte inventada. |
| Campos brasileiros | Conferir plugin real e compatibilidade conjunta com blocos/gateway/frete; CPF/CNPJ/número/bairro/CEP/telefone sem duplicação. Homologar clássico apenas se necessário, sem alteração automática remota. |
| Pós-compra | Shell e estados implementados, testes lógicos aprovados; criação de pedido, QR/copia-e-cola/expiração reais, gateway, baixa/restauração de estoque e e-mail transacional dependem da homologação. Nenhum pedido marcado pago manualmente. |
| Guest | Habilitado no ambiente local e preparado via filtros/opções; conferir configurações e jornada anônima reais após instalação autorizada. |
| Redirects | Código e testes locais aprovados; confirmar domínio React correto antes da instalação para evitar enviar visitantes ao site anterior. Verificar regras adicionais de CDN/SEO e callbacks dos plugins reais. |
| Políticas | Quatro textos-base sem aprovação jurídica/comercial; confirmar controlador/CNPJ/endereço/devoluções/prazos/fornecedores e publicar os mesmos textos aprovados no WooCommerce. Não inventar dados ausentes. |
| Cache | Allowlist privada protegida por desenho e inativa. Versão/configuração WP REST Cache real, MISS/HIT/invalidação por produto/preço/estoque e bypass privado precisam de homologação antes de habilitar. |

Não há acesso administrativo/credenciais de homologação nesta entrega. A próxima etapa exige autorização expressa de instalação em homologação, acesso administrativo seguro aos plugins e dados comerciais verificados. Publicação permanece aguardando nova autorização após os bloqueios serem resolvidos.

## Arquivos

Frontend: src/components/ui/{Brand,LegalPage}.tsx, src/components/sections/{Header,Footer}.tsx, src/components/cart/CartProvider.tsx, src/routes/{__root,carrinho,produtos}.tsx, src/lib/{commerce,cart-server,seo}.ts, src/data/legal.ts, src/server.ts, src/index.css, src/env.d.ts. Assets: public/{logo-iya-marlene.webp,og-image.jpg,favicon.ico,apple-touch-icon.png,icon-192.png,icon-256.png,site.webmanifest}; favicon.svg anterior arquivado em docs/legacy.

WordPress: wordpress/010-iya-checkout.php, 020-iya-storefront.php, iya-storefront/{includes,templates,assets}, testing/{blueprint.json,lint.php,unit.php}, tools/audit.php. Cache 000 preservado e inativo. Validação/pacote: tests/{branding,commerce}.test.mjs, scripts/{check-deploy,smoke-local,test-bridge-local}.mjs, scripts/package-wordpress.ps1. Documentação: AGENTS.md, README.md, docs/{project,wordpress,cloudflare,validation-commerce,validation-finalization}.md e docs/assets/og-image.md; .gitignore exclui artifacts/.

## Publicação autorizada — 11/11/2026

Após a entrega e apresentação dos bloqueios comerciais, o contratante solicitou expressamente commit, push, PR, merge e deploy desta revisão. Autoriza publicação do frontend no Worker iyamarlene em workers.dev; não inclui DNS/custom domain, instalação remota WordPress, mudança de credenciais financeiras ou cobranças. Vercel preservada. Os registros anteriores de ausência de publicação descrevem a fase local; os bloqueios financeiros/logísticos permanecem, e checkout continua fechado quando a ponte v2 está ausente.
