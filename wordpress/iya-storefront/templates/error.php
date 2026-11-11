<?php
use IyaMarlene\Commerce\Presentation as Storefront;
defined('ABSPATH') || exit;
require __DIR__ . '/header.php';
?>
<main id="iya-content" class="iya-content" tabindex="-1"><section class="iya-order-state"><p class="iya-eyebrow">Sua compra</p><h1>Vamos conferir seu carrinho</h1><p role="alert"><?php echo esc_html($error_message); ?></p><p>Seus itens não foram apagados do site.</p><a class="iya-booking" href="<?php echo esc_url(Storefront::FRONT . '/carrinho'); ?>">Voltar ao carrinho →</a></section></main>
<?php require __DIR__ . '/footer.php'; ?>
