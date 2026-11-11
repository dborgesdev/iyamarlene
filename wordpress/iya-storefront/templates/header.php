<?php
use IyaMarlene\Commerce\Presentation as Storefront;
defined('ABSPATH') || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="<?php echo esc_url(plugins_url('../assets/favicon.ico', __FILE__)); ?>"><?php wp_head(); ?></head>
<body <?php body_class('iya-commerce'); ?>>
<?php wp_body_open(); ?>
<a class="iya-skip" href="#iya-content">Pular para o conteúdo</a>
<header class="iya-header">
 <a class="iya-brand" href="<?php echo esc_url(Storefront::FRONT . '/'); ?>" aria-label="Iyá Marlene, início"><img src="<?php echo esc_url(Storefront::logo()); ?>" alt="Iyá Marlene" width="533" height="315"></a>
 <nav aria-label="Navegação principal"><a href="<?php echo esc_url(Storefront::FRONT . '/'); ?>">Início</a><a href="<?php echo esc_url(Storefront::FRONT . '/#atendimentos'); ?>">Atendimentos</a><a href="<?php echo esc_url(Storefront::FRONT . '/produtos'); ?>">Produtos</a><a href="<?php echo esc_url(Storefront::FRONT . '/#sobre'); ?>">Sobre</a></nav>
 <a class="iya-booking" href="<?php echo esc_url(Storefront::WHATSAPP . '?text=' . rawurlencode('Olá, Iyá Marlene! Gostaria de agendar um atendimento.')); ?>" target="_blank" rel="noopener noreferrer">Agendar atendimento ↗</a>
</header>
