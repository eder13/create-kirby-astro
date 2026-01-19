import InitProjectSteps from '../bin/build/init-project-steps/init-project-steps';

test('should test init InitProjectSteps', () => {
    const initProjectSteps = new InitProjectSteps();
    expect(initProjectSteps).toBeInstanceOf(InitProjectSteps);
});
