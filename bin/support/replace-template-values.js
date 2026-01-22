import localeCodes from 'locale-codes';
import { getLocalesByLang } from '../lang/lang.js';
import FileTransferHelper from './file-helper.js';

export const FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE = [
    // Astro Files
    {
        fileName: 'helpers/TranslationHelper.ts',
        regExs: [
            /\{\{(availableLanguagesTranslations)\}\}/g,
            /\{\{(getCurrentAstroLanguageChecks)\}\}/g,
        ],
        getReplacement: function (langs, _, __, index) {
            if (index === 0) {
                return langs
                    .map((lang) => {
                        return `[Language.${lang.toUpperCase()}]: LanguageEntry;`;
                    })
                    .join('\n');
            }

            if (index === 1) {
                return langs
                    .map((lang) => {
                        return `
                        if (pathname.startsWith('/' + Language.${lang.toUpperCase()})) {
                            return Language.${lang.toUpperCase()};
                        }
                    `;
                    })
                    .join('\n');
            }
        },
    },
    {
        fileName: 'types/language.ts',
        regExs: [/\{\{(languagesTypes)\}\}/g],
        getReplacement: (langs) => {
            return `
            {
                ${langs
                    .map((lang) => {
                        return `${lang.toUpperCase()} = '${lang}',`;
                    })
                    .join('\n')}
            }
            `;
        },
    },
    {
        fileName: 'pages/index.astro',
        regExs: [/\{\{(defaultLang)\}\}/g],
        getReplacement: (_, defaultLang) => {
            return defaultLang;
        },
    },
    {
        fileName: 'error.astro',
        regExs: [/\{\{(lang)\}\}/g],
        getReplacement: (_, defaultLang) => {
            return defaultLang;
        },
    },
    {
        fileName: 'Dropdown.astro',
        regExs: [/\{\{(lang)\}\}/g],
        getReplacement: (_, defaultLang) => {
            return defaultLang;
        },
    },
    {
        fileName: 'Layout.astro',
        regExs: [/\{\{(lang)\}\}/g],
        getReplacement: (_, defaultLang) => {
            return defaultLang;
        },
    },
    {
        fileName: 'pages/blogs.astro',
        regExs: [/\{\{(lang)\}\}/g],
        getReplacement: (_, defaultLang) => {
            return defaultLang;
        },
    },

    // Kirby Files
    {
        fileName: 'site/config/config.php',
        regExs: [/\{\{(disallowErrorLanguagePages)\}\}/g],
        getReplacement: function (langs) {
            return langs.map((lang) => `Disallow: /${lang}/error\n`).join('');
        },
    },
    {
        fileName: 'site/snippets/sitemap-index.php',
        regExs: [
            /\{\{(sitemapLanguages)\}\}/g,
            /\{\{(lastModifiedLanguageChecks)\}\}/g,
        ],
        getReplacement: function (langs, _, __, index) {
            if (index === 0) {
                const bodyCode = langs
                    .map(
                        (lang) =>
                            `"${lang}" => 0${lang === langs[langs.length - 1] ? '' : ','}`,
                    )
                    .join('');
                return `$latestLang = array(${bodyCode});`;
            }

            const codeTemplatePHP = (lang) => `
                if (preg_match('#^.*\/${lang}(\/|\/.*)?#', $p->url())) {
                    $modified = (int)strtotime($p->modified('c'));
                    if ($modified > $latestLang["${lang}"]) {
                        $latestLang["${lang}"] = $modified;
                    }
                }
            `;

            return langs.map((lang) => codeTemplatePHP(lang)).join('\n');
        },
    },
    {
        fileName: 'site/languages/lang.php',
        regExs: [
            /\{\{(default)\}\}/g,
            /\{\{(locale)\}\}/g,
            /\{\{(name)\}\}/g,
            /\{\{(code)\}\}/g,
        ],
        getReplacement: function (
            langs,
            defaultLang,
            locales,
            index,
            filePathOrPaths,
        ) {
            return filePathOrPaths.map((filePath) => {
                const currentLang = /\/([a-z]{2})\.php/.exec(filePath)[1];

                if (index === 0) {
                    return currentLang === defaultLang ? 'true' : 'false';
                }

                if (index === 1) {
                    const foundLocale = getCurrentLocale(locales, currentLang);
                    return foundLocale.replace('-', '_');
                }

                if (index === 2) {
                    const foundLocale = getCurrentLocale(locales, currentLang);
                    return localeCodes.getByTag(foundLocale).name;
                }

                if (index === 3) {
                    return currentLang;
                }
            });
        },
        createFile: (langs, _, __, file) => {
            return langs.map((lang) => {
                const strippedFileSplit = file.split('/');
                const pathWithoutFile = strippedFileSplit
                    .slice(0, strippedFileSplit.length - 1)
                    .join('/');

                const fullDestPath = `${pathWithoutFile}/${lang}.php`;

                if (FileTransferHelper.fileOrFolderExists(fullDestPath)) {
                    return fullDestPath;
                }

                FileTransferHelper.createFileOrFolder(fullDestPath, false);
                FileTransferHelper.copyFileToFile(file, fullDestPath);

                return fullDestPath;
            });
        },
    },
];

function getCurrentLocale(locales, currentLang) {
    const availableLocalesForCurrentLang = getLocalesByLang(currentLang);

    const foundLocale = locales.find((locale) => {
        return availableLocalesForCurrentLang.find((availableLocale) => {
            return locale === availableLocale.tag;
        });
    });

    return foundLocale;
}
