<?php
require_once __DIR__ . '/../helpers/url_utils.php';
echo '<?xml version="1.0" encoding="utf-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <?php foreach ($pages as $p): ?>
        <?php
            // skip entries in $ignore
            if (in_array($p->uri(), $ignore)) continue;

            // skip the CP page overview (URL path ends with /cp or /cp/)
            $path = parse_url($p->url(), PHP_URL_PATH) ?: '';
            if (preg_match('#/cp/?$#', $path)) continue;

            // skip other languages
            $langRegex = isset($lang) ? '#^/' . preg_quote($lang, '#') . '(/|$)#' : null;
            if (!(preg_match($langRegex, $path))) continue;

            if (preg_match('#/?cp(/|/.*)$#', $path) && $p->isListed()) {
                $priority = 0.5;
            } else {
                $priority = ($p->isHomePage()) ? 1 : number_format(0.5 / $p->depth(), 1);
            }
        ?>
        <url>
            <loc><?= html(removeCmsFromUrl($p->url())) ?></loc>
            <lastmod><?= $p->modified('c', 'date') ?></lastmod>
            <priority><?= $priority ?></priority>
        </url>
    <?php endforeach ?>
</urlset>
