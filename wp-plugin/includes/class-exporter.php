<?php

class Portfolio_JSON_Exporter {

    public static function export_languages() {
        $languages = [];

        // Jeśli używasz Polylang
        if (function_exists('pll_languages_list')) {
            $lang_list = pll_languages_list(['fields' => 'all']);
            foreach ($lang_list as $lang) {
                $languages[] = [
                    'slug' => $lang->slug,
                    'name' => $lang->name,
                    'locale' => $lang->locale,
                    'is_default' => $lang->is_default,
                    'flag_url' => $lang->flag_url ?? '',
                ];
            }
        } else {
            // Fallback dla brak Polylang
            $languages[] = [
                'slug' => 'pl',
                'name' => 'Polski',
                'locale' => 'pl_PL',
                'is_default' => true,
                'flag_url' => '',
            ];
        }

        return $languages;
    }

    public static function export_pages($lang = null) {
        $args = [
            'post_type' => 'page',
            'posts_per_page' => 100,
        ];

        if ($lang && function_exists('pll_get_post')) {
            // Ta funkcja jest do drugiej strony - filtrowaniu po pobraniu
        }

        $pages = get_posts($args);
        $result = [];

        foreach ($pages as $page) {
            $result[] = self::get_page_data($page, $lang);
        }

        return $result;
    }

    public static function export_posts($post_type = 'post', $lang = null) {
        $args = [
            'post_type' => $post_type,
            'posts_per_page' => 100,
            'post_status' => 'publish',
        ];

        $posts = get_posts($args);
        $result = [];

        foreach ($posts as $post) {
            $result[] = self::get_post_data($post, $lang);
        }

        return $result;
    }

    public static function export_projects_recommended($lang = null) {
        // Projekty z kategorii "recommended"
        $args = [
            'post_type' => 'post',
            'posts_per_page' => 100,
            'tax_query' => [
                [
                    'taxonomy' => 'category',
                    'field' => 'slug',
                    'terms' => 'recommended',
                ]
            ],
            'post_status' => 'publish',
        ];

        $posts = get_posts($args);
        $result = [];

        foreach ($posts as $post) {
            $result[] = self::get_post_data($post, $lang);
        }

        return $result;
    }

    public static function export_sections($lang = null) {
        // Custom post type "section"
        $args = [
            'post_type' => 'section',
            'posts_per_page' => 100,
            'post_status' => 'publish',
        ];

        $posts = get_posts($args);
        $result = [];

        foreach ($posts as $post) {
            $result[] = self::get_post_data($post, $lang);
        }

        return $result;
    }

    public static function export_menu($menu_name = 'main', $lang = null) {
        $locations = get_nav_menu_locations();

        if (!isset($locations[$menu_name])) {
            return [];
        }

        $menu_id = $locations[$menu_name];
        $menu_items = wp_get_nav_menu_items($menu_id);

        if (!$menu_items) {
            return [];
        }

        $result = [];
        foreach ($menu_items as $item) {
            $result[] = [
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'target' => $item->target ?? '',
                'classes' => $item->classes ?? [],
                'description' => $item->description ?? '',
                'parent' => $item->menu_item_parent ? (int) $item->menu_item_parent : 0,
                'type' => $item->type,
                'type_label' => $item->type_label,
                'attr_title' => $item->attr_title ?? '',
            ];
        }

        return $result;
    }

    public static function export_site_settings() {
        // Pobierz opcje ze strony
        return [
            'site_name' => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'site_url' => get_bloginfo('url'),
            'admin_email' => get_option('admin_email'),
        ];
    }

    private static function get_page_data($post, $lang = null) {
        $featured_media_id = get_post_thumbnail_id($post->ID);
        $featured_image = null;

        if ($featured_media_id) {
            $featured_image = [
                'source_url' => wp_get_attachment_url($featured_media_id),
                'alt_text' => get_post_meta($featured_media_id, '_wp_attachment_image_alt', true),
            ];
        }

        $page_data = [
            'id' => $post->ID,
            'title' => [
                'rendered' => $post->post_title,
            ],
            'content' => [
                'rendered' => apply_filters('the_content', $post->post_content),
            ],
            'excerpt' => [
                'rendered' => $post->post_excerpt ?: wp_strip_all_tags($post->post_content),
            ],
            'slug' => $post->post_name,
            'date' => $post->post_date_gmt,
        ];

        // Dodaj featured image jeśli istnieje
        if ($featured_image) {
            $page_data['featured_image'] = $featured_image;
        }

        // Dodaj ACF jeśli jest dostępny
        if (function_exists('get_field')) {
            $acf_data = get_fields($post->ID);
            if ($acf_data) {
                $page_data['acf'] = $acf_data;
            }
        }

        return $page_data;
    }

    private static function get_post_data($post, $lang = null) {
        $featured_media_id = get_post_thumbnail_id($post->ID);
        $featured_image = null;

        if ($featured_media_id) {
            $featured_image = [
                'source_url' => wp_get_attachment_url($featured_media_id),
                'alt_text' => get_post_meta($featured_media_id, '_wp_attachment_image_alt', true),
            ];
        }

        $post_data = [
            'id' => $post->ID,
            'title' => [
                'rendered' => $post->post_title,
            ],
            'content' => [
                'rendered' => apply_filters('the_content', $post->post_content),
            ],
            'excerpt' => [
                'rendered' => $post->post_excerpt ?: wp_strip_all_tags($post->post_content),
            ],
            'slug' => $post->post_name,
            'date' => $post->post_date_gmt,
            'featured_media' => $featured_media_id,
        ];

        // Dodaj featured image
        if ($featured_image) {
            $post_data['featured_image'] = $featured_image;
        }

        // Dodaj kategorie
        $categories = wp_get_post_categories($post->ID, ['fields' => 'ids']);
        if ($categories) {
            $post_data['categories'] = $categories;
        }

        // Dodaj tagi
        $tags = wp_get_post_tags($post->ID, ['fields' => 'ids']);
        if ($tags) {
            $post_data['tags'] = $tags;
        }

        // Dodaj ACF jeśli jest dostępny
        if (function_exists('get_field')) {
            $acf_data = get_fields($post->ID);
            if ($acf_data) {
                $post_data['acf'] = $acf_data;
            }
        }

        return $post_data;
    }

    public static function generate_all_json_files() {
        $result = [];

        try {
            // Eksportuj języki
            $languages = self::export_languages();
            $result['languages'] = [
                'success' => true,
                'count' => count($languages),
                'data' => $languages,
            ];

            // Dla każdego języka eksportuj dane
            foreach ($languages as $lang) {
                $lang_slug = $lang['slug'];
                $lang_dir = [
                    'pages' => self::export_pages($lang_slug),
                    'posts' => self::export_posts('post', $lang_slug),
                    'projects' => self::export_projects_recommended($lang_slug),
                    'sections' => self::export_sections($lang_slug),
                    'menu' => self::export_menu('main', $lang_slug),
                    'siteSettings' => self::export_site_settings(),
                ];

                $result[$lang_slug] = [
                    'success' => true,
                    'data' => $lang_dir,
                ];
            }

            // Globalne ustawienia
            $result['siteSettings'] = [
                'success' => true,
                'data' => self::export_site_settings(),
            ];

            return $result;

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
