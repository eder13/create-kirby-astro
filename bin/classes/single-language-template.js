import CLIHelper from '../support/cli-helper.js';
import { SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE } from '../support/common.js';
import Logger from '../support/logger.js';
import GenericLanguageTemplate from './generic-language-template.js';

class SingleLanguageTemplate extends GenericLanguageTemplate {
    constructor(_projectName, _langs, _locales) {
        super(_projectName, _langs, _locales);
    }

    bootstrapTemplate() {
        CLIHelper.isVerboseModeEnabled() &&
            Logger.info('Bootstrapping single language template');
        this._bootstrapFrontendTemplateFiles(
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage,
        );
        this._bootstrapKirbyTemplateFiles(
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage,
        );
        CLIHelper.isVerboseModeEnabled() &&
            Logger.success(
                'Successfully Bootstrapped single language template',
            );
    }
}

export default SingleLanguageTemplate;
