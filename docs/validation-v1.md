# Validação da V1 — 14/10/2026

Branch: `feat/v1-site`. Sem commit, push, PR, merge ou publicação.

## Executado

- Leitura integral de AGENTS.md, docs/project.md e README.md e inspeção da estrutura e dos três assets raster e favicon.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado. Saída estática em dist; JS 240,66 kB (74,32 kB gzip), CSS 17,99 kB (4,81 kB gzip).
- `pnpm install --frozen-lockfile`: aprovado após sincronizar o lockfile inicial, cujo importer estava vazio, com package.json. Nenhuma dependência de runtime adicionada.
- Preview de produção no navegador em 375, 768, 1024 e 1440 px: composição e conteúdo revisados; sem transbordamento horizontal.
- Menu móvel: abrir, fechar com Escape, aria-expanded, retorno de foco, navegar para Produtos e fechamento automático confirmados.
- Âncoras: todos os destinos existem; navegação até Produtos e Início confirmada.
- Todos os links WhatsApp inspecionados: número 5511947069990 e mensagens preenchidas, incluindo mensagens por serviço e produtos. Nenhuma mensagem enviada.
- Imagens carregadas, inclusive sabonetes após navegar para a seção (lazy loading). Arte integral e identificada como publicação.
- Console do navegador sem avisos ou erros capturados na revisão.
- HTTP 200 com tipos corretos: página principal, favicon, robots.txt, sitemap.xml, três imagens, JS e CSS gerados.
- JSON-LD WebSite válido com nome, URL e idioma; canonical e metadados sociais inspecionados. Sem endereço, modalidade, credenciais ou resultados inventados.
- Revisão arquitetural: App compõe as seções; cada seção mantém seu TSX; links e dados compartilhados em src/data/site.ts; tokens centrais no CSS.

## Limites e pendências

- Lint não configurado; não executado. Não houve auditoria automatizada completa de acessibilidade ou Lighthouse.
- Deploy na Vercel preparado em vercel.json, mas não realizado.
- Foto principal original tem 150 × 150 px; solicitar original maior. Open Graph existente deriva da mesma fonte. Assets originais preservados.
- Confirmar autorização das imagens, textos editoriais, biografia, modalidade/local, catálogo e disponibilidade antes de publicar; favicon e marca tipográfica provisórios.
- Fontes DM Sans e DM Serif Display carregadas pelo Google Fonts com preconnect e display=swap; há fontes de fallback.

## Avaliação local

`pnpm preview --host 127.0.0.1` após `pnpm build`; abrir http://127.0.0.1:4173/.
