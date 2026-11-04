# Validação — carrossel de destaques da Home

Ajuste em 04/11/2026, na branch feat/woocommerce-ssr-cloudflare. Escopo limitado ao carrossel e aos seus testes. ProductCard, Purchase, integração WooCommerce, carregamento por IntersectionObserver e fallback estático não foram alterados.

## Implementação

- Barra nativa ocultada por scrollbar-width e ::-webkit-scrollbar, preservando overflow-x e scroll snap.
- Setas com ícones Lucide já disponíveis no projeto, área de toque de 48px, nomes acessíveis, aria-controls e foco existente.
- Posições calculadas pelos DOMRects dos cards relativos ao track, incluindo o espaçamento real. Destinos limitados a scrollWidth-clientWidth e deduplicados com tolerância de 1px. O último passo é limitado pelo fim real do conteúdo, para mostrar integralmente o último card sem espaço artificial.
- scrollTo com destinos absolutos; cliques consecutivos usam o destino pendente para não perder um passo durante animação. Gesto, wheel e teclado devolvem o controle à posição real.
- ResizeObserver observa track e todos os cards; resize e alteração do array de produtos refazem as medidas. Reposicionamento instantâneo conserva o card de referência mais próximo ao trocar breakpoint.
- Progresso terracota de 3px, sem atraso de transição, baseado no deslocamento real. Final chega a 100%; quando todos os cards cabem, ambas as setas ficam desabilitadas e a barra fica completa.
- prefers-reduced-motion troca smooth por instant. Nenhuma biblioteca ou dependência adicionada.

## Testes automatizados

pnpm test: **24/24 passaram**, incluindo 18 testes específicos do carrossel e os 6 testes existentes.

Matriz de geometria: 375, 768, 1024 e 1440px × 1, 2, 3 e 7 cards. Verifica um destino por clique, retorno sem erro acumulado e último card completo. Inclui posições fracionárias/cards desiguais e limites com arredondamento.

Teste do controlador com APIs DOM simuladas: cliques rápidos durante smooth, rolagem manual, progresso, redimensionamento, preferência de movimento reduzido e remoção dos observers/listeners.

pnpm typecheck e pnpm build: aprovados.

## Navegador real

Fixture local (
ode scripts/carousel-fixture.mjs`) usa **o ProductCard existente renderizado no servidor**, o CSS compilado e o controlador de produção. Produtos são identificados como fixtures locais; não são publicados nem adicionados ao WooCommerce. A rota não integra o site ou seu build de produção.

Os 16 cenários abaixo passaram com navegação de ida e volta, scrollbar oculto, último card inteiramente visível, progresso final de 100%, setas nos limites e ausência de overflow horizontal da página:

| Viewport | 1 card | 2 cards | 3 cards | 7 cards |
|---|---|---|---|---|
| 375px | passou | passou | passou | passou |
| 768px | passou | passou | passou | passou |
| 1024px | passou | passou | passou | passou |
| 1440px | passou | passou | passou | passou |

Rolagem horizontal manual e ArrowRight foram verificadas com atualização de snap/progresso/setas. Em 375px, ArrowRight alinhou em 917px (51%); gesto horizontal alinhou no próximo card em 1222px (68%). Redimensionamento durante navegação de 1440 para 375px manteve o card de referência, recalculando seu início para 611px e progresso para 34%, sem overflow. Não houve simulação física de toque ou alteração da preferência de movimento do sistema; esse caminho permanece nativo e a seleção instant/smooth foi coberta no teste automatizado.

Para repetir: pnpm build; node scripts/carousel-fixture.mjs; abrir http://127.0.0.1:53488/?count=1 (também count=2, 3 e 7). O servidor do fixture é vinculado apenas a 127.0.0.1. O preview normal da Home permanece em http://127.0.0.1:53487/#produtos nesta sessão.

Nenhum merge, deploy ou alteração remota foi executado.

Conferência adicional na Home real: a Store API retornou seis destaques na revisão final. Uma seta avançou para o início medido do próximo card (~394,66px); no final, scrollLeft=1184 e scrollWidth-clientWidth=1184, último produto inteiro, próxima seta desabilitada e progresso 100%. Logs capturados sem erros/avisos. Nenhum produto foi alterado na origem.
