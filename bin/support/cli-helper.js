import { Arguments } from './arguments.js';
import {
    DEFAULT_LANGS,
    SUPPORTED_LANGS,
    getSupportedLocales,
} from '../lang/lang.js';

let isVerboseMode = false;

class CLIHelper {
    static hasValidArguments(args) {
        const argsCompare = Object.values(Arguments).map(
            (argument) => argument.arg,
        );

        const validSupportedArguments =
            args.length > 0 &&
            args.every((arg) => {
                return argsCompare.some((expectedArg) =>
                    arg.startsWith(expectedArg),
                );
            });

        isVerboseMode =
            this.getArgumentValue(args, Arguments.ARGUMENT_VERBOSE.arg) ===
            'true';

        // if langs is specified, locales has to be specified as well and vice versa
        const langsSpecified = this.getArgumentValue(
            args,
            Arguments.ARGUMENT_LANGS.arg,
        );
        const localesSpecified = this.getArgumentValue(
            args,
            Arguments.ARGUMENT_LOCALES.arg,
        );

        if (
            (!langsSpecified && localesSpecified) ||
            (langsSpecified && !localesSpecified)
        ) {
            return false;
        }

        // name has to be provided
        const name = CLIHelper.getArgumentValue(
            args,
            Arguments.ARGUMENT_NAME.arg,
        );
        if (!name) {
            return false;
        }
        return validSupportedArguments;
    }

    static getArgumentValue(args, wantedArg) {
        return args
            .find((arg) => arg.startsWith(wantedArg))
            ?.replace(wantedArg, '');
    }

    static isLanguageAndLocaleSupported(args) {
        const langs = this.getArgumentValue(args, Arguments.ARGUMENT_LANGS.arg);
        const locales = this.getArgumentValue(
            args,
            Arguments.ARGUMENT_LOCALES.arg,
        );

        const chosenLangs =
            langs?.length > 0
                ? langs
                      .replace(/^\[|\]$/g, '')
                      .split(',')
                      .map((lang) => lang.trim())
                : DEFAULT_LANGS;

        const chosenLocales =
            locales?.length > 0
                ? locales
                      .replace(/^\[|\]$/g, '')
                      .split(',')
                      .map((locale) => locale.trim())
                : ['en-US'];

        const chosenLocalesAndChosenLangsHaveSameLength =
            chosenLocales.length === chosenLangs.length;

        const isLanguageSupported = chosenLangs.some((lang) => {
            return SUPPORTED_LANGS.includes(lang);
        });

        const localeIsSupportedInLang = chosenLangs.every((lang, index) => {
            return getSupportedLocales().find((locale) => {
                return locale[lang]?.some(
                    (loc) => loc === chosenLocales[index],
                );
            });
        });

        if (
            (chosenLocalesAndChosenLangsHaveSameLength &&
                isLanguageSupported &&
                localeIsSupportedInLang) === false
        ) {
            return {
                isValid: false,
            };
        }

        return {
            isValid: true,
            chosenLangs,
            chosenLocales,
        };
    }

    static isVerboseModeEnabled() {
        return isVerboseMode;
    }
}

export default CLIHelper;
