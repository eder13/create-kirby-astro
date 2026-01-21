<?php
echo '<?xml version="1.0" encoding="UTF-8"?>';
require_once __DIR__ . '/../helpers/url_utils.php';
{{sitemapLanguages}}

foreach ($pages as $p) {
    // skip entries in $ignore
    if (in_array($p->uri(), $ignore)) continue;

    $path = parse_url($p->url(), PHP_URL_PATH) ?: '';
    if (preg_match('#/cp/?$#', $path)) continue;
    if (preg_match('#/?cp(/|/.*)$#', $path) && $p->isListed()) continue;

    // Last modified date checks
    {{lastModifiedLanguageChecks}}
}
?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <?php
    $base = rtrim(removeCmsFromUrl(site()->url(), true), '/');

    foreach ($latestLang as $lang => $modified): 
        $loc = $base . '/sitemap-' . $lang . '.xml';
        $lastmod = date('Y-m-d', $modified);
    ?>
    <sitemap>
        <loc><?= html($loc) ?></loc>
        <lastmod><?= $lastmod ?></lastmod>
    </sitemap>
    <?php endforeach; ?>
</sitemapindex>
