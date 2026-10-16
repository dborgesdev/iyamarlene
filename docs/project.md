# Iyá Marlene — Especificação do projeto

## Estado e direção visual

V2 institucional para avaliação na branch `feat/v1-site`, ainda sem autorização para publicação final. Direção e refinamentos em `docs/V2-DIRECAO-E-IMPLEMENTACAO.md`. Preservar hero, header, serviços, produtos, paleta, tipografia, tratamentos visuais e rodapé aprovados. Não publicar, fazer commit, push, PR ou merge sem solicitação.

## Fontes de verdade

Conversa comercial de WhatsApp de 13/10/2026, perfil Instagram @yalorixa.marlene e materiais fornecidos pelo contratante. Biografia, modalidades e horários abaixo foram publicados por Iyá Marlene no Instagram e fornecidos e autorizados pelo contratante nesta atualização. Não acrescentar dados não informados.

## Informações confirmadas

- Nome Iyá Marlene / Yalorixá Marlene.
- WhatsApp +55 11 94706-9990; Instagram https://www.instagram.com/yalorixa.marlene/.
- Consultas com cartas, jogo de búzios e trabalhos espirituais.
- Produtos: banhos de ervas, sabão/sabonetes e perfumes. Detalhes do catálogo e disponibilidade devem ser consultados.
- Atendimento online: segunda, quinta, sexta, sábado e domingo, a partir das 16h.
- Atendimento presencial: segunda, quinta, sexta, sábado e domingo, a partir das 16h. Endereço e cidade ainda não informados.
- Horários divulgados não representam vagas livres nem confirmam agendamentos. Confirmar disponibilidade pelo WhatsApp. Sem duração de consultas informada.
- Domínio iyamarlene.com.br informado pelo contratante.

Cliente também mencionou Seu Tranca Ruas e Maria Padilha em seu atendimento; não são serviços comerciais separados na V2.

## Biografia autorizada

Título: Uma trajetória de fé, aprendizado e dedicação espiritual.

A caminhada espiritual de Iyá Marlene começou na Umbanda, mesmo diante das dúvidas que acompanhavam sua criação evangélica. Aos 15 anos, viveu uma experiência marcante com Seu Tranca Ruas, dando início a uma jornada de descobertas e aprofundamento espiritual.

Com o passar do tempo, seguiu seu caminho e foi iniciada no Candomblé, até chegar ao sacerdócio como Yalorixá.

Hoje, sua trajetória reúne a força da Jurema e a sabedoria de Ifá, conduzida pela fé, pelo respeito às tradições e pelo compromisso com a orientação espiritual.

CTA: Conheça mais pelo Instagram. Não expandir o relato com datas, tempo de experiência, títulos, linhagens ou alegações não fornecidos.

## Jornada e conteúdo

Uma página: Hero → serviços → produtos → Sobre → modalidades e horários → contato final → rodapé. Conversão por WhatsApp, sem checkout, formulário que armazena dados, calendário interativo ou sistema de reservas.

- Hero aprovado: Orientação, escuta e acolhimento; CTA Agendar uma consulta.
- Serviços: Jogo de cartas, Jogo de búzios e Trabalhos espirituais; descrições editoriais e mensagens específicas em src/data/site.ts.
- Produtos: banhos, sabonetes e perfumes, sem estoque ou catálogo inventados.
- Sobre: biografia acima à esquerda e fotografia real à direita no desktop; texto antes da foto no mobile.
- Modalidades e horários: dois blocos discretos antes do CTA final. Dados e mensagens em src/data/site.ts; apresentação em Availability.tsx. Observação: Consulte a disponibilidade e confirme seu agendamento pelo WhatsApp.
- CTA final preservado: Seu primeiro passo pode ser uma conversa.
- Rodapé preservado, incluindo Desenvolvido por Douglas Borges - Smart Local com https://smartlocal.com.br, nova aba e noopener noreferrer.

## Identidade e imagens

Editorial, acolhedor e sóbrio, sem caricaturas ou promessas de resultados. Tokens atuais no CSS; DM Serif Display e DM Sans. Produtos mantém foto à esquerda e texto à direita no desktop. Recortes específicos para cartas, búzios e vela nos cards; texturas botânicas discretas. Marca tipográfica e favicon provisórios, sem logo oficial.

Retrato real fornecido: public/images/iya-marlene.jpg, 1080 × 1350 px, aplicado exclusivamente na seção Sobre. Alt: Retrato de Iyá Marlene. Carregamento lazy, dimensões explícitas, object-fit cover com foco em 50% 30%; sem filtros, alterações de identidade ou sobreposições. A autorização para integrar essa foto veio da solicitação do contratante.

Os demais assets em public/images/v2 são conceituais, não registros da cliente, dos produtos reais ou dos atendimentos. Descrições acessíveis mantêm essa distinção. Sem legendas técnicas ou avisos visuais, conforme refinamento solicitado. sobre-conceitual.webp permanece apenas como referência histórica do handoff V2, sem importação na interface. Fotografias e arte V1 também preservadas como material de origem.

## SEO e engenharia

React, TypeScript, Vite, Tailwind v4 e pnpm. Preservar pnpm-lock.yaml. Cada seção em src/components/sections; App apenas compõe. Dados, horários, mensagens e URLs compartilhados em src/data/site.ts. Build pnpm build, saída dist; Vercel estática sem servidor, functions ou variáveis.

Title, meta description, canonical, Open Graph, Twitter Cards, favicon, robots, sitemap e JSON-LD WebSite preservados. A description existente já descreve serviços e conversão adequadamente. Sem endereço, cidade ou dados de SEO local inventados; horários não foram acrescentados ao schema.

Garantir semântica H1/H2/H3, landmarks, alt, foco visível, menu por teclado, reduced motion, contraste, carregamento de imagens e ausência de overflow. Validar em 375, 768, 1024 e 1440 px.

## Pendências para publicação

Endereço e cidade do atendimento presencial; confirmação editorial final da página e da identidade provisória; revisão de direitos de uso das demais imagens e materiais fornecidos; catálogo e disponibilidade dos produtos quando forem detalhados. Biografia, modalidades, horários e integração do novo retrato estão autorizados para esta implementação. Publicação final ainda depende de aprovação explícita.

## Ajustes de navegação e contato — 16/10/2026

Horários substituídos por informação fornecida pelo contratante: online e presencial, segunda, quinta, sexta, sábado e domingo, a partir das 16h, sem horário de encerramento. Dados compartilhados em attendanceSchedule (src/data/site.ts), mantendo mensagens específicas de cada modalidade.

Header: Início, Atendimentos, Produtos, Sobre; Início aponta para #inicio no desktop e mobile, mantendo scroll suave e fechamento do menu. Rodapé mantém seus links e crédito exato.

WhatsAppFloat.tsx é um componente reutilizável, circular, fixo à direita, com SVG reconhecível, área de toque de 56 px, safe area, foco visível e link seguro pela função whatsapp. Mensagem em messages.floating. Ajusta a distância inferior para evitar linhas de texto e links na área ocupada, sem modificar o layout aprovado. Sem animação de posição; transições de cor respeitam reduced motion existente.
