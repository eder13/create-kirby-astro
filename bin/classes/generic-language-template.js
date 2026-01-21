import {
    DEFAULT_TEMPLATE_FILES_TO_COPY,
    SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE,
} from '../support/common.js';
import FileTransferHelper from '../support/file-helper.js';
import path from 'path';
import Logger from '../support/logger.js';
import CommonFiles from './common-files.js';
import ContentFileHelper from '../support/content-helper.js';
import {
    FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE,
    replacementsMapper,
} from '../support/replace-template-values.js';

class GenericLanguageTemplate {
    _projectName = '';
    _langs = [];
    _locales = [];
    _cwd = process.cwd();
    _defaultLang = '';

    constructor(_projectName, _langs, _locales) {
        this._projectName = _projectName;
        this._langs = _langs;
        this._locales = _locales;
        this._defaultLang = _langs[0];
    }

    createFiles() {
        this._moveDefaultTemplateFiles();
        new CommonFiles(this._projectName, this._langs, this._locales);
    }

    bootstrapTemplate() {}

    _moveDefaultTemplateFiles() {
        Logger.info('Moving default template files');

        DEFAULT_TEMPLATE_FILES_TO_COPY.filter(
            (file) =>
                !file.template.includes(
                    this._isSingleLang
                        ? SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage
                        : SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage,
                ),
        ).forEach((file) => {
            FileTransferHelper.copyFileOrFolder(
                path.join(this._cwd, file.template),
                path.join(this._cwd, `${this._projectName}/${file.target}`),
                file.isFolder,
            );
        });

        Logger.success('Successfully moved default template files');
    }

    _createTemplateFiles(
        selectedFolderTemplateFiles,
        transformFiles = (_) => [],
    ) {
        const filesToMove = [];
        FileTransferHelper.listTree(selectedFolderTemplateFiles, filesToMove);

        filesToMove.forEach((file) => {
            const templateFile = FILES_WITH_TEMPLATE_STRINGS_TO_REPLACE.find(
                (val) => file.endsWith(val.fileName),
            );

            if (templateFile) {
                templateFile.regExs.forEach((regEx, index) => {
                    const replacements = replacementsMapper[
                        templateFile.fileName
                    ](this._langs, this._defaultLang, index);
                    ContentFileHelper.replaceInFile(file, regEx, replacements);
                });
            }
        });

        const destFolders = transformFiles(filesToMove);

        filesToMove.forEach((file, index) => {
            const destFolder = destFolders[index];
            FileTransferHelper.copyFileOrFolder(file, destFolder);
        });
    }
}

export default GenericLanguageTemplate;
