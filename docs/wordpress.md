# WordPress — artefatos e homologação pendente

Nenhum arquivo foi instalado remotamente. Acesso administrativo, versões PHP/WP REST Cache, personalização comercial e homologação financeira não estão disponíveis nesta entrega. Indícios públicos: WordPress 7.1.4 e WooCommerce 11.2.1. Confirmar no painel, com backup e ambiente de homologação, antes de instalar.

## Ponte de checkout: wordpress/010-iya-checkout.php

Instalação futura autorizada: copiar para wp-content/mu-plugins/010-iya-checkout.php. Requer PHP >=8.1, WooCommerce ativo e chamadas HTTPS de loopback para a Store API. Se o host bloquear loopback, corrigir a configuração do host; não trocar por URL arbitrária recebida do navegador.

POST recebido por wp-admin/admin-post.php, action=iya_checkout. Origens permitidas: somente https://iyamarlene.com.br. Para homologar em localhost/staging, adicionar **uma origem exata e temporária** pelo filtro iya_checkout_allowed_origins em código específico de homologação. Remover antes de produção. Não habilitar CORS amplo. O token é um bearer, enviado exclusivamente por POST; não registrar corpo da requisição em APM, logs de debug, WAF ou analytics. Excluir admin-post.php?action=iya_checkout do cache. Tratar token com a mesma confidencialidade de sessão.

A ponte valida o Cart-Token pela Store API da própria loja e revalida os itens na sessão nativa. Não confia em preço, total, URL de checkout ou IDs enviados separadamente pelo browser. A sessão nativa anterior é substituída pelos itens selecionados no frontend; em falha tenta restaurá-la. Carrinhos de extensões com dados personalizados, add-ons, bundles, assinaturas e variações “qualquer atributo” exigem adaptação específica e não estão homologados. Não transportar cupons, endereços ou dados pessoais pelo formulário; a compra continua no checkout nativo. O token do frontend continua sendo a sessão da Store API; depois de um pedido, validar a sincronização do retorno e a limpeza do carrinho antes de liberar produção.

Aceite obrigatório após instalar:
1. Adicionar dois produtos e quantidades diferentes no frontend. Passar pelo formulário, verificar produtos/quantidades na sessão WooCommerce e ao recarregar checkout.
2. Confirmar visitante novo, visitante com carrinho nativo anterior, login/logout e cookies em mobile/desktop. Verificar subtotal, impostos e preço revalidado.
3. Produto removido, sem estoque, preço/estoque alterados após adição, variação, quantidade inválida e token vencido devem produzir recuperação clara, sem compra errada.
4. Validar URL real wc_get_checkout_url() (links públicos observados: /finalizar-compra/) e Minha conta (/minha-conta/ com login/cadastro públicos).
5. Melhor Envio: CEP, cobertura, cálculo, peso/dimensões, restrições de líquidos/perfumes, preparação/postagem. Não inventar prazos.
6. Campos brasileiros CPF/CNPJ/endereço conforme necessidade. Mercado Pago em sandbox: Pix/cartão, recusa, cancelamento, retorno; criação de pedido, baixa/restauração de estoque, SMTP e notificações. Não efetuar cobrança real.
7. Verificar ausência de cache de sessão/conta/checkout/ponte e proteção contra origens não autorizadas. Testar preservação/restauração do carrinho em falhas.

## Cache: wordpress/000-iya-store-api-cache.php

Artefato derivado da referência fornecida, adaptado para Iyá Marlene e bloqueado por padrão: só registra hooks quando IYA_PUBLIC_CATALOG_CACHE_APPROVED=true. Não representa compatibilidade já validada nesta loja. Não definir a constante antes de auditar preços por localização/moeda/usuário, impostos, estoque e plugins. Se preço anônimo personalizado não for compreendido, manter desabilitado.

Instalação futura: confirmar WP/PHP/WooCommerce/WP REST Cache e assinatura dos filtros/métodos na versão realmente instalada. A referência foi validada em outra loja com WP REST Cache 2026.4.1, sem garantia de equivalência. Fazer backup; desativar temporariamente WP REST Cache; instalar MU-plugin antes do loader wp-rest-cache.php. No plugin: Global cacheable request headers vazio, Enable cache regeneration desmarcado. Somente produtos e categorias públicos anônimos GET, timeout=0. Transporte no-store; persistência apenas na origem.

Segurança: bypass de cookies, login, Authorization, nonce, Cart-Token, parâmetros de autenticação e geolocalização. Nunca cachear cart/checkout/conta/ponte ou respostas personalizadas. Inspecionar headers reais e confirmar que respostas com cookies/tokens não geram entrada compartilhada.

Invalidação a homologar: criação/edição/publicação/exclusão, categoria, atributo, variação, preço, estoque, baixa/restauração após pedido e opções relevantes. A limpeza roda no shutdown e usa FLUSH_STRICT **e** FLUSH_PARAMS, cobrindo URLs sem query e parametrizadas. Revalidar assinatura na versão instalada. SQL direto que ignora hooks é um limite conhecido.

Aceite: MISS inicial e HIT repetido com X-WP-Cached-Call: served-cache e contador no painel, separadamente produtos/categorias e query variants. Alterar preço/estoque de produto de teste, conferir invalidação e reconstrução com dados novos. Testar cookies/login/nonces/tokens sem HIT e concorrência. Medir frio/quente; não extrapolar referência de outra loja. Nenhum desses testes mutáveis foi feito remotamente nesta entrega.

Rollback: desativar WP REST Cache; retirar loader conforme instruções do plugin; remover MU-plugin e constante; confirmar origem sem cache. Não apagar tabelas de pedidos. Remover a ponte de checkout se houver falha e não liberar o CTA comercial em produção até corrigir.

## Legal e SEO no WooCommerce

Revisar razão social, CNPJ, endereço, contato de privacidade, retenção, política comercial, postagem, devolução e serviços efetivos. Aprovar os textos-base do frontend e publicar conteúdo equivalente nas páginas legais usadas pelo checkout; selecionar privacidade/termos nas configurações nativas. Evitar versões contraditórias. Produtos/categorias nativos equivalentes devem usar canonical/noindex apropriado em favor do frontend; conta/carrinho/checkout sem indexação, API e assets acessíveis. Auditar robots/global “desencorajar mecanismos” antes de alterar; não bloquear a loja inteira de forma indiscriminada.
O endpoint público de capacidade GET /wp-json/iya/v1/checkout retorna apenas version=1 e no-store. O Worker consulta esse sinal antes de expor o formulário de handoff; se ausente ou indisponível, responde 503 com retorno ao carrinho, sem transmitir o token.
