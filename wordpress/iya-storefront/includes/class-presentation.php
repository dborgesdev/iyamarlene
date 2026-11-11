<?php
namespace IyaMarlene\Commerce;
defined('ABSPATH') || exit;

final class Presentation {
    public const FRONT = 'https://iyamarlene.com.br';
    public const WHATSAPP = 'https://wa.me/5511947069990';
    public static function boot(): void {
        add_action('template_redirect', [self::class, 'redirects'], 5);
        add_filter('template_include', [self::class, 'template'], 99);
        add_action('wp_enqueue_scripts', [self::class, 'assets'], 99);
        add_filter('wp_robots', [self::class, 'robots']);
        add_filter('woocommerce_checkout_registration_enabled', '__return_false');
        add_filter('woocommerce_checkout_registration_required', '__return_false');
        foreach (['woocommerce_enable_guest_checkout' => 'yes', 'woocommerce_enable_signup_and_login_from_checkout' => 'no', 'woocommerce_enable_signup_from_checkout' => 'no', 'woocommerce_enable_checkout_login_reminder' => 'no'] as $option => $value) {
            add_filter('option_' . $option, static fn($current) => is_admin() && !wp_doing_ajax() ? $current : $value);
        }
    }
    public static function active(): bool {
        return function_exists('is_checkout') && (is_checkout() || is_wc_endpoint_url('order-pay') || is_wc_endpoint_url('order-received'));
    }
    public static function robots(array $robots): array {
        if (self::active()) { $robots['noindex'] = true; $robots['nofollow'] = true; unset($robots['index'], $robots['follow']); }
        return $robots;
    }
    public static function assets(): void {
        if (!self::active()) return;
        self::styles();
    }
    public static function styles(): void {
        wp_enqueue_style('iya-commerce-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap', [], null);
        wp_enqueue_style('iya-commerce', plugins_url('../assets/commerce.css', __FILE__), [], '1.0.0');
    }
    public static function template(string $template): string {
        if (!self::active()) return $template;
        nocache_headers(); header('X-Robots-Tag: noindex, nofollow'); header('Referrer-Policy: strict-origin');
        return __DIR__ . '/../templates/commerce.php';
    }
    public static function redirects(): void {
        if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST) || (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST)) return;
        if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) return;
        if (isset($_GET['wc-api']) || isset($_GET['wc-ajax']) || get_query_var('wc-api') || str_contains((string) ($_SERVER['REQUEST_URI'] ?? ''), '/wc-api/')) return;
        if (!function_exists('is_checkout') || self::active()) return;
        $target = null;
        if (is_front_page() || is_home()) $target = self::FRONT . '/';
        elseif (is_shop() || is_cart()) $target = self::FRONT . (is_cart() ? '/carrinho' : '/produtos');
        elseif (is_singular('product')) $target = self::FRONT . '/produto/' . rawurlencode(get_post_field('post_name', get_queried_object_id()));
        elseif (is_tax('product_cat')) $target = self::FRONT . '/produtos?categoria=' . rawurlencode((string) get_queried_object()->slug);
        elseif (is_account_page()) $target = self::FRONT . '/';
        if ($target) { wp_redirect($target, 301, 'Iya Marlene storefront'); exit; }
    }
    public static function logo(): string {
        return plugins_url('../assets/logo-iya-marlene.webp', __FILE__);
    }
    public static function order_context(): ?array {
        $id = absint(get_query_var('order-received'));
        if (!$id) return null;
        $order = wc_get_order($id);
        $key = wc_clean(wp_unslash($_GET['key'] ?? ''));
        if (!$order || !$key || !hash_equals($order->get_order_key(), $key)) return null;
        if ($order->get_user_id() && get_current_user_id() !== $order->get_user_id()) return null;
        $status = $order->get_status();
        $texts = [
            'pending' => ['Pedido recebido', 'Aguardamos a confirmação do pagamento. Confira abaixo as instruções e os dados do pedido.'],
            'on-hold' => ['Pagamento em análise', 'Seu pedido foi recebido. O pagamento ainda não foi confirmado. Acompanhe as orientações abaixo.'],
            'failed' => ['Pagamento não aprovado', 'O pagamento não foi concluído. Confira as orientações da loja e a opção de tentar novamente, quando disponível.'],
            'cancelled' => ['Pedido cancelado', 'Este pedido está cancelado. Se precisar de ajuda, entre em contato com a loja.'],
            'refunded' => ['Pedido reembolsado', 'O pedido está registrado como reembolsado. Consulte o detalhamento abaixo.'],
        ];
        $text = $texts[$status] ?? ($order->is_paid() ? ['Pagamento confirmado', 'O pagamento deste pedido foi confirmado pela loja. Confira o resumo e as informações de acompanhamento abaixo.'] : ['Pedido recebido', 'Confira o estado atual do pedido e as orientações de pagamento abaixo.']);
        return ['title' => $text[0], 'description' => $text[1]];
    }
}
