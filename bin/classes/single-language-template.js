import { SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE } from '../support/common.js';
import Logger from '../support/logger.js';
import GenericLanguageTemplate from './generic-language-template.js';
import path from 'path';

class SingleLanguageTemplate extends GenericLanguageTemplate {
    constructor(_projectName, _langs, _locales) {
        super(_projectName, _langs, _locales);
    }

    bootstrapTemplate() {
        Logger.info('Bootstrapping single language template');
        this._bootstrapFrontendTemplateFiles();
        this._bootstrapKirbyTemplateFiles();
        Logger.success('Successfully Bootstrapped single language template');
    }

    _bootstrapFrontendTemplateFiles() {
        this._createTemplateFiles(
            path.join(
                this._cwd,
                `${this._projectName}/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
            ),
            (filesToMove) => {
                return filesToMove.map((file) => {
                    const fileSplit = file
                        .replace(
                            `frontend\/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
                            'frontend/src',
                        )
                        .split('/');

                    return fileSplit.slice(0, fileSplit.length - 1).join('/');
                });
            },
        );
    }

    _bootstrapKirbyTemplateFiles() {
        this._createTemplateFiles(
            path.join(
                this._cwd,
                `${this._projectName}/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
            ),
            (filesToMove) => {
                return filesToMove.map((file) => {
                    const fileSplit = file
                        .split(
                            `/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
                        )[1]
                        .split('/');

                    return `${this._projectName}/cms${fileSplit.slice(0, fileSplit.length - 1).join('/')}`;
                });
            },
        );
    }
}

export default SingleLanguageTemplate;
