import SetupSteps from './build/setup-steps/setup-steps.js';
import TemplateSteps from './build/template-steps/template-steps.js';

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
}

const args = process.argv.slice(2);
main(args);
