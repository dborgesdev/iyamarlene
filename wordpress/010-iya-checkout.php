<?php
/**
 * Plugin Name: Iyá Marlene — Checkout bridge
 * Description: Guest-cart transfer using short-lived single-use tickets; native WooCommerce remains authoritative.
 * Version: 2.0.0
 * Requires PHP: 8.1
 */
defined('ABSPATH') || exit;
require_once __DIR__ . '/iya-storefront/includes/class-bridge.php';
\IyaMarlene\Commerce\Bridge::boot();
