<?php
use IyaMarlene\Commerce\Presentation as Storefront;
defined('ABSPATH') || exit;
require __DIR__ . '/header.php';
?>
<main id="iya-content" class="iya-content" tabindex="-1">
 <a class="iya-back" href="<?php echo esc_url(Storefront::FRONT . '/carrinho'); ?>">← Voltar ao carrinho</a>
 <?php $context = Storefront::order_context(); if ($context) : ?>
  <section class="iya-order-state" aria-labelledby="iya-order-state-title"><p class="iya-eyebrow">Sua compra</p><h1 id="iya-order-state-title"><?php echo esc_html($context['title']); ?></h1><p><?php echo esc_html($context['description']); ?></p></section>
 <?php elseif (!is_wc_endpoint_url('order-received')) : ?>
  <div class="iya-intro"><p class="iya-eyebrow">A loja de Iyá Marlene</p><h1><?php echo is_wc_endpoint_url('order-pay') ? 'Pagamento do pedido' : 'Finalizar compra'; ?></h1><p>Confira seus dados de entrega, frete e pagamento.</p></div>
 <?php endif; ?>
 <div class="iya-native-checkout"><?php while (have_posts()) : the_post(); the_content(); endwhile; ?></div>
 <div class="iya-help"><a href="<?php echo esc_url(Storefront::WHATSAPP); ?>" target="_blank" rel="noopener noreferrer">Precisa de ajuda? Fale com a loja ↗</a><a href="<?php echo esc_url(Storefront::FRONT . '/produtos'); ?>">Voltar para a loja →</a></div>
</main>
<?php require __DIR__ . '/footer.php'; ?>
