import {
    DEFAULT_TEMPLATE_FILES_TO_COPY,
    LANG_PHP_TEMPLATE_FILE,
    SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE,
} from '../support/common.js';
import FileTransferHelper from '../support/file-helper.js';
import path from 'path';
import Logger from '../support/logger.js';
import CommonFiles from './common-files.js';
import ContentFileHelper from '../support/content-helper.js';
import { FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE } from '../support/replace-template-values.js';
import fs from 'fs';
import CLIHelper from '../support/cli-helper.js';

class GenericLanguageTemplate {
    _projectName = '';
    _langs = [];
    _locales = [];
    _cwd = process.cwd();
    _defaultLang = '';
    _isSingleLang = true;

    constructor(_projectName, _langs, _locales) {
        this._projectName = _projectName;
        this._langs = _langs;
        this._locales = _locales;
        this._defaultLang = _langs[0];
        if (this._langs.length > 1) {
            this._isSingleLang = false;
        }
    }

    createFiles() {
        this._moveDefaultTemplateFiles();
        new CommonFiles(this._projectName, this._langs, this._locales);
    }

    bootstrapTemplate() {}

    cleanupTemplate() {
        CLIHelper.isVerboseModeEnabled() &&
            Logger.info('Cleaning up unused template files');

        const singleLangPathFE = path.join(
            this._cwd,
            `${this._projectName}/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
        );
        const multipleLangPathFE = path.join(
            this._cwd,
            `${this._projectName}/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
        );
        const singleLangPathBE = path.join(
            this._cwd,
            `${this._projectName}/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
        );
        const multipleLangPathBE = path.join(
            this._cwd,
            `${this._projectName}/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
        );
        const langPhpTemplateFile = path.join(
            this._cwd,
            this._projectName + LANG_PHP_TEMPLATE_FILE,
        );

        FileTransferHelper.removeFileOrFolder(singleLangPathFE, true);
        FileTransferHelper.removeFileOrFolder(multipleLangPathFE, true);
        FileTransferHelper.removeFileOrFolder(singleLangPathBE, true);
        FileTransferHelper.removeFileOrFolder(multipleLangPathBE, true);
        FileTransferHelper.removeFileOrFolder(langPhpTemplateFile, false);

        CLIHelper.isVerboseModeEnabled() &&
            Logger.success('Successfully cleaned up unused template files');
    }

    _moveDefaultTemplateFiles() {
        CLIHelper.isVerboseModeEnabled() &&
            Logger.info(
                'Moving default template files for type ' +
                    (this._isSingleLang ? 'single' : 'multiple') +
                    ' language',
            );

        DEFAULT_TEMPLATE_FILES_TO_COPY.forEach((file) => {
            FileTransferHelper.copyFileOrFolder(
                path.join(this._cwd, file.template),
                path.join(this._cwd, `${this._projectName}/${file.target}`),
                file.isFolder,
            );
        });

        CLIHelper.isVerboseModeEnabled() &&
            Logger.success('Successfully moved default template files');
    }

    _bootstrapFrontendTemplateFiles(pathSingleOrMultiple) {
        this._createTemplateFiles(
            path.join(
                this._cwd,
                `${this._projectName}/frontend/${pathSingleOrMultiple}`,
            ),
            (filesToMove) => {
                return filesToMove.map((file) => {
                    const fileSplit = file
                        .replace(
                            `frontend\/${pathSingleOrMultiple}`,
                            'frontend/src',
                        )
                        .split('/');

                    return fileSplit.slice(0, fileSplit.length - 1).join('/');
                });
            },
        );
    }

    _bootstrapKirbyTemplateFiles(pathSingleOrMultiple) {
        this._createTemplateFiles(
            path.join(
                this._cwd,
                `${this._projectName}/cms/${pathSingleOrMultiple}`,
            ),
            (filesToMove) => {
                return filesToMove.map((file) => {
                    const fileSplit = file
                        .split(`/cms/${pathSingleOrMultiple}`)[1]
                        .split('/');

                    return `${this._cwd}/${this._projectName}/cms${fileSplit.slice(0, fileSplit.length - 1).join('/')}`;
                });
            },
        );
    }

    _createTemplateFiles(
        selectedFolderTemplateFiles,
        transformFiles = (_) => [],
    ) {
        const filesToMove = [];
        FileTransferHelper.listTree(selectedFolderTemplateFiles, filesToMove);

        filesToMove.forEach((file) => {
            const templateFile = FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE.find(
                (val) => file.includes(val.fileName),
            );

            if (templateFile) {
                templateFile.regExs.forEach((regEx, index) => {
                    let filePathOrPaths = file;

                    if (templateFile.createFile) {
                        filePathOrPaths = templateFile.createFile(
                            this._langs,
                            this._defaultLang,
                            index,
                            file,
                        );
                    }

                    const replacement = templateFile.getReplacement(
                        this._langs,
                        this._defaultLang,
                        this._locales,
                        index,
                        filePathOrPaths,
                    );

                    if (
                        Array.isArray(filePathOrPaths) &&
                        Array.isArray(replacement)
                    ) {
                        filePathOrPaths.forEach((path, index) => {
                            ContentFileHelper.replaceInFile(
                                path,
                                regEx,
                                replacement[index],
                            );
                        });

                        // move file out of folder template folder to destination
                        if (
                            templateFile.createFile &&
                            index === templateFile.regExs.length - 1
                        ) {
                            this._moveCreatedFiles(filePathOrPaths);
                        }
                    } else {
                        ContentFileHelper.replaceInFile(
                            filePathOrPaths,
                            regEx,
                            replacement,
                        );

                        // move file out of folder template folder to destination
                        if (
                            templateFile.createFile &&
                            index === templateFile.regExs.length - 1
                        ) {
                            this._moveCreatedFiles(filePathOrPaths);
                        }
                    }
                });
            }
        });

        const destFolders = transformFiles(filesToMove);

        filesToMove.forEach((file, index) => {
            const destFolder = destFolders[index];
            FileTransferHelper.copyFileOrFolder(
                path.isAbsolute(file) ? file : `${this._cwd}/${file}`,
                destFolder,
            );
        });
    }

    _moveCreatedFiles(filePathOrPaths) {
        let pathSingleOrMultiple =
            SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage;
        if (!this._isSingleLang) {
            pathSingleOrMultiple =
                SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage;
        }

        if (Array.isArray(filePathOrPaths)) {
            filePathOrPaths.forEach((filePath) => {
                this._moveFiles(filePath, pathSingleOrMultiple);
            });
        } else {
            this._moveFiles(filePathOrPaths, pathSingleOrMultiple);
        }
    }

    _moveFiles(filePath, pathSingleOrMultiple) {
        const newPath = filePath.replace(
            `/cms/${pathSingleOrMultiple}`,
            `/cms`,
        );

        const newPathFolder = path.isAbsolute(newPath)
            ? path.dirname(newPath)
            : path.dirname(`${this._cwd}/${newPath}`);
        if (!fs.existsSync(newPathFolder)) {
            fs.mkdirSync(newPathFolder, { recursive: true });
        }

        FileTransferHelper.renameFileOrFolder(
            path.isAbsolute(filePath) ? filePath : `${this._cwd}/${filePath}`,
            path.isAbsolute(newPath) ? newPath : `${this._cwd}/${newPath}`,
        );
    }
}

export default GenericLanguageTemplate;
