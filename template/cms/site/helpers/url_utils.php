<?php
function removeCmsFromUrl(string $url, bool $removeLanguage = false): string {
    $parts = parse_url($url);
    if ($parts === false) return $url;

    $scheme = isset($parts['scheme']) ? $parts['scheme'] . '://' : '';
    $host   = $parts['host'] ?? '';
    $port   = isset($parts['port']) ? ':' . $parts['port'] : '';
    $path   = $parts['path'] ?? '';

    // entfernt nur ein führendes /cms oder /cms/
    $path = preg_replace('#^/cms(?=/|$)#', '', $path);

    if ($removeLanguage) {
        // entfernt ein führendes Sprach-Tag wie /de oder /en oder /de-DE oder /de_DE
        // Pattern: two-letter code optionally followed by -XX or _XX
        $path = preg_replace('#^/(?:[a-z]{2}(?:[-_][A-Za-z]{2})?)(?=/|$)#', '', $path);
    }

    $query  = isset($parts['query']) ? '?' . $parts['query'] : '';
    $frag   = isset($parts['fragment']) ? '#' . $parts['fragment'] : '';

    if ($path === '') $path = '/';

    return $scheme . $host . $port . $path . $query . $frag;
}
?>
