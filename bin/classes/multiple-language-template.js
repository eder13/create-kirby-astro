import GenericLanguageTemplate from './generic-language-template.js';

class MultipleLanguageTemplate extends GenericLanguageTemplate {
    constructor(_projectName, _langs, _locales) {
        super(_projectName, _langs, _locales);
    }

    bootstrapTemplate() {
        Logger.info('Bootstrapping multiple language template');
    }
}

export default MultipleLanguageTemplate;
