# Validação — Limpeza de Ambientes

Branch: feat/limpeza-ambientes, criada de origin/main atualizado (1d4d3bb). Main local preservada; workspace estava limpo no início. Sem commit, push, PR ou merge.

## Escopo

- src/data/site.ts: quarto serviço após os três existentes, descrição e mensagem exatas do pedido, CTA Agendar limpeza. CTAs anteriores mantidos como dados dos respectivos serviços.
- src/components/sections/Services.tsx: uma coluna mobile, duas a partir de 768 px e quatro a partir de 1280 px; mantém descrições em 16 px, imagens proporcionais e CTAs alinhados por linha.
- docs/project.md: serviço, descrição, CTA, mensagem, uso da imagem e restrições documentados.
- Imagem existente textura-botanica.webp, recortada sobre folhagens (foco 100% 20%, escala 2), sem modificação do asset nem criação de imagem. Distinta dos oráculos e identificada como conceitual no alt.

## Verificações executadas

- pnpm typecheck: aprovado.
- pnpm build: aprovado; CSS 20,55 kB (5,43 kB gzip), JS 248,65 kB (77,08 kB gzip).
- git diff --check: aprovado.
- Revisão visual em 375, 768, 1024 e 1440 px. Grid confirmado em uma, duas, duas e quatro colunas respectivamente; sem overflow horizontal.
- Em 1440 px, quatro cards com altura idêntica e CTAs na mesma posição vertical. Em tablet, alinhamento consistente por linha.
- Novo CTA alcançado por Tab, foco visível e área de interação conferidos no celular e tablet.
- WhatsApp conferido no DOM: 5511947069990, mensagem personalizada exata após decodificação, target=_blank e rel=noopener noreferrer. Nenhuma mensagem enviada.
- Todas as imagens dos cards carregadas com alt correspondente; descrições mantidas em 16 px e hierarquia H2/H3 preservada.
- Destinos das âncoras válidos; console sem erros ou avisos capturados.
- HTTP 200 na página e no WebP utilizado para o novo serviço.
- Demais seções, fotografias, dependências e pnpm-lock.yaml sem alterações.

Sem asset pendente para esta proposta; recorte botânico disponível usado como imagem conceitual. Preço, duração, deslocamento, modalidade e disponibilidade da limpeza não foram presumidos. Lint não configurado; sem Lighthouse ou auditoria automatizada completa de acessibilidade.

Preview: http://127.0.0.1:4173/. Para reiniciar: pnpm build e pnpm preview --host 127.0.0.1.
