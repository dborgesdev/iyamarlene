# Validação V2 — 14/10/2026

Prévia na branch `feat/v1-site`. Sem commit, push, PR, merge ou publicação.

## Implementação

- Header editorial integrado ao hero em desktop; marca tipográfica provisória sem símbolo religioso novo.
- Hero fotográfico com variante mobile, texto HTML e gradiente para leitura. Título sem promessa de resultado. Em 375 × 812, header e hero cabem na tela (aproximadamente 784 px no total), com CTA antes da imagem; telas mais baixas mantêm o CTA acima da faixa fotográfica.
- Três cards com imagens e WhatsApp contextualizado por serviço; produtos em faixa editorial, apresentação em verde e CTA terracota.
- Manifesto V1 integrado à apresentação por meio de Introduction.tsx. App apenas compõe as seções. Brand e WhatsAppLink compartilham apresentação reutilizada; dados e mensagens permanecem em src/data/site.ts.
- Nove assets V2 idênticos ao pacote ZIP, conferidos por SHA-256, com nomes e extensões preservados. Assets V1 preservados.
- Imagens identificadas como conceituais e ilustrativas; produtos não apresentados como catálogo real; sobre sem pessoa gerada. Sem modalidade, endereço, biografia ou credenciais inventados.
- SEO V1 preservado. Open Graph/Twitter agora usam o hero conceitual (1600 × 900) com alt correspondente. Preload apenas da variante de hero aplicável ao viewport. Lazy loading e dimensões explícitas nas demais imagens.

## Verificações executadas

- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado. dist/index.html 3,06 kB; CSS 18,99 kB (5,15 kB gzip); JS 243,46 kB (75,08 kB gzip).
- `pnpm install --frozen-lockfile`: aprovado, sem mudança de dependências.
- Revisão visual no navegador nas larguras 375, 768, 1024 e 1440 px; hierarquia, cards, imagens e composição revisados. Sem transbordamento horizontal.
- Hero usa hero-mobile.webp em 375 px e hero-desktop.webp em 1440 px, confirmado por currentSrc.
- Menu móvel aberto com Enter e fechado com Escape; aria-expanded e retorno do foco ao botão confirmados. Navegação para Produtos fecha o menu. Navegação desktop para Sobre confirmada.
- Link Pular para o conteúdo acionado por Enter: hash e foco transferidos para main#conteudo.
- Todos os destinos das âncoras existem. Links WhatsApp verificados: número 5511947069990 e mensagens preenchidas. Nenhuma mensagem enviada.
- Todas as imagens carregaram após navegar pela página. Console sem erros ou avisos capturados.
- HTTP 200 na página principal, favicon, robots.txt, sitemap.xml, nove imagens V2 e bundles CSS/JS. JSON-LD WebSite parseado, domínio correto e sem dados locais não confirmados.
- Configuração de deploy estático Vercel mantida. Nenhum deploy realizado.

## Limites e pendências

- Sem lint configurado. Não foram executados Lighthouse ou auditoria automatizada completa de acessibilidade. Contraste e foco revisados visualmente; regra de reduced motion preservada no CSS.
- Confirmação editorial final, autorização das imagens, biografia, modalidade/local, disponibilidade e detalhes reais do catálogo continuam pendentes para publicação.
- Marca tipográfica e favicon permanecem provisórios. Foto real de baixa resolução permanece preservada fora da interface V2.

## Preview

Servidor V2 em http://127.0.0.1:4174/ nesta sessão (4173 já estava ocupada). Para iniciar novamente: `pnpm build` seguido de `pnpm preview --host 127.0.0.1`; Vite informa a porta disponível no terminal.

## Rodada de refinamento visual e funcional — 14/10/2026

Esta revisão substitui a descrição anterior de legendas visuais e da posição da seção Sobre. Direção artística, assets, títulos, descrições e arquitetura preservados.

### Ajustes

- Produtos mantém fotografia à esquerda; Sobre tem texto à esquerda, imagem à direita no desktop e texto antes da imagem no mobile. Colunas centralizadas verticalmente e fotografia cobrindo a altura da seção.
- Parágrafos e descrições em 16 px; links de ação e navegação principal em 15 px; rodapé e categorias de produtos em 14 px. Tamanhos dos títulos preservados. Marca secundária e sobrancelhas ampliadas discretamente.
- Navegação desktop centralizada em grid, com base clara translúcida para contraste sobre a foto. Menu móvel preservado.
- Cards com recortes específicos no próprio CSS, mantendo arquivos originais: cartas em destaque, aproximação da tigela de búzios e foco em vela/flores no terceiro atendimento. Rótulos redundantes removidos; CTAs alinhados entre colunas.
- Opacidade da textura de serviços reduzida de 8% para 3,5%; de produtos, de 12% para 4,5%.
- Avisos gerais, legendas técnicas e rótulos de imagens removidos da apresentação visual conforme solicitado. Alt text mantém descrições honestas da natureza conceitual, sem alegar retratos ou catálogo reais.
- Crédito Desenvolvido por Douglas Borges - Smart Local incluído com https://smartlocal.com.br, target=_blank e rel=noopener noreferrer. Rodapé com espaçamento e leitura mobile revisados.

### Validações desta rodada

- pnpm typecheck e pnpm build: aprovados. Build final: HTML 3,06 kB; CSS 19,28 kB (5,16 kB gzip); JS 242,97 kB (75,05 kB gzip).
- Revisão visual efetiva em 375, 768, 1024 e 1440 px: sem overflow horizontal; ordem das colunas confirmada no desktop e fluxo de Sobre confirmado no mobile.
- Menu móvel: abrir com Enter, fechar com Escape com retorno de foco; navegar para Sobre fecha o menu.
- Navegação desktop para Atendimentos confirmada; todos os destinos de âncoras existem. Links WhatsApp com telefone e mensagens preservados.
- Links externos inspecionados: nova aba com noopener noreferrer, incluindo Smart Local. Destinos e atributos conferidos; nenhuma mensagem enviada.
- Todas as imagens carregadas após navegação; CTAs dos três cards com a mesma coordenada vertical em 1024 px.
- Remoção dos avisos confirmada no texto visível da página; console sem erros ou avisos capturados.
- Página, favicon, robots, sitemap, nove assets V2 e bundles responderam HTTP 200 no preview.
- Nenhuma dependência ou asset substituído. Sem commit, push, PR ou merge. Branch feat/v1-site.

Preview permanece em http://127.0.0.1:4174/. Não há novas pendências técnicas identificadas nesta rodada. Pendências editoriais/de publicação já registradas continuam vigentes; não foi realizada auditoria automatizada completa de acessibilidade ou Lighthouse.

## Biografia, fotografia real e modalidades — 14/10/2026

### Arquivos desta rodada

- src/data/site.ts: biografia fornecida integralmente, caminho do retrato e dados de modalidades/horários/mensagens centralizados.
- About.tsx: título, três parágrafos e CTA de Instagram fornecidos; texto à esquerda e retrato real à direita no desktop, leitura antes do retrato no mobile.
- Introduction.tsx: passa a apresentar parágrafos tipados recebidos por props, sem repetir o manifesto genérico anterior.
- Availability.tsx: novo componente com dois blocos informativos e WhatsApp reutilizado, entre Sobre e FinalCTA; App.tsx apenas adiciona a composição.
- docs/project.md, direção visual V2 e README: atualizados para as informações agora autorizadas. SEO preservado: description já adequada; sem horários/endereço no schema.

### Fotografia

public/images/iya-marlene.jpg, 1080 × 1350 px, 320.989 bytes. JPEG original mantido sem filtros, retoques ou alteração de identidade; dimensão adequada para o slot e lazy loading com dimensões explícitas. Alt exato: Retrato de Iyá Marlene. Enquadramento cover, foco 50% 30%, rosto e turbante preservados nos quatro tamanhos revisados. Arquivo em dist idêntico ao original por comparação binária. sobre-conceitual.webp não é mais referenciado na interface e permanece como referência histórica do handoff.

### Horários e conversão

Online e presencial: segunda, quinta, sexta, sábado e domingo, a partir das 16h. Blocos antes do contato final com observação para consultar disponibilidade e confirmar pelo WhatsApp. Sem endereço, cidade, vagas, duração, calendário ou reservas automáticas. Mensagens online/presencial decodificadas no navegador e conferidas literalmente com o pedido, número 5511947069990; encodeURIComponent compartilhado, sem nova lógica de URL.

### Validações executadas

- pnpm typecheck: aprovado.
- pnpm build: aprovado. HTML 3,06 kB; CSS 20,01 kB (5,34 kB gzip); JS 244,83 kB (75,66 kB gzip).
- Revisão visual em 375, 768, 1024 e 1440 px; sem overflow horizontal. Biografia completa, retrato, horários e botões revisados; composição restante preservada.
- Menu: Enter abre, Escape fecha com foco no botão; navegação móvel para Sobre fecha o menu. Desktop para Sobre confirmado. Link de salto por Enter transfere foco a main#conteudo.
- Âncoras válidas; links externos com noopener noreferrer; retrato carregado com largura natural 1080 e alt correto. Console sem erros ou avisos capturados.
- HTTP 200: página, retrato, nove assets do handoff V2, favicon, robots, sitemap e bundles. Retrato copiado para dist sem alterações.
- Arquitetura preservada: seções isoladas, App compõe, dados separados e WhatsAppLink reutilizado. Nenhuma dependência ou lockfile alterado.
- Lint não configurado. Sem Lighthouse ou auditoria automatizada completa de acessibilidade. Sem commit, push, PR, merge ou deploy.

Preview em http://127.0.0.1:4174/. Publicação final depende de aprovação explícita e revisão editorial/direitos dos demais materiais; endereço/cidade presencial ainda não informados. Biografia, modalidades, horários e integração da fotografia já autorizados.

## Navegação, novos horários e WhatsApp flutuante — 16/10/2026

- Início incluído como primeiro item do Header desktop e mobile, com destino #inicio; ordem completa Início / Atendimentos / Produtos / Sobre. Rodapé mantém sua navegação original e crédito exato Desenvolvido por Douglas Borges - Smart Local.
- Dias e horário centralizados em attendanceSchedule, compartilhados entre online e presencial: segunda, quinta, sexta, sábado e domingo, a partir das 16h. Sem encerramento informado; mensagens por modalidade preservadas. Referências aos horários substituídos removidas dos dados, interface e documentação.
- WhatsAppFloat.tsx incluído pelo App: SVG reconhecível, link compartilhado whatsapp(messages.floating), nova aba, noopener noreferrer, aria-label Agendar consulta pelo WhatsApp. Botão de 56 px, safe area, foco visível e transição de cor sob a regra reduced motion existente. Mantém-se à direita e ajusta a distância inferior quando necessário para evitar texto/links, inclusive do rodapé. Sem dependências adicionais ou mudanças no Hero/fotos/Sobre/cards/produtos.
- pnpm typecheck e pnpm build aprovados. Build final: CSS 20,58 kB (5,44 kB gzip); JS 247,94 kB (76,88 kB gzip).
- Revisão visual de Header e botão em 375, 768, 1024 e 1440 px, sem overflow horizontal. Número 5511947069990 e mensagem flutuante decodificada conferidos literalmente com o pedido; target e rel verificados. Nenhuma mensagem enviada.
- Enter abre menu móvel; Início acionado por Enter fecha menu e leva a #inicio. Retorno pelo Início desktop testado. Todos os destinos de âncoras existem.
- Horários das duas modalidades conferidos no DOM e visualmente; busca em src, docs e README não encontrou horários substituídos. Crédito exato conferido no DOM.
- Botão focado por teclado e visível no mobile; conferência geométrica confirmou ausência de sobreposição com texto do rodapé após reposicionamento. Console sem avisos ou erros capturados.
- Sem lint configurado ou auditoria automatizada completa de acessibilidade. Insets físicos de dispositivos não foram emulados; implementação usa env(safe-area-inset-*).
- Preview em http://127.0.0.1:4173/. Sem commit, push, PR ou merge nesta rodada; alterações locais sobre main.
