import CLIHelper from '../../support/cli-helper.js';
import { Arguments } from '../../support/arguments.js';
import Logger from '../../support/logger.js';
import fs from 'fs';
import { execSync } from 'child_process';

const USAGE =
    'Usage: npx create-kirby-astro --name="<name>" --langs="[<language_code1>, <language_code2>, ...]" --locales="[<locale_code1>, <locale_code2>, ...]"';

class SetupSteps {
    _args = [''];
    _projectName = '';
    _langs = [];
    _locales = [];
    _cwd = process.cwd();
    _projectDir = '';

    constructor(args) {
        this._args = args;
    }

    get args() {
        return this._args;
    }

    set args(value) {
        this._args = value;
    }

    get projectName() {
        return this._projectName;
    }

    get langs() {
        return this._langs;
    }

    get locales() {
        return this._locales;
    }

    step1CheckArgs() {
        if (!CLIHelper.hasValidArguments(this._args)) {
            Logger.error('Invalid arguments');
            Logger.info(USAGE);
            process.exit(1);
        }

        const { chosenLangs, chosenLocales, isValid } =
            CLIHelper.isLanguageAndLocaleSupported(this._args);

        if (!isValid) {
            Logger.error('Unsupported languages or locales detected.');
            process.exit(1);
        }

        const name = CLIHelper.getArgumentValue(
            this._args,
            Arguments.ARGUMENT_NAME.arg,
        );

        Logger.info(
            `Building project with name=${name}, langs=[${chosenLangs.join(', ')}], locales=[${chosenLocales.join(', ')}]`,
        );

        this._projectName = name;
        this._langs = chosenLangs;
        this._locales = chosenLocales;
    }

    step2InstallingDependencies() {
        this._projectDir = `${this._cwd}/${this._projectName}`;
        if (fs.existsSync(this._projectDir)) {
            Logger.error(
                `Directory ${this._projectDir} already exists. Please choose a different project name.`,
            );
            process.exit(1);
        }

        fs.mkdirSync(this._projectDir);

        const frontendFolder = `${this._projectDir}/frontend`;
        fs.mkdirSync(frontendFolder);

        this.installNodeDependencies();
        this.installKirbyDependencies();
    }

    installNodeDependencies() {
        Logger.info('Installing Node Dependencies.');

        execSync(
            'npm create astro@latest . -- --template minimal --install --no-git',
            {
                stdio: 'inherit',
                cwd: `${this._projectDir}/frontend`,
            },
        );

        const additionalDependencies = [
            'autoprefixer',
            'cssnano',
            'marked',
            'typescript',
            'uuid',
            'universal-cookie',
            'gsap',
        ];

        const additionalDevDependencies = [
            '@types/marked',
            '@types/uuid',
            '@typescript-eslint/eslint-plugin',
            '@typescript-eslint/parser',
            'astro-eslint-parser',
            'eslint',
            'eslint-plugin-astro',
            'eslint-plugin-jsx-a11y',
            'prettier',
            'prettier-plugin-astro',
        ];

        execSync(`npm install ${additionalDependencies.join(' ')} --save`, {
            stdio: 'inherit',
            cwd: `${this._projectDir}/frontend`,
        });

        execSync(
            `npm install ${additionalDevDependencies.join(' ')} --save-dev`,
            {
                stdio: 'inherit',
                cwd: `${this._projectDir}/frontend`,
            },
        );

        Logger.success('Node Dependencies installed successfully.');
    }

    installKirbyDependencies() {
        Logger.info('Installing Kirby Dependencies.');

        const kirbyFolder = `${this._projectDir}/cms`;
        fs.mkdirSync(kirbyFolder);

        execSync(`composer create-project getkirby/plainkit .`, {
            stdio: 'inherit',
            cwd: `${this._projectDir}/cms`,
        });

        // remove home and error folder inside content
        fs.rmSync(`${this._projectDir}/cms/content/home`, {
            recursive: true,
            force: true,
        });
        fs.rmSync(`${this._projectDir}/cms/content/error`, {
            recursive: true,
            force: true,
        });

        Logger.success('Kirby Dependencies installed successfully.');
    }
}

export default SetupSteps;
