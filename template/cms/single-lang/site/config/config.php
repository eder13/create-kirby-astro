<?php

$CUSTOM_ROUTES = [
    'build' => 'ssg/deploy',
    'after_build' => 'ssg/deploy/after_deployment_steps',
    'status_build' => 'ssg/deploy/status'
];

require_once(__DIR__ . '/custom/build.php');
require_once(__DIR__ . '/custom/proxy.php');
require_once(__DIR__ . '/custom/move_page.php');
require_once(__DIR__ . '/../helpers/url_utils.php');

return [
    'debug' => true,
    'panel.install' => false,
    'sitemap.ignore' => ['error'],
    'panel' => [
        'js' => 'assets/js/custom/panel.js',
        'css' => 'assets/css/custom/panel.css',
    ],
    'content' => [
        'uuid' => false
    ],
    'hooks' => [
      'route:before' => function ($route, $path, $method) use ($CUSTOM_ROUTES) {
          return proxy($route, $path, $method, $CUSTOM_ROUTES);
      },
      'page.create:after' => function ($page) {
          move_page($page);
      },
    ],
    'routes' => [
        [
            'pattern' => $CUSTOM_ROUTES['build'],
            'action'  => function () {
                return build();
            },
            "method" => "POST"
        ],
        [
            'pattern' => $CUSTOM_ROUTES['status_build'],
            'action' => function () {
                return status();
            },
            'method' => "GET"
        ],
        [
            'pattern' => $CUSTOM_ROUTES['after_build'],
            'action' => function () {
                return after_build();
            },
            'method' => "POST"
        ],
        [
            'pattern' => 'sitemap.xml',
            'action'  => function() {
                $pages = site()->pages()->index();
                $ignore = kirby()->option('sitemap.ignore', ['error']);
                $content = snippet('sitemap', compact('pages', 'ignore'), true);
                return new Kirby\Cms\Response($content, 'application/xml');
            }
        ],
        [
            'pattern' => 'robots.txt',
            'action'  => function() {
                $base = rtrim(removeCmsFromUrl(site()->url(), true), '/');
                $content = "User-agent: *\nDisallow: /de/error\nDisallow: /cms/\nDisallow: /frontend/\nDisallow: /tmp/\nDisallow: /_astro/\nAllow: /\n\nSitemap: " . $base . "/sitemap.xml\n";
                return new Kirby\Cms\Response($content, 'text/plain');
            }
        ]
    ]
];

