import GenericLanguageTemplate from './generic-language-template.js';
import Logger from '../support/logger.js';
import { SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE } from '../support/common.js';

class MultipleLanguageTemplate extends GenericLanguageTemplate {
    constructor(_projectName, _langs, _locales) {
        super(_projectName, _langs, _locales);
    }

    bootstrapTemplate() {
        Logger.info('Bootstrapping multiple language template');
        this._bootstrapFrontendTemplateFiles(
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage,
        );
        this._bootstrapKirbyTemplateFiles(
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage,
        );
        this._adjustHtAccessFile();
        Logger.success('Successfully Bootstrapped multiple language template');
    }

    _adjustHtAccessFile() {}
}

export default MultipleLanguageTemplate;
