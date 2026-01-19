import Logger from '../../support/logger.js';
import path from 'path';
import fs from 'fs';
import {
    MOD_REWRITE_HEADERS_REGEX,
    MOD_REWRITE_REWRITE_REGEX,
    DEFAULT_TEMPLATE_FILES_TO_COPY,
    SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE,
} from '../../support/common.js';
import FileTransferHelper from '../../support/file-helper.js';
import ContentFileHelper from '../../support/content-helper.js';

class TemplateSteps {
    _projectName = '';
    _langs = [];
    _locales = [];
    _cwd = process.cwd();
    _defaultLang = '';
    _isSingleLang = true;

    constructor(projectName, langs, locales) {
        this._projectName = projectName;
        this._langs = langs;
        this._locales = locales;
        this._defaultLang = langs[0];

        if (langs.length > 1) {
            this._isSingleLang = false;
        }

        Logger.info('Moving Template files');
    }

    createTemplateFiles() {
        this._moveDefaultTemplateFiles();
        this._applySpecificTemplateFiles();
    }

    _moveDefaultTemplateFiles() {
        Logger.info('Moving default template files');

        DEFAULT_TEMPLATE_FILES_TO_COPY.forEach((file) => {
            FileTransferHelper.copyFileOrFolder(
                path.join(this._cwd, file.template),
                path.join(this._cwd, `${this._projectName}/${file.target}`),
                file.isFolder,
            );
        });

        Logger.success('Successfully moved default template files');
    }

    _applySpecificTemplateFiles() {
        Logger.info('Generating template files for Frontend and CMS');

        this._createFrontendTemplateFiles();
        this._createKirbyCMSTemplateFiles();

        Logger.success(
            'Successfully generated template files for Frontend and CMS',
        );
    }

    _createFrontendTemplateFiles() {
        this._createTemplateFiles(
            path.join(
                this._cwd,
                `${this._projectName}/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
            ),
            path.join(
                this._cwd,
                `${this._projectName}/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
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

    _createKirbyCMSTemplateFiles() {
        this._createTemplateFiles(
            path.join(
                this._cwd,
                `${this._projectName}/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
            ),
            path.join(
                this._cwd,
                `${this._projectName}/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
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

    _createTemplateFiles(
        singleLanguageFolderTemplateFiles,
        multipleLanguageFolderTemplateFiles,
        transformFiles = (_) => [],
    ) {
        if (this._isSingleLang) {
            FileTransferHelper.removeFileOrFolder(
                multipleLanguageFolderTemplateFiles,
                true,
            );

            const filesToMove = [];
            FileTransferHelper.listTree(
                singleLanguageFolderTemplateFiles,
                filesToMove,
            );

            filesToMove.forEach((file, index) => {
                ContentFileHelper.replaceInFile(
                    file,
                    /\{\{(lang)\}\}/g,
                    this._defaultLang,
                );
            });

            const destFolders = transformFiles(filesToMove);

            filesToMove.forEach((file, index) => {
                const destFolder = destFolders[index];
                FileTransferHelper.copyFileOrFolder(file, destFolder);
            });

            FileTransferHelper.removeFileOrFolder(
                singleLanguageFolderTemplateFiles,
                true,
            );
        } else {
            FileTransferHelper.removeFileOrFolder(
                singleLanguageFolderTemplateFiles,
                true,
            );

            // TODO implement multi-language folder handling
        }
    }
}

export default TemplateSteps;
