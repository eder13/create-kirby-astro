import Language from '../types/language';
import type { HTMLText } from '../types/misc/html-text';
import EnvironmentHelper from './EnvironmentHelper';
import { HTMLHelper } from './HTMLHelper';
import { getDefaultHeaders, isJSON } from '../utils/DataFetchingUtils';

export type Locale = {
    LC_ALL: string;
};

type LanguageEntry = {
    code: string;
    default: boolean;
    direction: string;
    locale: Locale;
    name: string;
    translations: Record<string, HTMLText>;
};

export default class TranslationHelper {
    private static _instance: TranslationHelper | null = null;

    private constructor(
        private translations: {
            {{availableLanguagesTranslations}}
        },
    ) {}

    static async getInstance() {
        if (!this._instance) {
            const response = await fetch(EnvironmentHelper.getMessagesURL(), {
                headers: getDefaultHeaders(),
            });

            let isError = false;
            let translations = undefined;

            if (response.ok) {
                const text = await response.text();
                const json = isJSON(text);

                if (json) {
                    translations = json;
                } else {
                    isError = true;
                }
            } else {
                isError = true;
            }

            if (isError) {
                console.error(
                    'TranslationHelper: Could not fetch translations.',
                );
                console.trace();
            }

            this._instance = new TranslationHelper(translations);
        }

        return this._instance;
    }

    getCurrentAstroLanguage(pathname: string) {
        {{getCurrentAstroLanguageChecks}}

        return null;
    }

    getLanguageOptions() {
        return Object.keys(this.translations);
    }

    getTranslation(key: string, pathname: string) {
        const language = this.getCurrentAstroLanguage(pathname);
        if (!language) {
            return 'Language from URL not found';
        }

        const translationsOfLanguage = this.translations[language].translations;

        if (key in translationsOfLanguage) {
            return HTMLHelper.escapeXSSHtml(translationsOfLanguage[key]);
        } else {
            return key;
        }
    }

    getLocales() {
        return Object.values(this.translations).map((entry) => entry.locale);
    }
}
