import GenericLanguageTemplate from './generic-language-template.js';
import Logger from '../support/logger.js';
import { SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE } from '../support/common.js';
import { SUPPORTED_LANGS } from '../lang/lang.js';
import FileTransferHelper from '../support/file-helper.js';
import path from 'path';
import CLIHelper from '../support/cli-helper.js';

class MultipleLanguageTemplate extends GenericLanguageTemplate {
    constructor(_projectName, _langs, _locales) {
        super(_projectName, _langs, _locales);
    }

    bootstrapTemplate() {
        CLIHelper.isVerboseModeEnabled() &&
            Logger.info('Bootstrapping multiple language template');
        this._bootstrapFrontendTemplateFiles(
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage,
        );
        this._cleanUpFrontendUnusedTemplateFilesCopiedLanguages();
        this._bootstrapKirbyTemplateFiles(
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage,
        );
        CLIHelper.isVerboseModeEnabled() &&
            Logger.success(
                'Successfully Bootstrapped multiple language template',
            );
    }

    _cleanUpFrontendUnusedTemplateFilesCopiedLanguages() {
        CLIHelper.isVerboseModeEnabled() &&
            Logger.info(
                'Cleaning up unused template files for copied languages for Frontend',
            );

        SUPPORTED_LANGS.forEach((lang) => {
            if (!this._langs.includes(lang)) {
                // Remove unused template files for this language
                FileTransferHelper.removeFileOrFolder(
                    path.join(
                        this._cwd,
                        `${this._projectName}/frontend/src/pages/${lang}`,
                    ),
                    true,
                );
            }
        });

        CLIHelper.isVerboseModeEnabled() &&
            Logger.success(
                'Successfully cleaned up unused template files for copied languages',
            );
    }
}

export default MultipleLanguageTemplate;
