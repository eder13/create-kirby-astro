import Logger from '../../support/logger.js';
import SingleLanguageTemplate from '../../classes/single-language-template.js';
import MultipleLanguageTemplate from '../../classes/multiple-language-template.js';

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
        this._defaultLang = langs[0];

        if (langs.length > 1) {
            this._isSingleLang = false;
        }

        Logger.info('Moving Template files');
    }

    createTemplateFiles() {
        let TemplateClass;
        if (this._isSingleLang) {
            TemplateClass = SingleLanguageTemplate;
        } else {
            TemplateClass = MultipleLanguageTemplate;
        }

        const templateInstance = new TemplateClass(
            this._projectName,
            this._langs,
            this._locales,
        );

        templateInstance.createFiles();
        templateInstance.bootstrapTemplate();
    }
}

export default CommonFiles;
