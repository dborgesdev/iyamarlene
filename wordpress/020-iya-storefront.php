<?php
/**
 * Plugin Name: Iyá Marlene — Storefront presentation
 * Description: Brand shell for native checkout/order pages and narrowly scoped public storefront redirects.
 * Version: 1.0.0
 * Requires PHP: 8.1
 */
defined('ABSPATH') || exit;
require_once __DIR__ . '/iya-storefront/includes/class-presentation.php';
\IyaMarlene\Commerce\Presentation::boot();
