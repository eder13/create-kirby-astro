import Logger from '../support/logger.js';
import path from 'path';
import {
    MOD_REWRITE_HEADERS_REGEX,
    MOD_REWRITE_REWRITE_REGEX,
} from '../support/common.js';
import ContentFileHelper from '../support/content-helper.js';
import FileTransferHelper from '../support/file-helper.js';

class CommonFiles {
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
        this._defaultLang = langs?.[0];

        if (langs?.length > 1) {
            this._isSingleLang = false;
        }

        this._init();
    }

    _init() {
        this._createHtaccessFile();
        this._addScriptsPackageJson();
        this._createEnvFile();
        this._createGitIgnoreFile();
    }

    _createHtaccessFile() {
        Logger.info('Creating .htaccess file');

        const htAccessFile = path.join(
            this._cwd,
            `${this._projectName}/cms/.htaccess`,
        );

        if (!FileTransferHelper.fileOrFolderExists(htAccessFile)) {
            Logger.error('.htaccess file not found');
            process.exit(1);
        }

        if (this._isSingleLang) {
            // without languages redirects
            this._createCommonHtaccessConfigHeaders(htAccessFile);
            this._createCommonHtaccessConfigRewrite(htAccessFile);
        } else {
            this._createCommonHtaccessConfigRewrite(htAccessFile);
            this._createCommonHtaccessConfigHeaders(htAccessFile);
            this._createDefaultLanguageRedirect(htAccessFile);
            this._createLanguageRedirects(htAccessFile);
            this._cleanUpStrings(htAccessFile);
        }

        FileTransferHelper.renameFileOrFolder(
            htAccessFile,
            path.join(this._cwd, `${this._projectName}/.htaccess`),
        );

        Logger.success('Successfully created .htaccess file and moved to root');
    }

    _createCommonHtaccessConfigHeaders(htAccessFile = '') {
        this._addCommonHtaccessContent(
            htAccessFile,
            `htaccess-common/.htaccess-common-mod_headers`,
            MOD_REWRITE_HEADERS_REGEX,
            '<IfModule mod_headers.c>\n',
        );
    }

    _createCommonHtaccessConfigRewrite(htAccessFile = '') {
        this._addCommonHtaccessContent(
            htAccessFile,
            `htaccess-common/.htaccess-common-mod_rewrite`,
            MOD_REWRITE_REWRITE_REGEX,
            '<IfModule mod_rewrite.c>\n',
        );
    }

    _createLanguageRedirects(htAccessFile = '') {
        this._addCommonHtaccessContent(
            htAccessFile,
            `htaccess-template-language/.htaccess-template-language-mod_rewrite`,
            MOD_REWRITE_REWRITE_REGEX,
            '<IfModule mod_rewrite.c>\n',
            (content) => {
                let finalContent = content;

                for (let i = 0; i < this._langs.length; i++) {
                    const replacedContentWithLanguage = finalContent
                        .replace(/\{\{lang\}\}/g, this._langs[i])
                        .replace(
                            /\{\{langs\}\}/g,
                            this._langs.map((lang) => `/${lang}`).join('|'),
                        );
                    finalContent = replacedContentWithLanguage;
                    if (i < this._langs.length - 1) {
                        finalContent += content;
                    }
                }

                return finalContent;
            },
        );
    }

    _createDefaultLanguageRedirect(htAccessFile = '') {
        this._addCommonHtaccessContent(
            htAccessFile,
            `htaccess-template-language/.htaccess-template-language-fallback-mod_rewrite`,
            MOD_REWRITE_REWRITE_REGEX,
            '<IfModule mod_rewrite.c>\n',
            (content) => {
                return content
                    .replace(/\{\{defaultLang\}\}/g, this._defaultLang)
                    .replace(
                        /\{\{langs\}\}/g,
                        this._langs.map((lang) => `/${lang}`).join('|'),
                    );
            },
        );
    }

    _cleanUpStrings(htAccessFile = '') {
        ContentFileHelper.replaceInFile(
            htAccessFile,
            /<IfModule mod_rewrite.c>\n/g,
            ' ',
        );

        const fileContent = ContentFileHelper.readFile(htAccessFile);
        ContentFileHelper.writeFile(
            htAccessFile,
            '<IfModule mod_rewrite.c>\n' + fileContent,
        );
    }

    _addCommonHtaccessContent(
        htAccessFile,
        htAccessPathToBeAdded,
        RegEx,
        contentPrefix = '',
        replace = (content) => content,
    ) {
        const pathContentToBeAddedModRewrite = path.join(
            this._cwd,
            `template/htaccess/${htAccessPathToBeAdded}`,
        );
        let contentToBeAddedModRewrite = ContentFileHelper.readFile(
            pathContentToBeAddedModRewrite,
        );

        if (replace) {
            contentToBeAddedModRewrite = replace(contentToBeAddedModRewrite);
        }

        ContentFileHelper.replaceInFile(
            htAccessFile,
            RegEx,
            contentPrefix + contentToBeAddedModRewrite,
        );
    }

    _addScriptsPackageJson() {
        Logger.info('Adding scripts to package.json');

        const packageJsonFile = path.join(
            this._cwd,
            `${this._projectName}/frontend/package.json`,
        );

        const packageJson = JSON.parse(
            ContentFileHelper.readFile(packageJsonFile),
        );

        packageJson.scripts = {
            ...packageJson.scripts,
            astro: 'astro',
            dev: 'DOMAIN=localhost astro dev',
            build: "touch deployment.lock && (astro build >> logs/$(date +'%Y-%m-%d_%H-%M-%S')_deployment.log 2>&1 || (rm -rf dist/ && touch error.build || true)) && rm -rf deployment.lock &",
        };

        ContentFileHelper.writeFile(
            packageJsonFile,
            JSON.stringify(packageJson, null, 2),
        );

        Logger.success('Successfully added scripts to package.json');
    }

    _createEnvFile() {
        Logger.info('Creating .env file');

        const envFile = path.join(this._cwd, `${this._projectName}/.env`);
        const defaultContent =
            'DOMAIN="localhost"\nDEPLOYMENT_KEY="my-secret-password"\n# Add other env vars here\n';

        ContentFileHelper.writeFile(envFile, defaultContent, {
            encoding: 'utf-8',
            mode: 0o600,
        });

        Logger.success('Successfully created .env file and moved to root');
    }

    _createGitIgnoreFile() {
        Logger.info('Creating .gitignore file');

        const gitIgnoreTemplateFile = path.join(
            this._cwd,
            'template/gitignore-template',
        );

        const gitignoreFile = path.join(
            this._cwd,
            `${this._projectName}/.gitignore`,
        );

        FileTransferHelper.copyFileToFile(gitIgnoreTemplateFile, gitignoreFile);

        Logger.success(
            'Successfully created .gitignore file and moved to root',
        );
    }
}

export default CommonFiles;
