<?php
/**
 * Plugin Name: Iyá Marlene — Headless checkout handoff
 * Description: Revalidates a Store API cart and transfers products into the native WooCommerce session. Requires staging acceptance before installation.
 * Version: 1.0.0
 * Requires PHP: 8.1
 */
defined('ABSPATH') || exit;

function iya_checkout_handoff(): void {
    nocache_headers();
    header('Referrer-Policy: no-referrer');
    header('X-Robots-Tag: noindex, nofollow');
    $allowed = ['https://iyamarlene.com.br'];
    // Add a specific local/staging origin only during supervised acceptance.
    $allowed = apply_filters('iya_checkout_allowed_origins', $allowed);
    $origin = rtrim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !in_array($origin, $allowed, true)) {
        wp_die('Origem inválida.', 'Checkout', ['response' => 403]);
    }
    $token = (string) wp_unslash($_POST['cart_token'] ?? '');
    if (!$token || strlen($token) > 4096 || !preg_match('/^[A-Za-z0-9._-]+$/D', $token)) {
        wp_die('Sessão inválida. Volte ao carrinho.', 'Checkout', ['response' => 400]);
    }
    if (!function_exists('WC') || !function_exists('wc_load_cart')) wp_die('Loja indisponível.', 'Checkout', ['response' => 503]);
    // The fixed origin URL validates the bearer with WooCommerce, never browser totals.
    $response = wp_remote_get(rest_url('wc/store/v1/cart'), [
        'headers' => ['Cart-Token' => $token, 'Cache-Control' => 'no-store'],
        'timeout' => 15, 'redirection' => 0,
    ]);
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        wp_die('Carrinho expirado ou indisponível. Volte ao site e tente novamente.', 'Checkout', ['response' => 409]);
    }
    $source = json_decode(wp_remote_retrieve_body($response), true);
    $items = $source['items'] ?? [];
    if (!$items || !empty($source['errors'])) wp_die('Confira os itens no carrinho antes de continuar.', 'Checkout', ['response' => 409]);
    wc_load_cart();
    $previous = WC()->cart->get_cart();
    $coupons = WC()->cart->get_applied_coupons();
    WC()->cart->empty_cart(false);
    try {
        foreach ($items as $item) {
            $id = absint($item['id'] ?? 0);
            $quantity = absint($item['quantity'] ?? 0);
            $product = wc_get_product($id);
            if (!$product || !$quantity || !$product->is_purchasable() || !$product->is_in_stock() || !$product->has_enough_stock($quantity)) throw new Exception('Produto indisponível.');
            $variation_id = $product->is_type('variation') ? $id : 0;
            $parent_id = $variation_id ? $product->get_parent_id() : $id;
            $attributes = $variation_id ? $product->get_variation_attributes() : [];
            if ($product->is_sold_individually() && $quantity !== 1) throw new Exception('Quantidade inválida.');
            if (!apply_filters('woocommerce_add_to_cart_validation', true, $parent_id, $quantity, $variation_id, $attributes)) throw new Exception('Produto não pode ser comprado.');
            $key = WC()->cart->add_to_cart($parent_id, $quantity, $variation_id, $attributes);
            if (!$key || WC()->cart->get_cart_item($key)['quantity'] !== $quantity) throw new Exception('Não foi possível transferir os itens.');
        }
        WC()->cart->calculate_totals();
        WC()->cart->set_session();
        WC()->session->set_customer_session_cookie(true);
        WC()->session->save_data();
        wp_safe_redirect(wc_get_checkout_url(), 303);
        exit;
    } catch (Throwable $error) {
        WC()->cart->empty_cart(false);
        foreach ($previous as $item) WC()->cart->add_to_cart($item['product_id'], $item['quantity'], $item['variation_id'], $item['variation'], array_diff_key($item, array_flip(['key', 'product_id', 'variation_id', 'variation', 'quantity', 'data', 'data_hash', 'line_tax_data', 'line_subtotal', 'line_subtotal_tax', 'line_total', 'line_tax'])));
        foreach ($coupons as $coupon) WC()->cart->apply_coupon($coupon);
        WC()->cart->calculate_totals();
        WC()->cart->set_session();
        wp_die('O carrinho não foi transferido. Confira o estoque no site e tente novamente. Seu carrinho anterior na loja foi preservado.', 'Checkout', ['response' => 409]);
    }
}
add_action('admin_post_nopriv_iya_checkout', 'iya_checkout_handoff');
add_action('admin_post_iya_checkout', 'iya_checkout_handoff');
add_action('rest_api_init', static function () {
    register_rest_route('iya/v1', '/checkout', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => static function () {
            $response = new WP_REST_Response(['version' => 1]);
            $response->header('Cache-Control', 'no-store');
            return $response;
        },
    ]);
});
