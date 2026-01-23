export const MOD_REWRITE_HEADERS_REGEX = /(<IfModule\s+mod_headers\.c>\s*\n)/i;
export const MOD_REWRITE_REWRITE_REGEX = /(<IfModule\s+mod_rewrite\.c>\s*\n)/i;

export const SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE = {
    singleLanguage: 'single-lang',
    multipleLanguage: 'multiple-lang',
};

export const LANG_PHP_TEMPLATE_FILE = '/cms/site/languages/lang.php';

export const DEFAULT_TEMPLATE_FILES_TO_COPY = [
    // Astro Files
    {
        template: 'template/frontend/logs/logs.txt',
        isFolder: false,
        target: `frontend/logs`,
    },
    {
        template: 'template/frontend/src',
        isFolder: true,
        target: `frontend/src`,
    },
    {
        template: 'template/frontend/.prettierrc.mjs',
        isFolder: false,
        target: `frontend/`,
    },
    {
        template: 'template/frontend/eslint.config.cjs',
        isFolder: false,
        target: `frontend/`,
    },
    {
        template: 'template/frontend/postcss.config.cjs',
        isFolder: false,
        target: `frontend/`,
    },
    {
        template: `template/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
        isFolder: true,
        target: `frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
    },
    {
        template: `template/frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
        isFolder: true,
        target: `frontend/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
    },

    // Kirby CMS Files
    {
        template: 'template/cms/assets',
        isFolder: true,
        target: 'cms/assets',
    },
    {
        template: 'template/cms/content',
        isFolder: true,
        target: 'cms/content',
    },
    {
        template: 'template/cms/site',
        isFolder: true,
        target: 'cms/site',
    },
    {
        template: `template/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
        isFolder: true,
        target: `cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.singleLanguage}`,
    },
    {
        template: `template/cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
        isFolder: true,
        target: `cms/${SPECIFIC_SETUP_FOLDERS_AND_FILES_BASED_ON_ARGS_TEMPLATE.multipleLanguage}`,
    },
];
