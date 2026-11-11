# Auditoria e aplicação WordPress — 11/11/2026

Esta entrega prepara arquivos completos e testes locais. **Não instala nada remotamente, não modifica credenciais financeiras, DNS ou o WordPress publicado.** O pacote é preparado com `pwsh -File scripts/package-wordpress.ps1` e fica em artifacts/iya-wordpress-install.zip. A pasta de testes não entra no pacote.

## Auditoria realizada

A REST API pública da página finalizar-compra (ID 10) confirmou checkout em blocos WooCommerce. O HTML público identifica Twenty Twenty-Five como tema. /wp-json/iya/v1/checkout continua 404 na loja remota: a ponte não está instalada. O contratante confirmou Mercado Pago instalado/configurado; sua ativação, métodos, credenciais, webhooks, conta recebedora e testes não foram inspecionados no painel. Melhor Envio, plugin de campos brasileiros e SMTP também exigem inspeção administrativa autorizada. Não interpretar uma API pública funcional como homologação financeira.

O WordPress isolado de validação usa PHP 8.3, WordPress 7.1.4 e WooCommerce 11.3.0 (pacotes oficiais). Produtos locais A/B são fixtures de teste, não catálogo da cliente e não entram no pacote. O checkout de produção informado anteriormente usa WooCommerce 11.2.1; confirmar a versão administrativa e compatibilidade real antes de instalar.

## Destinos do pacote

Extrair o pacote sobre a raiz de uma **homologação com backup**, somente após autorização:

- wp-content/mu-plugins/010-iya-checkout.php — carrega a ponte versão 2.
- wp-content/mu-plugins/020-iya-storefront.php — carrega a camada de apresentação, checkout de visitante e redirecionamentos.
- wp-content/mu-plugins/iya-storefront/includes/class-bridge.php — sessão/ticket/reconciliação.
- wp-content/mu-plugins/iya-storefront/includes/class-presentation.php — shell e redirecionamentos restritos.
- wp-content/mu-plugins/iya-storefront/templates/*.php — Header/Footer, checkout nativo e erro recuperável.
- wp-content/mu-plugins/iya-storefront/assets/* — CSS e marca oficial empacotados, sem depender do domínio React para carregar o logotipo.
- wp-content/mu-plugins/000-iya-store-api-cache.php — adaptador de cache **inativo por padrão**. Somente habilitar após auditoria e testes específicos abaixo.

Não é necessário trocar o tema instalado ou copiar código em plugins financeiros. A apresentação seleciona seu próprio shell apenas em checkout/order-pay/order-received e mantém the_content(), wp_head(), wp_footer() e os scripts/blocos/hooks nativos. CSS atende blocos e clássico. Não foi criado gateway, processador de webhook, formulário financeiro React, serviço de frete ou sistema de pedidos paralelo.

## Configuração de visitante

Conferir também idioma pt-BR, país/estado da loja, moeda, páginas e visibilidade coming-soon no painel autorizado. Não preencher endereço/CEP ou alterar visibilidade da loja publicada por suposição. O blueprint local desativa somente a tela coming-soon da instância descartável para inspecionar o checkout; o diagnóstico somente leitura informa essa opção. A configuração financeira/logística da produção não é reproduzida pelas fixtures locais.

Após autorização, conferir em WooCommerce → Configurações → Contas e privacidade:

- Permitir finalizar compra sem conta: sim.
- Permitir criação de conta durante a finalização: não.
- Lembrete de login no checkout: não.
- Não exigir senha/cadastro; e-mail e dados exigidos pelos provedores permanecem nativos.

Para registrar os valores equivalentes com WP-CLI na homologação autorizada:

```sh
wp option update woocommerce_enable_guest_checkout yes
wp option update woocommerce_enable_signup_and_login_from_checkout no
wp option update woocommerce_enable_signup_from_checkout no
wp option update woocommerce_enable_checkout_login_reminder no
```

A camada de apresentação também aplica esses valores na leitura do frontend/REST, sem sobrescrever as opções administrativas no banco. Usuários existentes e acesso administrativo são preservados. Não desativar o gerenciamento de usuários.

## Ponte v2 e sessões

1. React usa /api/cart; o Worker mantém Cart-Token em cookie HttpOnly/SameSite=Lax/Secure em HTTPS. Valores privados são no-store.
2. /api/checkout valida método/origem e consulta GET /wp-json/iya/v1/checkout (version=2).
3. O Worker envia o bearer exclusivamente servidor→servidor em POST /wp-json/iya/v1/checkout/handoff, com a origem exata do frontend.
4. A ponte valida o JWT com CartTokenUtils da Store API; aceita apenas sessão de visitante e lê o estado persistido pelo SessionHandler da Store API. Não lê preços do navegador nem depende de loopback HTTP.
5. O WordPress emite um ticket aleatório de uso único com expiração de 120s, associado à origem e à impressão dos itens/cupons. Apenas o ticket passa por formulário POST para admin-post.php?action=iya_checkout. Bearer nunca aparece no HTML, query string, history ou referrer.

O documento de transferência usa Referrer-Policy: strict-origin: preserva Origin para a validação CSRF de formulário nativo, compartilhando somente a origem, sem caminho/query. no-referrer tornava Origin nulo em navegação POST e foi corrigido após teste real no navegador. Referência normativa: https://fetch.spec.whatwg.org/#append-a-request-origin-header. Não aceitar Origin null nem flexibilizar a allowlist para contornar esse comportamento.
6. Uma trava atômica em opção temporária impede consumo simultâneo; o ticket é consumido após reivindicação e o carrinho é relido. Mudança de itens/cupons exige nova confirmação. A trava é removida em finally, com expiração defensiva para interrupções.
7. Produtos/variações/estoque/quantidades são validados; o WooCommerce recalcula valores e cupons. A sessão nativa recebe todos os itens. Se ocorrer falha, conteúdos/cupons/contexto anteriores são restaurados e os itens da origem não são apagados. Extensões de produto com dados extras não conhecidos são recusadas com recuperação clara, em vez de perder personalizações silenciosamente.
8. O destino vem de wc_get_checkout_url(), não do browser. O cookie nativo sustenta a recarga do checkout. Sessões distintas Worker/WordPress são preservadas; não se presume que um Cart-Token vire cookie automaticamente.

Origens exatas padrão: https://iyamarlene.com.br e https://iyamarlene.smartlocal.workers.dev. Para uma homologação autorizada, pode-se definir no wp-config.php `IYA_CHECKOUT_ALLOWED_ORIGINS` como array de URLs completas e específicas. Remover origens locais após os testes. Não usar wildcard, CORS irrestrito ou registrar corpos/tickets/bearers em debug/WAF/APM.

O frontend mantém somente IDs/quantidades como rascunho de recuperação no navegador, sem tokens, preços, estoque ou dados pessoais. Sessão expirada gera mensagem e ação explícita “Restaurar meu carrinho”; /api/cart/recover reconsulta WooCommerce e informa itens indisponíveis. Não existe restauração silenciosa de valores autoritativos.

## Sincronização depois do pedido

Hooks nativos de criação de pedido associam, em metadados privados, o identificador da sessão de origem e sua impressão HMAC. Não são copiados tokens para o pedido. Os hooks de confirmação/processing/completed/thankyou verificam is_paid() no servidor antes de reconciliar. Pendente, recusado ou cancelado não limpam a origem.

Uma exclusão condicional compara o valor persistido exato da sessão antes de removê-la: alterações concorrentes ou novos itens não são apagados pelo pagamento de um pedido anterior. A operação usa a tabela privada nativa woocommerce_sessions, não tabelas de produtos/estoque/pedidos. Uma marca privada de reconciliação torna os hooks repetidos idempotentes. O Worker continua consultando a Store API; retorno, foco e mudança de visibilidade atualizam o contador. Nenhum parâmetro de URL é aceito como comprovação de pagamento.

O MU-plugin não cria pedidos nem marca pagamentos como aprovados. Idempotência de criação de pedido e notificações financeiras continua sendo responsabilidade dos fluxos nativos WooCommerce/Mercado Pago; homologá-los em sandbox. O native order_awaiting_payment não é apagado pelo handoff, preservando a recuperação de checkout do WooCommerce.

## Mercado Pago e Melhor Envio — homologação externa necessária

Não reinstalar Mercado Pago, substituir credenciais, trocar a conta recebedora ou reconfigurar do zero. Registrar versão/plugin ativo, modalidade (Pro/Transparente), métodos de Pix/cartão habilitados e compatibilidade efetiva com blocos, usando o painel autorizado. Em homologação separada, seguir o teste oficial com contas/credenciais de teste; não trocar produção para teste sem autorização. Testar aprovado, pendente, recusado, cancelado e expirado com os mecanismos reais do gateway, preservar QR/copia-e-cola/expiração retornados, conferir retorno e atualização assíncrona do pedido. Endpoints/notificações são os fornecidos pelo plugin instalado: não inventar URL de webhook ou implementar processador paralelo. Confirmar autenticidade/idempotência e repetição das notificações com os logs seguros do plugin.

Melhor Envio: conferir plugin/versão/autenticação, CEP de origem real, serviços habilitados, pesos/dimensões cadastrados, CEP de destino e modalidades realmente retornadas. Confirmar valor/prazo no checkout e registro no pedido. A versão 3.x do plugin informa adicionar os campos necessários ao frete; verificar antes de ativar outro plugin de campos brasileiros e criar duplicidades. CPF/CNPJ, número, bairro, telefone, CEP e validações devem vir dos plugins compatíveis já instalados. Não foram criadas máscaras/validações concorrentes nem tarifas fictícias. Se algum plugin real não suportar blocos, homologar primeiro no checkout clássico nativo; não trocar automaticamente a página em produção.

Confirmar composição e aceitação de perfumes/líquidos pelos serviços da transportadora. Não afirmar transporte permitido sem validação. Conferir SMTP real com notificações transacionais após pedido de teste. Nenhuma cobrança, etiqueta ou mensagem a cliente foi executada nesta entrega.

Referências oficiais consultadas:
- https://www.mercadopago.com.br/developers/pt/docs/woocommerce/integration-test
- https://docs.melhorenvio.com.br/docs/woocommerce
- https://br.wordpress.org/plugins/melhor-envio-cotacao/
- https://developer.woocommerce.com/docs/apis/store-api/cart-tokens

## Páginas transacionais e privacidade

O shell mantém os componentes do gateway, inclusive QR, código Pix, instruções, pagamento posterior e erros. Textos de estado distinguem pending, on-hold, failed, cancelled, refunded e is_paid(). Não prometem preparação/envio sem confirmação operacional. Número, total, itens e informações de pagamento são os dados renderizados pelo WooCommerce. O contexto de estado próprio exige chave de pedido válida e, em pedidos associados a usuário, dono autenticado; não aceita “status=paid” da URL. As verificações adicionais de acesso do WooCommerce permanecem no conteúdo nativo.

## Redirecionamentos e SEO

Somente páginas públicas GET/HEAD: Home WordPress → /; loja → /produtos; produto → /produto/slug; categoria → /produtos?categoria=slug; conta → /; carrinho nativo → /carrinho. O catálogo React aplica o filtro categoria recebido na URL.

Exclusões explícitas: admin, REST, Store API, XML-RPC, AJAX, POST, wc-api/wc-ajax, checkout, order-pay e order-received. APIs, retornos e webhooks não são bloqueados nem substituídos por redirects genéricos. Checkout/pedidos têm noindex/no-store/strict-origin. Confirmar regras adicionais de CDN/cache/SEO instaladas no servidor; este código não pode anulá-las por suposição.

Aprovar as quatro políticas-base e preencher os dados empresariais/comerciais pendentes. Depois copiar os mesmos textos aprovados para as páginas legais selecionadas nas configurações nativas WooCommerce (termos e privacidade). Links legais no shell apontam para o domínio principal. Antes de instalar redirects, o domínio principal precisa servir o React correto; não criar um redirecionamento para domínio ainda não migrado.

## Cache de origem

O 000-iya-store-api-cache.php continua inativo sem IYA_PUBLIC_CATALOG_CACHE_APPROVED=true. Confirmar WordPress/PHP/WooCommerce/WP REST Cache e personalização de preço/moeda/localização. Instalar antes do loader wp-rest-cache.php apenas após auditoria; campos globais cacheable request headers vazios e regeneração desabilitada. Verificar MISS/HIT de produtos/categorias, URLs sem query e parametrizadas, invalidação de preço/estoque/variação/categoria, baixa/restauração de estoque e bypass de cookies/nonces/auth/tokens. Carrinho, tickets, pedidos e pagamentos nunca pertencem à allowlist. Não há cache adicional de catálogo no Worker. Não declarar invalidação homologada a partir dos testes de PHP.

## Validação e rollback

Testes locais: `node scripts/test-bridge-local.mjs` contra o WordPress isolado do blueprint. Sintaxe/lógica PHP: usar @wp-playground/cli php com wordpress/testing/lint.php e unit.php. A matriz financeira/logística/SMTP continua dependente de autorização e acesso a homologação; ver docs/validation-commerce.md.

Rollback: retirar 020-iya-storefront.php e seus templates/estilos para retornar à apresentação anterior; retirar 010-iya-checkout.php para desativar o handoff e manter os dados WooCommerce. Remover constantes de homologação. Para cache, desativar WP REST Cache e remover o loader conforme instrução oficial, depois o 000 adaptador. Restaurar páginas/opções apenas a partir do backup registrado. Nunca excluir pedidos, usuários ou tabelas comerciais. Não apontar o frontend publicado para uma ponte retirada sem tratar checkout indisponível.

Auditoria administrativa opcional e somente leitura: o pacote inclui tools/iya-audit.php. Com WP-CLI autorizado, executar wp eval-file tools/iya-audit.php. O relatório contém versões, tipo do checkout, flags de visitante, IDs de gateways habilitados e produtos sem dimensões; não imprime chaves, credenciais ou valores dos gateways. Acesso web direto ao arquivo retorna 404.
