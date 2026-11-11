<?php
use IyaMarlene\Commerce\Presentation as Storefront;
defined('ABSPATH') || exit;
?>
<footer class="iya-footer">
 <a class="iya-brand" href="<?php echo esc_url(Storefront::FRONT . '/'); ?>"><img src="<?php echo esc_url(Storefront::logo()); ?>" alt="Iyá Marlene" width="533" height="315" loading="lazy"></a>
 <nav aria-label="Informações da loja"><?php foreach (['politica-de-privacidade' => 'Política de Privacidade', 'termos-de-uso' => 'Termos de Uso', 'politica-de-trocas-e-devolucoes' => 'Trocas e Devoluções', 'politica-de-entrega' => 'Política de Entrega'] as $slug => $label) : ?><a href="<?php echo esc_url(Storefront::FRONT . '/' . $slug); ?>"><?php echo esc_html($label); ?></a><?php endforeach; ?></nav>
 <div><a href="<?php echo esc_url(Storefront::WHATSAPP); ?>" target="_blank" rel="noopener noreferrer">Fale pelo WhatsApp</a><a href="https://www.instagram.com/yalorixa.marlene/" target="_blank" rel="noopener noreferrer">Instagram</a></div>
 <p class="iya-credit"><a href="https://smartlocal.com.br" target="_blank" rel="noopener noreferrer">Desenvolvido por Douglas Borges - Smart Local</a></p>
</footer>
<?php wp_footer(); ?>
</body></html>
