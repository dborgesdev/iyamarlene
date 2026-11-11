<?php
namespace IyaMarlene\Commerce;

use Automattic\WooCommerce\StoreApi\Utilities\CartTokenUtils;
use Automattic\WooCommerce\StoreApi\SessionHandler as StoreSession;

defined('ABSPATH') || exit;

final class Bridge {
    public static function boot(): void {
        add_action('rest_api_init', [self::class, 'routes']);
        add_action('admin_post_nopriv_iya_checkout', [self::class, 'handoff']);
        add_action('admin_post_iya_checkout', [self::class, 'handoff']);
        add_action('woocommerce_checkout_order_created', [self::class, 'link_order']);
        add_action('woocommerce_store_api_checkout_order_processed', [self::class, 'link_order']);
        add_action('woocommerce_payment_complete', [self::class, 'paid']);
        add_action('woocommerce_order_status_processing', [self::class, 'paid']);
        add_action('woocommerce_order_status_completed', [self::class, 'paid']);
        add_action('woocommerce_thankyou', [self::class, 'paid']);
    }

    public static function origins(): array {
        $origins = ['https://iyamarlene.com.br', 'https://iyamarlene.smartlocal.workers.dev'];
        if (defined('IYA_CHECKOUT_ALLOWED_ORIGINS') && is_array(IYA_CHECKOUT_ALLOWED_ORIGINS)) $origins = array_merge($origins, IYA_CHECKOUT_ALLOWED_ORIGINS);
        return array_values(array_unique(array_map(static fn($origin) => rtrim((string) $origin, '/'), $origins)));
    }

    public static function origin(string $origin): bool {
        return in_array(rtrim($origin, '/'), self::origins(), true);
    }

    public static function routes(): void {
        register_rest_route('iya/v1', '/checkout', [
            'methods' => 'GET', 'permission_callback' => '__return_true',
            'callback' => static function () {
                $response = new \WP_REST_Response(['version' => 2, 'guest' => get_option('woocommerce_enable_guest_checkout') === 'yes']);
                $response->header('Cache-Control', 'no-store');
                return $response;
            },
        ]);
        register_rest_route('iya/v1', '/checkout/handoff', [
            'methods' => 'POST',
            'permission_callback' => static function ($request) {
                if (!self::origin((string) $request->get_header('origin'))) return new \WP_Error('iya_origin', 'Origem inválida.', ['status' => 403]);
                return true;
            },
            'callback' => [self::class, 'issue'],
        ]);
    }

    private static function source(string $token): array {
        if (!function_exists('WC') || !class_exists(CartTokenUtils::class) || !class_exists(StoreSession::class)) throw new \RuntimeException('A versão da Store API precisa ser verificada antes de continuar.');
        if (!$token || strlen($token) > 4096 || !preg_match('/^[A-Za-z0-9._-]+$/D', $token) || !CartTokenUtils::validate_cart_token($token)) throw new \RuntimeException('Sua sessão expirou. Volte ao carrinho para conferir os produtos.');
        $payload = CartTokenUtils::get_cart_token_payload($token);
        $id = (string) ($payload['user_id'] ?? '');
        if (($payload['iss'] ?? '') !== 'store-api' || !$id || ctype_digit($id) || !preg_match('/^[A-Za-z0-9_-]{10,128}$/D', $id)) throw new \RuntimeException('Use um carrinho de visitante para continuar.');
        $data = (new StoreSession())->get_session($id, []);
        $cart = maybe_unserialize($data['cart'] ?? []);
        $data['applied_coupons'] = (array) maybe_unserialize($data['applied_coupons'] ?? []);
        if (!is_array($cart) || !$cart) throw new \RuntimeException('Seu carrinho está vazio ou a sessão expirou.');
        return ['id' => $id, 'data' => $data, 'cart' => $cart];
    }

    public static function fingerprint(array $cart, array $coupons = []): string {
        $items = [];
        foreach ($cart as $key => $item) $items[(string) $key] = [(int) ($item['product_id'] ?? 0), (int) ($item['variation_id'] ?? 0), (array) ($item['variation'] ?? []), (float) ($item['quantity'] ?? 0)];
        ksort($items); sort($coupons);
        return hash_hmac('sha256', (string) wp_json_encode([$items, $coupons]), wp_salt('auth'));
    }

    public static function issue($request) {
        try {
            if (get_option('woocommerce_enable_guest_checkout') !== 'yes') throw new \RuntimeException('O checkout de visitante ainda precisa ser habilitado na loja.');
            $source = self::source((string) $request->get_header('cart-token'));
            $ticket = bin2hex(random_bytes(32));
            $saved = set_transient('iya_handoff_' . hash('sha256', $ticket), [
                'token' => (string) $request->get_header('cart-token'),
                'origin' => rtrim((string) $request->get_header('origin'), '/'),
                'fingerprint' => self::fingerprint($source['cart'], $source['data']['applied_coupons'] ?? []),
            ], 120);
            if (!$saved) throw new \RuntimeException('Não foi possível preparar o checkout. Tente novamente.');
            $response = new \WP_REST_Response(['ticket' => $ticket, 'expires_in' => 120]);
            $response->header('Cache-Control', 'private, no-store');
            $response->header('Referrer-Policy', 'no-referrer');
            return $response;
        } catch (\Throwable $error) {
            return new \WP_Error('iya_handoff_unavailable', $error->getMessage(), ['status' => 409]);
        }
    }

    private static function items(array $cart): array {
        $result = [];
        foreach ($cart as $item) {
            $id = (int) ($item['product_id'] ?? 0); $variation = (int) ($item['variation_id'] ?? 0);
            $quantity = (float) ($item['quantity'] ?? 0); $attributes = (array) ($item['variation'] ?? []);
            $product = wc_get_product($variation ?: $id);
            if (!$product || $quantity <= 0 || !$product->is_purchasable() || !$product->is_in_stock() || !$product->has_enough_stock($quantity)) throw new \RuntimeException('Um produto não está mais disponível na quantidade escolhida. Volte ao carrinho e confira os itens.');
            if ($product->is_sold_individually() && $quantity !== 1.0) throw new \RuntimeException('Quantidade inválida para este produto.');
            if ($variation && (!$product->is_type('variation') || $product->get_parent_id() !== $id)) throw new \RuntimeException('A opção escolhida não está mais disponível.');
            $reserved = ['key', 'product_id', 'variation_id', 'variation', 'quantity', 'data', 'data_hash', 'line_tax_data', 'line_subtotal', 'line_subtotal_tax', 'line_total', 'line_tax'];
            if (array_diff_key($item, array_flip($reserved))) throw new \RuntimeException('Este produto exige opções adicionais. Entre em contato com a loja antes de continuar.');
            if (!apply_filters('woocommerce_add_to_cart_validation', true, $id, $quantity, $variation, $attributes)) throw new \RuntimeException('Confira as opções e quantidades dos produtos antes de continuar.');
            $result[] = [$id, $quantity, $variation, $attributes];
        }
        return $result;
    }

    public static function handoff(): void {
        nocache_headers(); header('Referrer-Policy: no-referrer'); header('X-Robots-Tag: noindex, nofollow');
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !self::origin((string) ($_SERVER['HTTP_ORIGIN'] ?? ''))) self::fail('Origem ou método inválido.', 403);
        $ticket = (string) wp_unslash($_POST['ticket'] ?? '');
        if (!preg_match('/^[a-f0-9]{64}$/D', $ticket)) self::fail('A solicitação expirou. Volte ao carrinho e tente novamente.', 409);
        $key = 'iya_handoff_' . hash('sha256', $ticket); $lock = $key . '_lock';
        $existing = (int) get_option($lock, 0);
        if ($existing && $existing < time() - 120) delete_option($lock);
        if (!add_option($lock, time(), '', false)) self::fail('Esta solicitação já está sendo processada. Volte ao carrinho para continuar.', 409);
        $previous = null; $previous_source = null; $coupons = []; $target = null; $success = false; $message = '';
        try {
            $record = get_transient($key);
            if (!$record || !hash_equals($record['origin'], rtrim((string) $_SERVER['HTTP_ORIGIN'], '/'))) throw new \RuntimeException('A solicitação expirou ou já foi utilizada. Volte ao carrinho e tente novamente.');
            delete_transient($key);
            $source = self::source($record['token']);
            $current = self::fingerprint($source['cart'], $source['data']['applied_coupons'] ?? []);
            if (!hash_equals($record['fingerprint'], $current)) throw new \RuntimeException('Seu carrinho mudou. Volte ao site e confira os itens antes de continuar.');
            wc_load_cart();
            $items = self::items($source['cart']);
            $target = WC()->cart; $previous = $target->get_cart(); $coupons = $target->get_applied_coupons();
            $previous_source = WC()->session->get('iya_bridge_source');
            $target->set_cart_contents([]); $target->set_applied_coupons([]);
            foreach ($items as [$id, $quantity, $variation, $attributes]) {
                $item_key = $target->add_to_cart($id, $quantity, $variation, $attributes);
                if (!$item_key || (float) $target->get_cart_item($item_key)['quantity'] !== $quantity) throw new \RuntimeException('Não foi possível transferir todas as quantidades. Confira os produtos no site.');
            }
            foreach ($source['data']['applied_coupons'] ?? [] as $coupon) if (!$target->apply_coupon($coupon)) throw new \RuntimeException('Um cupom não pode mais ser aplicado. Confira seu carrinho.');
            $target->calculate_totals(); $target->set_session();
            WC()->session->set('iya_bridge_source', ['id' => $source['id'], 'fingerprint' => $current]);
            WC()->session->set_customer_session_cookie(true); WC()->session->save_data();
            $success = true;
        } catch (\Throwable $error) {
            $message = $error->getMessage();
            if ($target && $previous !== null) {
                $target->set_cart_contents($previous); $target->set_applied_coupons($coupons);
                WC()->session->set('iya_bridge_source', $previous_source);
                $target->calculate_totals(); $target->set_session(); WC()->session->save_data();
            }
        } finally { delete_option($lock); }
        if (!$success) self::fail($message ?: 'Não foi possível continuar. Seus itens permanecem no carrinho.', 409);
        wp_safe_redirect(wc_get_checkout_url(), 303); exit;
    }

    private static function fail(string $message, int $status): void {
        if (class_exists(Presentation::class)) {
            status_header($status); Presentation::styles();
            $error_message = $message;
            require __DIR__ . '/../templates/error.php';
            exit;
        }
        $link = esc_url('https://iyamarlene.com.br/carrinho');
        wp_die(esc_html($message) . '<p><a href="' . $link . '">Voltar ao carrinho</a></p>', 'Continuar compra — Iyá Marlene', ['response' => $status]);
    }

    public static function link_order($order): void {
        if (!is_a($order, 'WC_Order') || !WC()->session) return;
        $source = WC()->session->get('iya_bridge_source');
        if (!$source || $order->get_meta('_iya_source_id')) return;
        $order->update_meta_data('_iya_source_id', $source['id']);
        $order->update_meta_data('_iya_source_fingerprint', $source['fingerprint']);
        $order->save();
        if ($order->is_paid()) self::paid($order->get_id());
    }

    public static function paid($id): void {
        $order = wc_get_order($id);
        if (!$order || !$order->is_paid() || $order->get_meta('_iya_source_reconciled')) return;
        $source_id = $order->get_meta('_iya_source_id'); $expected = $order->get_meta('_iya_source_fingerprint');
        if (!$source_id || !$expected) return;
        $handler = new StoreSession(); $source = $handler->get_session($source_id, []);
        $cart = (array) maybe_unserialize($source['cart'] ?? []);
        $coupons = (array) maybe_unserialize($source['applied_coupons'] ?? []);
        if ($cart && hash_equals($expected, self::fingerprint($cart, $coupons))) {
            // Compare-and-delete the exact persisted value: a concurrent cart edit must survive.
            global $wpdb;
            $deleted = $wpdb->delete($wpdb->prefix . 'woocommerce_sessions', ['session_key' => $source_id, 'session_value' => maybe_serialize($source)], ['%s', '%s']);
            if ($deleted === false) return;
        }
        $order->update_meta_data('_iya_source_reconciled', 'yes'); $order->save();
    }
}
