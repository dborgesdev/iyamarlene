# Iyá Marlene — V2 para avaliação

Site institucional de uma página em React, TypeScript, Vite e Tailwind CSS v4. Conteúdo e links compartilhados em `src/data/site.ts`; seções independentes em `src/components/sections`.

## Desenvolvimento

Use Node.js 22 LTS e pnpm 10.18.3.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm build
pnpm preview --host 127.0.0.1
```

O preview de produção abre em http://localhost:4173. Não há lint configurado. `pnpm build` executa a checagem TypeScript antes de gerar `dist`.

## Deploy

Configuração estática da Vercel em `vercel.json`: framework Vite, build `pnpm build`, saída `dist`. Sem funções, backend ou variáveis de ambiente. Navegação interna por âncoras na página principal.

## Antes de publicar

A V2 é uma prévia para avaliação na branch `feat/v1-site`. A direção visual está em `docs/V2-DIRECAO-E-IMPLEMENTACAO.md`. Consulte `docs/project.md` para a fonte de verdade e as confirmações pendentes: endereço/cidade do atendimento presencial, catálogo, disponibilidade de produtos, aprovação editorial final e direitos dos demais materiais. Biografia, modalidades e horários já foram fornecidos e autorizados pelo contratante.

Os assets conceituais WebP em `public/images/v2` compõem a V2; `sobre-conceitual.webp` permanece apenas como referência histórica, substituído na interface pelo retrato real. Imagens ilustrativas não representam Iyá Marlene, seus atendimentos ou o catálogo real. Hero usa imagem específica para mobile e preload condicionado; demais imagens usam lazy loading. O Open Graph usa o hero conceitual, com alt correspondente. Os assets V1 permanecem preservados, incluindo a foto real de 150 × 150 px, que precisa de original maior caso volte à interface. Favicon e marca tipográfica são provisórios.

Os avisos técnicos visuais foram removidos por solicitação; descrições acessíveis mantêm a natureza ilustrativa das imagens. A seção Sobre apresenta texto à esquerda no desktop e antes da imagem no mobile.

As validações da revisão atual, incluindo a rodada de refinamento, estão em `docs/validation-v2.md`; o relatório V1 é histórico.

Não publicar ou mover para main sem aprovação.

A seção Sobre usa agora o retrato real `public/images/iya-marlene.jpg`. Biografia e horários estão centralizados em `src/data/site.ts`; modalidades aparecem em `Availability.tsx`, antes do contato final.
