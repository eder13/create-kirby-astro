import locales from 'i18n-locales' with { type: 'json' };

export const SUPPORTED_LANGS = ['en', 'de', 'fr', 'es', 'it'];

export const DEFAULT_LANGS = ['en'];

export const DEFAULT_LOCALES = ['en-US'];

export const getSupportedLocales = () => {
    const langLocalesList = [];
    SUPPORTED_LANGS.forEach((lang) => {
        const langLocales = locales
            .filter((l) => l.startsWith(lang))
            .filter((l) => l.includes('-'));

        langLocalesList.push({
            [lang]: langLocales,
        });
    });

    return langLocalesList;
};
