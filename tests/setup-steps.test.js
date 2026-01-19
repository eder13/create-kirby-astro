import SetupSteps from '../bin/build/setup-steps/setup-steps';
import { fn } from 'jest-mock';

test('SetupSteps class', () => {
    const setupSteps = new SetupSteps();
    expect(setupSteps).toBeInstanceOf(SetupSteps);

    setupSteps.step1CheckArgs = fn(() => {
        setupSteps._projectName = 'test-project';
        setupSteps._langs = ['en'];
        setupSteps._locales = ['en-US'];
    });
    setupSteps.step2InstallingDependencies = fn();

    setupSteps.args = [
        '--name=test-project',
        '--langs=[en]',
        '--locales=[en-US]',
    ];

    setupSteps.step1CheckArgs();
    setupSteps.step2InstallingDependencies();

    expect(setupSteps._projectName).toBe('test-project');
    expect(setupSteps._langs).toEqual(['en']);
    expect(setupSteps._locales).toEqual(['en-US']);
});

test('SetupSteps args getter and setter', () => {
    const setupSteps = new SetupSteps();

    setupSteps.args = [
        '--name=test-project',
        '--langs=[en]',
        '--locales=[en-US]',
    ];

    expect(setupSteps.args).toEqual([
        '--name=test-project',
        '--langs=[en]',
        '--locales=[en-US]',
    ]);
});
