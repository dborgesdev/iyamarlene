<?php
// Isolated logic tests. Not a gateway/payment homologation and never loaded by the store.
define('ABSPATH', '/isolated-test/');
$orders = []; $query = []; $viewer = 0; $page = []; $redirect = null;
function wp_json_encode($data) { return json_encode($data); }
function maybe_unserialize($data) { return is_string($data) && preg_match('/^[aOsibd]:/', $data) ? unserialize($data) : $data; }
function maybe_serialize($data) { return is_array($data) || is_object($data) ? serialize($data) : $data; }
function wp_salt($context) { return 'isolated-test-salt'; }
function wc_get_order($id) { return $GLOBALS['orders'][$id] ?? null; }
function get_query_var($key) { return $GLOBALS['query'][$key] ?? ''; }
function get_current_user_id() { return $GLOBALS['viewer']; }
function wc_clean($value) { return trim(strip_tags($value)); }
function wp_unslash($value) { return $value; }
function absint($value) { return abs((int) $value); }
function is_admin() { return false; }
function wp_doing_ajax() { return false; }
function is_checkout() { return $GLOBALS['page']['checkout'] ?? false; }
function is_wc_endpoint_url($endpoint) { return $GLOBALS['page'][$endpoint] ?? false; }
function is_front_page() { return $GLOBALS['page']['front'] ?? false; }
function is_home() { return false; }
function is_shop() { return $GLOBALS['page']['shop'] ?? false; }
function is_cart() { return $GLOBALS['page']['cart'] ?? false; }
function is_singular($type) { return $GLOBALS['page']['product'] ?? false; }
function is_tax($type) { return $GLOBALS['page']['category'] ?? false; }
function is_account_page() { return $GLOBALS['page']['account'] ?? false; }
function get_queried_object_id() { return 1; }
function get_post_field($field, $id) { return 'produto-real'; }
function get_queried_object() { return (object) ['slug' => 'ervas']; }
function wp_redirect($target, $status, $by) { $GLOBALS['redirect'] = [$target,$status]; throw new RuntimeException('redirect intercepted'); }
class WC_Session_Handler {
    public static array $data = [];
    public static array $deleted = [];
    function get_session($id, $default) { return self::$data[$id] ?? $default; }
    function delete_session($id) { self::$deleted[] = $id; unset(self::$data[$id]); }
}
class WC_Order {
    public array $meta = []; public bool $paid = false; public string $status = 'pending'; public int $user = 0;
    function is_paid() { return $this->paid; }
    function get_meta($name) { return $this->meta[$name] ?? ''; }
    function update_meta_data($name, $value) { $this->meta[$name] = $value; }
    function save() {}
    function get_order_key() { return 'wc_order_isolated_key'; }
    function get_user_id() { return $this->user; }
    function get_status() { return $this->status; }
}
class_alias('WC_Session_Handler', 'Automattic\WooCommerce\StoreApi\SessionHandler');
$wpdb = new class {
    public string $prefix = 'test_';
    public bool $race = false;
    function delete($table, $where, $format) {
        $id = $where['session_key'];
        if ($this->race) WC_Session_Handler::$data[$id]['cart']['key']['quantity'] = 4;
        if (maybe_serialize(WC_Session_Handler::$data[$id] ?? null) !== $where['session_value']) return 0;
        WC_Session_Handler::$deleted[] = $id; unset(WC_Session_Handler::$data[$id]); return 1;
    }
};
require __DIR__ . '/../iya-storefront/includes/class-bridge.php';
require __DIR__ . '/../iya-storefront/includes/class-presentation.php';
use IyaMarlene\Commerce\Bridge;
use IyaMarlene\Commerce\Presentation;
function check($condition, $message) { if (!$condition) throw new RuntimeException('FAIL: ' . $message); echo 'PASS: ' . $message . PHP_EOL; }
$cart = ['key' => ['product_id' => 1, 'quantity' => 2, 'variation_id' => 0, 'variation' => []]];
$hash = Bridge::fingerprint($cart);
check($hash === Bridge::fingerprint($cart), 'stable authoritative cart fingerprint');
$changed = $cart; $changed['key']['quantity'] = 3;
check($hash !== Bridge::fingerprint($changed), 'quantity change invalidates handoff fingerprint');
check($hash !== Bridge::fingerprint($cart, ['coupon']), 'coupon change invalidates handoff fingerprint');
$order = new WC_Order(); $orders[1] = $order;
$order->meta = ['_iya_source_id' => 'guest-test-session', '_iya_source_fingerprint' => $hash];
WC_Session_Handler::$data['guest-test-session'] = ['cart' => $cart];
Bridge::paid(1);
check(!WC_Session_Handler::$deleted, 'pending payment never clears source cart');
$order->paid = true; Bridge::paid(1); Bridge::paid(1);
check(WC_Session_Handler::$deleted === ['guest-test-session'], 'confirmed payment reconciles matching source exactly once');
$order->meta['_iya_source_reconciled'] = ''; WC_Session_Handler::$deleted = [];
WC_Session_Handler::$data['guest-test-session'] = ['cart' => $changed]; Bridge::paid(1);
check(!WC_Session_Handler::$deleted, 'new or edited source cart survives payment of older order');
$order->meta['_iya_source_reconciled'] = ''; WC_Session_Handler::$data['guest-test-session'] = ['cart' => $cart]; $wpdb->race = true;
Bridge::paid(1); check(WC_Session_Handler::$data['guest-test-session']['cart']['key']['quantity'] === 4, 'concurrent cart edit survives compare-and-delete'); $wpdb->race = false;
$query['order-received'] = 1; $_GET['key'] = 'wrong-key';
check(Presentation::order_context() === null, 'invalid order key reveals no order context');
$_GET['key'] = 'wc_order_isolated_key'; $order->paid = false;
foreach (['pending' => 'Pedido recebido', 'on-hold' => 'Pagamento em análise', 'failed' => 'Pagamento não aprovado', 'cancelled' => 'Pedido cancelado', 'refunded' => 'Pedido reembolsado'] as $status => $title) {
    $order->status = $status; check(Presentation::order_context()['title'] === $title, 'honest order state: ' . $status);
}
$order->paid = true; $order->status = 'processing';
check(Presentation::order_context()['title'] === 'Pagamento confirmado', 'paid label requires server-side confirmation');
$order->user = 5; check(Presentation::order_context() === null, 'customer order context requires matching authenticated owner');
$_SERVER['REQUEST_METHOD'] = 'GET'; $_SERVER['REQUEST_URI'] = '/'; $_GET = []; $query = [];
foreach (['checkout','order-pay','order-received'] as $endpoint) { $page = ['front' => true, $endpoint => true]; $redirect = null; Presentation::redirects(); check($redirect === null, 'transactional endpoint preserved: ' . $endpoint); }
$page = ['front' => true]; $_GET['wc-ajax'] = 'update_order_review'; Presentation::redirects(); check($redirect === null, 'checkout AJAX never redirects');
$_GET = []; $_SERVER['REQUEST_METHOD'] = 'POST'; Presentation::redirects(); check($redirect === null, 'POST/webhook transport never redirects');
$_SERVER['REQUEST_METHOD'] = 'GET'; $_SERVER['REQUEST_URI'] = '/wc-api/gateway'; Presentation::redirects(); check($redirect === null, 'gateway callback path never redirects');
$_SERVER['REQUEST_URI'] = '/';
foreach (['front' => '/', 'shop' => '/produtos', 'cart' => '/carrinho', 'product' => '/produto/produto-real', 'category' => '/produtos?categoria=ervas', 'account' => '/'] as $kind => $path) {
    $page = [$kind => true]; $redirect = null;
    try { Presentation::redirects(); } catch (RuntimeException $error) { if ($error->getMessage() !== 'redirect intercepted') throw $error; }
    check($redirect === [Presentation::FRONT . $path,301], 'public redirect: ' . $kind);
}
echo 'All isolated PHP logic tests passed. No payment gateway was invoked.' . PHP_EOL;
