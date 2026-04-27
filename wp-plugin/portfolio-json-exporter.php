<?php
/**
 * Plugin Name: Portfolio JSON Exporter
 * Plugin URI: https://portfolio.local
 * Description: Generuje pliki JSON z danymi portfolio do pobrania w ZIP-ie
 * Version: 1.0.0
 * Author: Portfolio
 * License: GPL v2 or later
 */

if (!defined('ABSPATH')) {
    exit;
}

// Definiuj ścieżkę do pluginu
define('PORTFOLIO_JSON_EXPORTER_DIR', plugin_dir_path(__FILE__));
define('PORTFOLIO_JSON_EXPORTER_URL', plugin_dir_url(__FILE__));

// Ładuj klasy
require_once PORTFOLIO_JSON_EXPORTER_DIR . 'includes/class-exporter.php';
require_once PORTFOLIO_JSON_EXPORTER_DIR . 'includes/class-admin.php';

// Inicjalizuj plugin
function portfolio_json_exporter_init() {
    new Portfolio_JSON_Exporter_Admin();
}

add_action('plugins_loaded', 'portfolio_json_exporter_init');

// Zarejestruj activation hook
register_activation_hook(__FILE__, 'portfolio_json_exporter_activate');

function portfolio_json_exporter_activate() {
    // Możesz dodać coś do zrobienia podczas aktivacji
}
