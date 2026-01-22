import locales from 'i18n-locales' with { type: 'json' };
import localeCodes from 'locale-codes';

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

export const getLocalesByLang = (lang) => {
    return localeCodes.all.filter(
        (localCode) => localCode['iso639-1'] === lang,
    );
};
