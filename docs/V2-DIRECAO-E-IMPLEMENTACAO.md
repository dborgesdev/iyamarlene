# Iyá Marlene — Direção V2 e handoff

## Status
V2 para preview, não autorizada para publicação; utilizar branch `feat/v1-site` já existente e preservar main. Referência visual: layout editorial de página inteira fornecido na conversa em 14/10/2026 (hero fotográfico, 3 serviços ilustrados, produtos em faixa dividida, sobre editorial e CTA terracota).

## Objetivo
Redesenhar a V1 de forma substancial para composição editorial autoral, mantendo dados reais, CTA WhatsApp e arquitetura já existente. Não é suficiente trocar apenas imagens.

## Linguagem visual
Fotografia em destaque e integrada às seções; creme e areia, verde profundo, argila/terracota; serif elegante em títulos, sans legível em corpo; grids assimétricos, ritmo de espaços mais variado, bordas e ornamentos discretos. Manter a marca tipográfica provisória, sem inventar logo/símbolo religioso; não reproduzir a marca ornamental da referência automaticamente.

## Estrutura
1. Header editorial sobre área de hero, com navegação e CTA.
2. Hero imersivo: imagem de atmosfera, título grande à esquerda, copy sem promessas, WhatsApp. Manter a área de texto legível em mobile.
3. Atendimentos: título e cards com imagens individuais `cartas.webp`, `buzios.webp`, `trabalhos-espirituais.webp`; CTAs específicos via WhatsApp.
4. Produtos: imagem panorâmica `produtos.webp`, copy e CTA de consulta (sem catálogo inventado).
5. Sobre: combinar `sobre-conceitual.webp` com apresentação factual e, se conveniente, foto REAL existente de Iyá Marlene identificada claramente; imagem conceitual não é retrato nem registro real.
6. CTA final: `contato-bg.webp` e texto legível, com sobreposição suave quando necessário.
7. Footer e pequenos elementos de fundo: `textura-botanica.webp` em baixa intensidade, nunca sacrificando contraste.

## Inventário dos assets
Todos em `public/images/v2/`, WebP e tamanho final:

| Nome | Dimensões | Uso |
|---|---|---|
| hero-desktop.webp | 1600x900 | Hero em desktop |
| hero-mobile.webp | 720x960 | Hero mobile, composição específica |
| cartas.webp | 1200x900 | Card 4:3 |
| buzios.webp | 1200x900 | Card 4:3 |
| trabalhos-espirituais.webp | 1200x900 | Card 4:3 |
| produtos.webp | 1600x900 | Banda de produtos 16:9 |
| sobre-conceitual.webp | 960x1200 | Composição institucional 4:5, sem pessoa |
| contato-bg.webp | 1600x900 | CTA panorâmico 16:9 |
| textura-botanica.webp | 1600x900 | Textura editorial discreta 16:9 |

Usar `object-fit: cover` e `object-position` definidos por slot, conferir focal points em 375/768/1024/1440. `hero-mobile.webp` tem sujeito central, portanto no mobile preferir layout de imagem separada ou camada/overlay para o texto não colidir. Preload apenas do hero realmente usado; lazy load para abaixo da dobra. Fotos conceituais representam atmosfera, NÃO a pessoa, produtos reais ou rituais específicos; imagens de sabonetes e perfumes são ilustrativas e não comprovam estoque/catálogo.

## Fatos e restrições
Nome: Iyá Marlene / Yalorixá Marlene. Instagram: @yalorixa.marlene. WhatsApp +55 11 94706-9990. Serviços informados: cartas, búzios, trabalhos espirituais; produtos informados: banhos, sabonetes e perfumes. Modalidade de atendimento, endereço, biografia, disponibilidade e autorização de imagem pendentes. Sem resultados prometidos nem testemunhos inventados. Não usar pessoa gerada como se fosse Iyá Marlene.

## Engenharia e aceitação
Manter React+TS+Vite+Tailwind/pnpm; cada seção em .tsx próprio, App apenas composição, dados e links reutilizáveis fora do JSX quando útil. Preservar SEO e funcionalidades V1, revisar OG com fotografia conceitual corretamente contextualizada ou foto real autorizada; não adicionar schema com fatos não comprovados. Testar typecheck, build, links, navegação, contraste, teclado, 375/768/1024/1440, e saída Vercel estática. Não commit/push/merge até solicitação.

## Regra de aceite visual
O site deve lembrar a nova referência editorial pelo peso fotográfico e composição, sem simplesmente replicar o conceito como imagem estática; toda a página deve continuar implementada como HTML/React real, responsiva e editável.

## Refinamentos posteriores aprovados — 14/10/2026

Direção artística mantida, sem troca de assets ou estrutura principal. Alternância desktop: Produtos com imagem à esquerda, Sobre com texto à esquerda. No mobile, Sobre apresenta texto antes da imagem. Texto de corpo ampliado e texturas suavizadas; cards sem numeração visual, com recortes específicos por serviço. Avisos técnicos visuais de imagens conceituais removidos por solicitação explícita; distinção preservada nos atributos alt e nesta documentação. Rodapé com crédito: Desenvolvido por Douglas Borges - Smart Local (https://smartlocal.com.br), nova aba com noopener noreferrer.

## Biografia, retrato e horários — atualização autorizada

O relato biográfico publicado pela cliente e fornecido pelo contratante substitui a apresentação genérica: Umbanda, experiência com Seu Tranca Ruas aos 15 anos, iniciação no Candomblé, sacerdócio como Yalorixá, Jurema e Ifá. Texto integral em docs/project.md e dados em src/data/site.ts, sem expansões editoriais.

Sobre preserva o grid e as cores; agora usa public/images/iya-marlene.jpg (1080 × 1350), retrato real, sem filtros, foco em 50% 30% e alt Retrato de Iyá Marlene. A imagem conceitual anterior fica apenas como referência histórica do pacote, fora da interface.

Availability.tsx exibe dois blocos antes do contato final: online e presencial: segunda, quinta, sexta, sábado e domingo, a partir das 16h. Endereço não informado; disponibilidade e confirmação pelo WhatsApp, sem calendário ou reserva automática. Estas informações substituem a antiga pendência de biografia e modalidade, sem autorizar publicação final.
