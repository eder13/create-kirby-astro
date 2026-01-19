class InitProjectSteps {
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

        Logger.info('Init Project Files');
    }
}
