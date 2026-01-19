import SetupSteps from './build/setup-steps/setup-steps.js';
import TemplateSteps from './build/template-steps/template-steps.js';
import InitProjectSteps from './build/init-project-steps/init-project-steps.js';

export function main(args) {
    const setupSteps = new SetupSteps(args);
    setupSteps.step1CheckArgs();
    setupSteps.step2InstallingDependencies();

    const templateSteps = new TemplateSteps(
        setupSteps.projectName,
        setupSteps.langs,
        setupSteps.locales,
    );
    templateSteps.createTemplateFiles();

    const initProjectSteps = new InitProjectSteps(
        setupSteps.projectName,
        setupSteps.langs,
        setupSteps.locales,
    );
    initProjectSteps.init();
}

const args = process.argv.slice(2);
main(args);
