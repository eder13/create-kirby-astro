export const FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE = [
    {
        fileName: 'config.php',
        regExs: [
            /\{\{(disallowErrorLanguagePages)\}\}/g,
            /\{\{(anotherVariable)\}\}/g,
        ],
    },
    {
        fileName: 'sitemap-index.php',
        regExs: [/\{\{(sitemapLanguages)\}\}/g],
    },
    {
        fileName: 'error.astro',
        regExs: [/\{\{(lang)\}\}/g],
    },
    {
        fileName: 'Layout.astro',
        regExs: [/\{\{(lang)\}\}/g],
    },
];

export const replacementsMapper = {
    [FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE[0].fileName]: function (
        langs,
        _,
        index,
    ) {
        /*
            Disallow: /de/error\nDisallow: /en/error\n ...
        */
        if (index === 0) {
            return langs.map((lang) => `Disallow: /${lang}/error\n`).join('');
        }

        return '';
    },
    [FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE[1].fileName]: function (langs) {
        /*
            $latestLang = array(
                "de" => 0,
                "en" => 0,
                ...
            );
        */
        const bodyCode = langs
            .map(
                (lang) =>
                    `"${lang}" => 0${lang === langs[langs.length - 1] ? '' : ','}`,
            )
            .join('');
        return `$latestLang = array(${bodyCode});`;
    },
    [FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE[2].fileName]: function (
        langs,
        defaultLang,
        index,
    ) {
        /*
            en OR de OR ...
        */
        return defaultLang;
    },
    [FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE[3].fileName]: function (
        langs,
        defaultLang,
        index,
    ) {
        /*
            en OR de OR ...
        */
        return defaultLang;
    },
};
