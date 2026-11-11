<?php
// Read-only administrative audit. Never exposes gateway settings or credentials.
if (!defined('WP_CLI') || !WP_CLI) { http_response_code(404); exit; }
require_once ABSPATH . 'wp-admin/includes/plugin.php';
$plugins = get_plugins(); $active = [];
foreach (get_option('active_plugins', []) as $path) $active[] = ['file' => $path, 'name' => $plugins[$path]['Name'] ?? '', 'version' => $plugins[$path]['Version'] ?? ''];
$gateways = [];
if (function_exists('WC')) foreach (WC()->payment_gateways()->payment_gateways() as $gateway) $gateways[] = ['id' => $gateway->id, 'enabled' => $gateway->enabled === 'yes'];
$id = (int) get_option('woocommerce_checkout_page_id'); $content = (string) get_post_field('post_content', $id);
$invalid_dimensions = []; $page = 1;
if (function_exists('wc_get_products')) do {
    $products = wc_get_products(['status' => 'publish', 'limit' => 100, 'page' => $page++]);
    foreach ($products as $product) if (!$product->is_virtual() && (!$product->get_weight() || !$product->get_length() || !$product->get_width() || !$product->get_height())) $invalid_dimensions[] = $product->get_id();
} while (count($products) === 100);
global $wp_version;
echo wp_json_encode([
    'wordpress' => $wp_version, 'php' => PHP_VERSION, 'woocommerce' => defined('WC_VERSION') ? WC_VERSION : null,
    'theme' => wp_get_theme()->get_stylesheet(), 'active_plugins' => $active,
    'checkout' => ['page_id' => $id, 'blocks' => has_block('woocommerce/checkout', $content), 'classic' => has_shortcode($content, 'woocommerce_checkout')],
    'guest_option' => get_option('woocommerce_enable_guest_checkout'), 'signup_option' => get_option('woocommerce_enable_signup_and_login_from_checkout'),
    'gateways' => $gateways, 'store_postcode_configured' => (bool) get_option('woocommerce_store_postcode'),
    'coming_soon' => get_option('woocommerce_coming_soon'),
    'products_missing_shipping_dimensions' => $invalid_dimensions,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
