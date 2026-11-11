# Validação da V1 comercial — 04/11/2026

Registro histórico da primeira entrega. O relatório vigente da revisão de 11/11/2026 está em [validation-finalization.md](validation-finalization.md): marca oficial, remoção de Minha conta, ponte v2, pacote WordPress e novos testes. As observações abaixo sobre conta pública, versão anterior da ponte e destaques vazios descrevem 04/11 e não o estado atual do código. Publicação posterior daquela entrega não autoriza publicar a revisão atual.

## Resultado e limites

Implementação local na branch feat/woocommerce-ssr-cloudflare. SSR, catálogo real, páginas individuais, carrinho Store API e artefatos Cloudflare funcionam no preview local. **Não liberada para publicação:** ponte WordPress e cache ainda não instalados/homologados; fluxo financeiro/logístico e políticas dependem de validação externa. Nenhum deploy, DNS, upload remoto, PR, merge, pedido ou pagamento foi executado.

## Engenharia

- pnpm install --frozen-lockfile: passou, lockfile sincronizado.
- TypeScript: passou (tsc --noEmit, também incluído em pnpm build).
- pnpm test: 6/6 testes passaram. Moeda/minor units e entidades; paginação integral; rejeição de origem/método/path arbitrário; token HttpOnly/no-store e descarte de preço enviado pelo cliente; handoff por POST; checkout fecha com 503 sem expor token quando a ponte falta.
- pnpm build: cliente e Worker SSR gerados, code splitting por rota, sem erro. Vite 8.3.5, Start 1.169.4, Router 1.170.46, Cloudflare Vite plugin 1.67.0, Wrangler 4.157.0. Versões completas no lockfile.
- pnpm check:deploy: passou; nome, main gerado, assets, flags e bloqueios de publicação conferidos. Não executa wrangler deploy nem operação remota.
- pnpm preview: runtime Cloudflare local iniciado e usado nos testes, sem autenticação Cloudflare.
- Lint: não existia configuração; não foi acrescentado um script sem implementação.
- PHP CLI não encontrado no PATH: os MU-plugins foram revisados em código, mas não executados nem homologados em WordPress nesta entrega.
- pnpm informa scripts de instalação ignorados para esbuild/workerd; build e runtime local funcionaram com os binários disponíveis. Em máquina limpa confirmar instalação/binários compatíveis antes de publicação.

## Integração HTTP real

Script reproduzível: `PREVIEW_URL=http://127.0.0.1:53487 pnpm test:integration` (em PowerShell: `$env:PREVIEW_URL='http://127.0.0.1:53487'; pnpm test:integration`). Aceita somente host local. A porta padrão no script pode ser substituída. Usa o fixture público atual incenso-aromatico/id23; atualizar se o catálogo real mudar.

Última execução aprovada, com HTML completo recebido (tempos de resposta local com conectividade real à loja, não métricas de campo):

| Rota | HTTP | Tempo observado |
|---|---:|---:|
| / | 200 | 90 ms |
| /produtos | 200 | 1433 ms |
| /produto/incenso-aromatico | 200 | 388 ms |
| /produto/nao-existe-iyamarlene | 404 | 356 ms |
| /rota-inexistente | 404 | 22 ms |
| /politica-de-privacidade | 200 | 34 ms |
| /termos-de-uso | 200 | 56 ms |
| /politica-de-trocas-e-devolucoes | 200 | 56 ms |
| /politica-de-entrega | 200 | 32 ms |
| /sitemap.xml | 200 | 534 ms |
| /robots.txt | 200 | 43 ms |
| /favicon.svg | 200 | 6 ms |

HTML inicial contém heading/conteúdo real de Home, catálogo e produto, title/canonical e Product/Offer reais. Home contém WebSite. Sitemap listou 6 produtos atuais e páginas estáticas, sem carrinho/API. Ambiente local recebeu X-Robots-Tag noindex e robots Disallow: /. HTTP 404 confirmado, sem fallback SPA 200.

Store API real retornou seis produtos e quatro categorias, preços, estoque, srcset/imagens e limites de compra. Minha conta 200 com login/cadastro. URL de checkout identificada nos links públicos: /finalizar-compra/; /checkout/ é 404.

Teste de carrinho anônimo: GET de sessão, add-item (201 é resposta válida da Store API), update-item para quantidade 2, remove-item até vazio; todos passaram. Cookie persistiu entre operações e resposta privada/no-store foi conferida. Não foram gravados tokens no relatório.

## Navegador e responsividade

- Catálogo observado em 375, 768, 1024 e 1440 px, com uma, duas e três colunas conforme breakpoint. scrollWidth não excedeu innerWidth nos pontos conferidos (descontada a barra vertical).
- Home e produto observados em 375 px; carrinho em mobile/tablet/desktop, sem overflow horizontal detectado.
- Imagens reais da Store API carregaram; nenhum fallback fictício. Entidades numéricas nos nomes dos banhos passaram a ser exibidas como travessão.
- Busca por incenso exibiu 1 resultado; filtro Sabonetes exibiu 2; Menor preço ordenou Ervas (24,90) antes de Floral (26,90), sem consulta por tecla no código.
- Navegação do produto, breadcrumbs, conteúdo/descrições e ações observados. Menu mobile inclui Minha conta/carrinho/WhatsApp; Escape fecha e devolve foco ao botão.
- Carrinho no navegador: 2 incensos + 1 perfume, contador 3 e subtotal R$87,70. Quantidade, remoção e persistência entre páginas confirmados. Itens de teste removidos ao terminar.
- Checkout com ponte ausente exibiu mensagem de indisponibilidade e retorno ao carrinho; nenhum token foi enviado ao WordPress pelo formulário.
- Logs capturados nas páginas verificadas sem erros/avisos, inclusive sem hydration mismatch.
- Reduced motion implementado em CSS e no scroll do carrossel; inspeção do código realizada, sem ensaio completo com leitor de tela ou medição automatizada de contraste.

## Performance e cenários não homologados

Arquitetura atual: Home SSR não consulta WooCommerce; destaques usam IntersectionObserver a 500px. Catálogo atual requer uma página de 100 produtos e filtros locais; produto consulta apenas slug; sitemap uma aquisição consolidada. Carrinho inicial reutiliza a própria resposta que cria a sessão; refresh concorrente é deduplicado. Não há KV/Redis/D1/cache público de carrinho.

Não foram medidos LCP/CLS/INP de campo nem comparação estatística antes/depois; não há percentual de ganho alegado. Tempos acima não são TTFB isolado, pois incluem leitura completa via script local. Cache frio/quente na origem ainda precisa de instalação e medição de MISS/HIT/invalidação.

Pendentes por exigirem alteração/configuração remota autorizada: produto recém-publicado/excluído, alteração de preço/estoque, variações reais, falta de imagem/estoque em fixtures da loja, indisponibilidade/latência artificial de WordPress, invalidação e concorrência WP REST Cache, ponte nativa, login autenticado, checkout com itens, Melhor Envio, campos brasileiros, Mercado Pago sandbox, criação de pedido/baixa/restauração de estoque, SMTP e retorno/recusa/cancelamento. Ausência de produto foi testada com slug inexistente, não por excluir um produto remoto.

## Revisão visual

Abrir o preview informado no terminal; nesta sessão: http://127.0.0.1:53487. Percorrer Home, /produtos, /produto/incenso-aromatico, /carrinho e as quatro políticas. O servidor é estritamente local; não existe URL de preview remoto criada. Em nova sessão: pnpm build && pnpm preview. Ver guias docs/cloudflare.md e docs/wordpress.md antes de qualquer operação externa.
Ao alcançar a seção de produtos na Home, a consulta featured=true retornou lista vazia na loja atual. O estado sem destaques e as setas desabilitadas foram confirmados. Marcar produtos como destacados é uma pendência editorial no WordPress, não executada remotamente.
Ajuste posterior solicitado: quando featured=true retornar vazio (ou a consulta falhar), a seção usa a apresentação anterior com imagem estática, copy e categorias preservadas, e CTA Ver todos os produtos para /produtos. O aviso de lista vazia foi substituído por esse fallback.
Fallback confirmado no navegador após rebuild: imagem produtos.webp, heading Banhos, sabonetes e perfumes, texto/categorias originais e botão Ver todos os produtos com href=/produtos. Sem erros/avisos capturados. Preview final mantido em http://127.0.0.1:53487/#produtos.
